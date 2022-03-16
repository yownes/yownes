<?php

class ResolverStoreCarrier extends Resolver
{
    public function get()
    {
        $this->load->model('store/carrier');

        $results = $this->model_store_carrier->getCarriers($this->context, $this->translator);

        $carriers = [];

        foreach ($results as $carrier_id => $carrier) {
            $carriers[] = array(
                'id' => $carrier['id'],
                'reference' => $carrier_id,
                'name' => $carrier['name'],
                'delay' => $carrier['delay'],
                'isFree' => $carrier['is_free'],
                'price' => $carrier['price'],
            );
        }
        return $carriers;
    }
}