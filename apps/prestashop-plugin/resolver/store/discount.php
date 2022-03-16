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

class ResolverStoreDiscount extends Resolver
{
    public function add($args)
    {
        $errors = array();

        if (($cartRule = new CartRule(CartRule::getIdByCode($args['code'])))
            && Validate::isLoadedObject($cartRule)
        ) {
            if ($error = $cartRule->checkValidity($this->context, false, true)) {
                $errors[] = $error;
            } else {
                $this->context->cart->addCartRule($cartRule->id);
            }
        } else {
            $errors[] = $this->translator->trans(
                'This voucher does not exist.',
                [],
                'Shop.Notifications.Error'
            );
        }

        $this->context->cart->update();

        return array(
            'cart' => $this->load->resolver('store/cart/get'),
            'errors' => $errors
        );
    }

    public function remove($args)
    {
        $this->context->cart->removeCartRule($args['id']);
        CartRule::autoAddToCart($this->context);
        
        $this->context->cart->update();
        
        return $this->load->resolver('store/cart/get');
    }
}