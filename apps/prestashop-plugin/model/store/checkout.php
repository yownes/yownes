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
 *
 * @version   0.1.0
 */


class ModelStoreCheckout extends Model {
    public function getJwt($codename) {
        $option = Configuration::get('yownes-apps');

        $setting = array();

        try {
            $setting = Tools::jsonDecode($option, true);
        } catch(Exception $e) {

        }

        $result = false;

        foreach ($setting as $key => $value) {
            if($value['codename'] == $codename) {
                $result = $value['jwt'];
            }
        }

        return $result;
    }
    public function requestCheckout($query, $variables) {
        $jwt = $this->getJwt('yownes-checkout-app');
        
        $ch = curl_init();  

        $requestData = array(
            'operationName' => null,
            'variables' => $variables,
            'query' => $query
        );

        $headr = array();
        
        $headr[] = 'Content-type: application/json';
        $headr[] = 'Authorization: '.$jwt;

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1); 
        curl_setopt($ch, CURLOPT_HTTPHEADER,$headr);
        curl_setopt($ch, CURLOPT_POST,true);
        curl_setopt($ch, CURLOPT_POSTFIELDS,     json_encode($requestData, JSON_FORCE_OBJECT) ); 
        // curl_setopt($ch, CURLOPT_URL, 'http://localhost:3005/graphql'); 
        curl_setopt($ch, CURLOPT_URL, 'https://api.checkout.yownes.com/graphql'); 

        $result = curl_exec($ch); 

        $result = json_decode($result, true);

        return $result['data'];
    }
}