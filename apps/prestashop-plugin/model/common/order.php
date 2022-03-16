<?php

/**
 * 2021 (c) Yownes
 *
 * MODULE Yownes
 *
 * @author    Yownes
 * @copyright Copyright (c) permanent, Yownes
 * @license   MIT
 * @version   0.1.0
 */

use PrestaShop\PrestaShop\Adapter\Presenter\Order\OrderPresenter;

 class ModelCommonOrder extends Model 
 {
    public function getOrders($customer_id)
    {
        $orders = [];
        $order_presenter = new OrderPresenter();
        $customer_orders = Order::getCustomerOrders($customer_id);
        foreach ($customer_orders as $customer_order) {
            $order = new Order((int) $customer_order['id_order']);
            $op = $order_presenter->present($order);
            
            $orders[] = array(
                'id' => $customer_order['id_order'],
                'reference' => $op->details->reference,
                'date' => $op->details->order_date,
                'total' => $op->totals['total']['value'],
                'state' => $op->history['current']['ostate_name']
            );
        }

        return $orders;
    }
    
    public function getOrder($customer_id, $order_id)
    {
        $order_presenter = new OrderPresenter();
        
        $order = new Order((int) $order_id);
        $op = $order_presenter->present($order);
            
        $order = array(
            'id' => $order_id,
            'reference' => $op->details->reference,
            'date' => $op->details->order_date,
            'total' => $op->totals['total']['value'],
            'state' => $op->history['current']['ostate_name'],
            'shippingAddress' => $op->addresses['delivery'],
            'paymentAddress' => $op->addresses['invoice'],
            'shippingMethod' => $op->carrier,
            'products' => $op->products,
            'subtotals' => $op->subtotals
        );

        return $order;
    }
 }