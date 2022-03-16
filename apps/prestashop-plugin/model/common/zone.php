<?php
/**
  * 2019 (c) VueFront
 * 2020 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    VueFront, Yownes
 * @copyright Copyright (c) permanent, VueFront
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

class ModelCommonZone extends Model
{
    public function getZone($zone_id)
    {
        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('state', 's');
        $sql->where('s.`id_state` = ' . (int) $zone_id);

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);

        return !empty($result) ? $result[0] : false;
    }

    public function getZones($data)
    {
        $sort = 's.`name`';
        if ($data['sort'] == 'id') {
            $sort = 's.`id_state`';
        }

        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('state', 's');

        if (!empty($data['filter_name'])) {
            $sql->where("s.`name` LIKE '%" . pSQL($data['filter_name']). "%'");
        }

        if (!empty($data['filter_country_id'])) {
            $sql->where("s.`id_country` = " . pSQL($data['filter_country_id']). "");
        }


        $sql->orderBy($sort . ' ' . $data['order']);
        if (!empty($data['limit']) && $data['limit'] != -1) {
            $sql->limit($data['limit'], $data['start']);
        }

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);

        return $result;
    }

    public function getTotalZones($data)
    {
        $sql = new DbQuery();
        $sql->select('count(*)');
        $sql->from('state', 's');

        if (!empty($data['filter_name'])) {
            $sql->where("s.`name` LIKE '%" . pSQL($data['filter_name']). "%'");
        }

        if (!empty($data['filter_country_id'])) {
            $sql->where("s.`id_country` = " . pSQL($data['filter_country_id']). "");
        }

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->getRow($sql);
        return $result['count(*)'];
    }
}
