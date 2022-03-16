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

class ResolverStoreCurrency extends Resolver
{
    private $codename = "yownes";

    public function get()
    {
        $this->load->model('store/currency');
        $results = $this->model_store_currency->getCurrencies();
        $currencies = array();

        foreach ($results as $result) {
            $currencies[] = array(
                'title'        => $result['name'],
                'code'         => $result['id_currency'],
                'symbol_left'  => '',
                'symbol_right' => '',
                'active' => $this->context->cookie->id_currency == $result['id_currency']
            );
        }

        return $currencies;
    }

    public function edit($args)
    {
        $this->context->cookie->id_currency = $args['code'];

        return $this->get();
    }
}
