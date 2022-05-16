import React from "react";
import type { ReactNode } from "react";
import { Tag, Typography } from "antd";
import { useQuery } from "@apollo/client";
import addHours from "date-fns/addHours";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import type { AccountBasicData } from "../../api/types/AccountBasicData";
import { SubscriptionStatus } from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import { MY_ACCOUNT } from "../../api/queries";
import { currencySymbol } from "../../lib/currencySymbol";
import { dateTime, differenceTime, longDate } from "../../lib/parseDate";
import { Loading } from "../atoms";

import type { description } from "./Descriptions";

import {
  Descriptions,
  SubscriptionState,
  TitleWithAction,
  UserState,
  VerifiedState,
} from ".";

const { Paragraph } = Typography;

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  extra?: ReactNode;
  verified?: boolean;
}

function handleSubscription(
  profile: AccountBasicData,
  tooltip: ReactNode,
  t: TFunction
) {
  if (profile?.subscription) {
    if (
      profile.subscription.cancelAtPeriodEnd ||
      profile.subscription.cancelAt
    ) {
      return (
        <>
          <SubscriptionState
            state={profile.subscription.status}
            tooltip={tooltip}
          />
          <Tag>
            {t("cancelAt", {
              date: dateTime(new Date(profile.subscription.cancelAt)),
            })}
          </Tag>
        </>
      );
    } else {
      return (
        <SubscriptionState
          state={profile.subscription.status}
          tooltip={tooltip}
        />
      );
    }
  } else {
    return t("noSubscription");
  }
}

const ProfileInfo = ({ profile, extra, verified }: ProfileInfoProps) => {
  const history = useHistory();
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const { t } = useTranslation();

  if (!data?.me) {
    return <Loading />;
  }

  const subscriptionInfo = profile && profile.subscription && (
    <>
      <span>{profile?.subscription?.plan?.product?.name} </span>
      <span>
        ({profile?.subscription?.plan?.amount}
        {currencySymbol(profile.subscription.plan?.currency ?? "")}
        {"/"}
        {t(`${profile.subscription.plan?.interval}`.toLocaleLowerCase())})
      </span>
      {profile.subscription.status === SubscriptionStatus.ACTIVE &&
        (profile.subscription.cancelAtPeriodEnd ? (
          <span>, {t("canceledAtPeriodEnd")}</span>
        ) : (
          <>
            <span>, {t("currentPeriodEnd").toLocaleLowerCase()} </span>
            <span>
              {longDate(new Date(profile.subscription.currentPeriodEnd))}
            </span>
          </>
        ))}
      {profile.subscription.status === SubscriptionStatus.INCOMPLETE && (
        <span>
          ,{" "}
          {t("incomplete", {
            time: differenceTime(
              addHours(new Date(profile.subscription.created), 23),
              new Date()
            ),
          })}
        </span>
      )}
      {profile.subscription.status ===
        SubscriptionStatus.INCOMPLETE_EXPIRED && (
        <span>, {t("incompleteExpired")}</span>
      )}
      {profile.subscription.status === SubscriptionStatus.PAST_DUE && (
        <span>, {t("pastDue")}</span>
      )}
      {profile.subscription.status === SubscriptionStatus.CANCELED && (
        <span>, {t("canceled")}</span>
      )}
    </>
  );

  const info: description[] = [];
  profile?.username &&
    !data?.me.isStaff &&
    info.push({ title: t("username"), description: profile.username });
  profile?.accountStatus &&
    info.push({
      title: t("accountStatus.title"),
      description: <UserState state={profile.accountStatus} />,
    });
  profile?.email &&
    info.push({ title: t("email"), description: profile.email });
  profile?.id &&
    data?.me.isStaff &&
    info.push({
      title: t("id"),
      description: (
        <Tag>
          <Paragraph copyable>{profile?.id}</Paragraph>
        </Tag>
      ),
    });
  profile?.dateJoined &&
    data?.me.isStaff &&
    info.push({
      title: t("registrationDate"),
      description: longDate(new Date(profile.dateJoined)),
    });
  verified &&
    data?.me.isStaff &&
    info.push({
      title: t("verifiedStatus"),
      description: <VerifiedState verified={profile?.verified} />,
    });
  data?.me.isStaff &&
    info.push({
      title: t("isActive"),
      description: <VerifiedState verified={profile?.isActive} />,
    });
  !data?.me.isStaff &&
    info.push({
      title: t("subscription"),
      description: profile
        ? handleSubscription(profile, subscriptionInfo, t)
        : undefined,
    });

  return (
    <>
      <TitleWithAction
        title={
          data.me.isStaff && profile ? profile?.username : t("profileInfo")
        }
        action={
          !data.me.isStaff
            ? {
                action: () => history.push("/profile/edit"),
                label: t("editProfile"),
                buttonClassName: "button-default-primary",
              }
            : undefined
        }
        extra={data.me.isStaff && extra}
      />
      <Descriptions items={info} />
    </>
  );
};

export default ProfileInfo;
