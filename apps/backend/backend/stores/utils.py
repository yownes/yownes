import builtins
import datetime
from datetime import date
import logging
from pydash import py_
import pytz
import sys
from typing import Optional, Sequence

import urllib.request
from urllib import error

from .api.types import (BuildsData, BuildStatusEnum, BuildData)


def _is_store_link_valid(store_link: str) -> bool:
    logging.warning("_is_store_link_valid")
    logging.warning(store_link)
    try:
        return urllib.request.urlopen(store_link+"/module/yownes/graphql").getcode() == 200
    except:
        logging.warning(sys.exc_info()[0])
        return False


def _is_template_link_valid(template_link: str) -> bool:
    logging.warning("_is_template_link_valid")
    logging.warning(template_link)
    try:
        return urllib.request.urlopen(template_link).getcode() == 200
    except:
        logging.warning(sys.exc_info()[0])
        return False


def _add_year_to_date(_date: date, _num: int) -> date:
    try:
        return _date.replace(year = _date.year + _num)
    except ValueError:
        return _date + (date(_date.year + _num, 3, 1) - date(_date.year, 3, 1))


def _get_renewal_build(_builds: Sequence[BuildsData]) -> BuildData:
    return py_.find(
        _builds,
        lambda build:
            _add_year_to_date(build.date, -1) <= pytz.utc.localize(datetime.datetime.now() )and build.date >= _add_year_to_date(pytz.utc.localize(datetime.datetime.now()), -1))


def _count_current_builds(_builds: Sequence[BuildsData], _date: Optional[date]) -> int:
    current_builds = []
    if _date:
        current_builds = py_.filter(_builds, lambda build: _add_year_to_date(_date, -1) <= build.date and build.date <= _date) # <-- FALLA AQUI
    return len(current_builds)


def _get_renewal_date(_date: date) -> date:
    renewal = False
    n = 0
    renewal_date = pytz.utc.localize(datetime.datetime.now())
    while not renewal:
        n+=1
        renewal_date = _add_year_to_date(_date, n)
        renewal = _date <= pytz.utc.localize(datetime.datetime.now()) and pytz.utc.localize(datetime.datetime.now()) <= renewal_date
    return renewal_date


def _available_builds(_builds: Sequence[BuildsData], _allowed: int) -> int:
    renewal_build = _get_renewal_build(_builds)
    renewal_date = None
    if renewal_build:
        renewal_date = _get_renewal_date(renewal_build.date)
    current_builds = _count_current_builds(_builds, renewal_date)
    return _allowed - current_builds


def _has_build_in_progress(_builds: Sequence[BuildsData]) -> bool:
    if not _builds:
        return False
    build_date: date = _builds[len(_builds) - 1].date
    if (pytz.utc.localize(datetime.datetime.now() - datetime.timedelta(days=365))) <= build_date <= pytz.utc.localize(datetime.datetime.now()):
        status = _builds[len(_builds) - 1].build_status
        if status != BuildStatusEnum.STALLED and status != BuildStatusEnum.PUBLISHED:
            return True
    return False
