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

class ModelCommonAddress extends Model
{
    public function getAddress($address_id)
    {
        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('address', 'a');
        $sql->where('a.`id_address` = '.(int)$address_id);

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);

        return !empty($result) ? $result[0] : false;
    }

    public function parseAddress($id, $address)
    {
        return  array(
            'id' => $id,
            'firstName' => $address['firstname'],
            'lastName' => $address['lastname'],
            'company' => $address['company'],
            'address1' => $address['address1'],
            'address2' => $address['address2'],
            'zoneId' => $address['id_state'],
            'zone' => $this->load->resolver('common/zone/get', array(
                'id' => $address['id_state']
            )),
            'country' => $this->load->resolver('common/country/get', array(
                'id' => $address['id_country']
            )),
            'countryId' => $address['id_country'],
            'city' => $address['city'],
            'zipcode' => $address['postcode']
        );
    }
}
