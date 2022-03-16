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

class ResolverCommonCountry extends Resolver
{
    private $codename = "yownes";

    public function get($args)
    {
        $this->load->model('common/country');

        $country_info = $this->model_common_country->getCountry($args['id']);

        if (!$country_info) {
            return array();
        }

        return array(
           'id' => $args['id'],
           'name' => $country_info['name']
        );
    }

    public function getList($args)
    {
        $this->load->model('common/country');
        $countries = [];

        $filter_data = array(
            'sort' => $args['sort'],
            'order'   => $args['order']
        );

        if ($args['size'] != - 1) {
            $filter_data['start'] = ($args['page'] - 1) * $args['size'];
            $filter_data['limit'] = $args['size'];
        }

        if (!empty($args['search'])) {
            $filter_data['filter_name'] = $args['search'];
        }


        $results = $this->model_common_country->getCountries($filter_data);
        $country_total = $this->model_common_country->getTotalCountries($filter_data);

        if (Configuration::get('PS_RESTRICT_DELIVERED_COUNTRIES')) {
            $availableCountries = Carrier::getDeliveredCountries($this->context->language->id, true, true);
        } else {
            $availableCountries = Country::getCountries($this->context->language->id, true);
        }

        foreach ($results as $value) {
            $countries[] = $this->get(array( 'id' => $value['id_country'] ));
        }

        return array(
            'content'          => $countries,
            'first'            => $args['page'] === 1,
            'last'             => $args['page'] === ceil($country_total / $args['size']),
            'number'           => (int) $args['page'],
            'numberOfElements' => count($countries),
            'size'             => (int) $args['size'],
            'totalPages'       => (int) ceil($country_total / $args['size']),
            'totalElements'    => (int) $country_total,
        );
    }
}
