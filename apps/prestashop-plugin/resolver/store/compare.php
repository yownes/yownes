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

class ResolverStoreCompare extends Resolver
{
    public function add($args)
    {
        $this->load->model('store/compare');

        $this->model_store_compare->addCompare($args['id']);

        return $this->get();
    }
    public function remove($args)
    {
        $this->load->model('store/compare');
        $this->model_store_compare->deleteCompare($args['id']);

        return $this->get();
    }
    public function get()
    {
        $this->load->model('store/compare');
        $compare = array();
        $results = $this->model_store_compare->getCompare();

        foreach ($results as $product_id) {
            $compare[] = $this->load->resolver('store/product/get', array('id' => $product_id));
        }

        return $compare;
    }
}
