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

class ModelCommonPayment extends Model
{
    public function getPaymentMethod($address_id)
    {
        

        return false;
    }
    
    public function getPaymentMethods($customer)
    {
        $stripe = new \Stripe\StripeClient('sk_test_4zfNwuy6R2m2LkrULQfFuPJX');

        $customer_stripe_id = $this->customerExists($stripe, $customer->id);

        if ($customer_stripe_id) {
            $result = $stripe->paymentMethods->all([
                'type' => 'card',
                'customer' => $customer_stripe_id
            ]);
    
            return $result;
        } else {
            return;
        }
    }
    
    public function removePaymentMethod($customer, $paymentMethod_id)
    {
        $stripe = new \Stripe\StripeClient('sk_test_4zfNwuy6R2m2LkrULQfFuPJX');

        $result = $stripe->paymentMethods->detach($paymentMethod_id, []);

        return $result;
    }
    
    public function addPaymentMethod($customer, $paymentMethod_id)
    {
        $stripe = new \Stripe\StripeClient('sk_test_4zfNwuy6R2m2LkrULQfFuPJX');

        $customer_stripe_id = $this->customerExists($stripe, $customer->id);

        if (!$customer_stripe_id) {
            $stripeCustomer = $stripe->customers->create([
                'email' => $customer->email,
                'name' => $customer->firstname.' '.$customer->lastname,
                'payment_method' => $paymentMethod_id
            ]);
            $this->addPaymentToCustomer($customer->id, $stripeCustomer->id);
        } else {
            $stripe->paymentMethods->attach(
                $paymentMethod_id,
                ['customer' => $customer_stripe_id]
              );
        }

        $paymentMethod = $stripe->paymentMethods->retrieve($paymentMethod_id);

        return [
            'id' => $paymentMethod->id,
            'last4' => $paymentMethod->card->last4,
            'brand' => $paymentMethod->card->brand,
            'expMonth' => $paymentMethod->card->exp_month,
            'expYear' => $paymentMethod->card->exp_year,
        ];
    }

    private function customerExists($stripe, $customer_id)
    {
        $sql = new DbQuery();
        $sql->select('*');
        $sql->from('yownes_payments', 'p');
        $sql->where('p.`customer_id` = '.(int)$customer_id);

        $result = Db::getInstance(_PS_USE_SQL_SLAVE_)->executeS($sql);

        return !empty($result) ? $result[0]['stripe_id'] : false;
    }

    private function addPaymentToCustomer($customer_id, $customer_stripe_id)
    {
        $db = Db::getInstance();

        $db->insert('yownes_payments', array(
            'customer_id' => (int)$customer_id,
            'stripe_id' => $customer_stripe_id,
        ));
    }

    public function createPaymentIntent($customer_id, $cart, $paymentMethod_id) 
    {
        $stripe = new \Stripe\StripeClient('sk_test_4zfNwuy6R2m2LkrULQfFuPJX');

        $customer_stripe_id = $this->customerExists($stripe, $customer_id);
        $amount = (float)$cart->getOrderTotal();
        $amount_in_cents = $amount * 100;

        if ($customer_stripe_id) {
            $creation = [
                'amount' => $amount_in_cents,
                'currency' => 'eur',
                'payment_method_types' => ['card'],
                'customer' => $customer_stripe_id,
            ];
            if ($paymentMethod_id) {
                $creation['payment_method'] = $paymentMethod_id;

            }
            $payment_intent = $stripe->paymentIntents->create($creation);
            return $payment_intent;
        }
    }
}