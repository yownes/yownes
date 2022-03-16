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

use PrestaShop\PrestaShop\Adapter\ServiceLocator;

class ResolverCommonAccount extends Resolver
{
    public function login($args)
    {
        $this->load->model('common/customer');
        $customer = new Customer();

        $authentication = $customer->getByEmail(
            $args["email"],
            $args["password"]
        );

        if (isset($authentication->active) && !$authentication->active) {
            throw new Exception('Your account isn\'t available at this time, please contact us');
        } elseif (!$authentication || !$customer->id || $customer->is_guest) {
            throw new Exception('Authentication failed.');
        } else {
            if (_PS_VERSION_ > '1.7.0.0') {
                $this->context->updateCustomer($customer);
            } else {
                $this->model_common_customer->updateCustomer($customer);
            }

            Hook::exec('actionAuthentication', ['customer' => $this->context->customer]);

            CartRule::autoRemoveFromCart($this->context);
            CartRule::autoAddToCart($this->context);
        }

        $aux = $this->context->cookie->write();
        $token = $_COOKIE;
        $token2 = $_SERVER;
        return array(
            'token' => (int) Configuration::get('PS_COOKIE_LIFETIME_FO'),
            'customer' => $this->get($customer->id)
        );
    }

    public function logout()
    {
        $this->context->cookie->logout();

        return array(
            'status' => false
        );
    }

    public function register($args)
    {
        $customerData = $args['customer'];

        if ($this->context->customer->getByEmail($customerData['email'])) {
            throw new Exception('Warning: E-Mail Address is already registered');
        }

        $customer = new Customer();

        $customer->firstname = $customerData['firstName'];
        $customer->lastname = $customerData['lastName'];
        $customer->email = $customerData['email'];
        
        if (_PS_VERSION_ > '1.7.0.0') {
            $crypto = ServiceLocator::get('\\PrestaShop\\PrestaShop\\Core\\Crypto\\Hashing');
            $customer->passwd = $crypto->hash($customerData['password']);
        } else {
            $customer->passwd = Tools::encrypt($customerData['password']);
        }
       
        $customer->save();

        return $this->get($customer->id);
    }

    public function edit($args)
    {
        $customerData = $args['customer'];

        $this->context->customer->email = $customerData['email'];
        $this->context->customer->firstname = $customerData['firstName'];
        $this->context->customer->lastname = $customerData['lastName'];

        if (!$this->context->customer->save()) {
            throw new Exception("Update failed");
        }

        return $this->get($this->context->cookie->id_customer);
    }

    public function editPassword($args)
    {
        if (_PS_VERSION_ > '1.7.0.0') {
            $crypto = ServiceLocator::get('\\PrestaShop\\PrestaShop\\Core\\Crypto\\Hashing');
            $this->context->customer->passwd = $crypto->hash($args['password']);
        } else {
            $this->context->customer->passwd = Tools::encrypt($args['password']);
        }


        if (!$this->context->customer->save()) {
            throw new Exception("Update failed");
        }

        return $this->get($this->context->cookie->id_customer);
    }

    public function get($user_id)
    {
        $customer = new Customer($user_id);

        return array(
            'id' => $customer->id,
            'email' => $customer->email,
            'firstName' => $customer->firstname,
            'lastName' => $customer->lastname
        );
    }

    public function isLogged()
    {
        $customer = array();
        
        if ($this->context->cookie->isLogged()) {
            $customer = $this->get($this->context->cookie->id_customer);
        }

        return array(
            'status' => $this->context->cookie->isLogged(),
            'customer' => $customer
        );
    }

    public function address($args)
    {
        $this->load->model('common/address');

        $result = $this->model_common_address->getAddress($args['id']);

        return $this->model_common_address->parseAddress($args['id'], $result);
    }

    public function addressList()
    {
        $address = array();
        
        $result = $this->context->customer->getAddresses($this->context->cookie->id_lang);

        foreach ($result as $value) {
            $address[] = $this->address(array('id' => $value['id_address']));
        }

        return $address;
    }

    public function editAddress($args)
    {
        $addressData = $args['address'];
        $address = new Address($args['id']);
        $address->city = $addressData['city'];
        $address->company = $addressData['company'];
        $address->id_country = $addressData['countryId'];
        $address->firstname = $addressData['firstName'];
        $address->lastname = $addressData['lastName'];
        $address->postcode = $addressData['zipcode'];
        $address->id_state = $addressData['zoneId'];
        $address->address1 = $addressData['address1'];
        $address->address2 = $addressData['address2'];

        if (!$address->save()) {
            throw new Exception("Update failed");
        }

        return $this->address($args);
    }

    public function addAddress($args)
    {
        $addressData = $args['address'];

        $address = new Address();
        $address->alias = 'My Address';
        $address->id_customer = $this->context->cookie->id_customer;
        $address->city = $addressData['city'];
        $address->company = $addressData['company'];
        $address->id_country = $addressData['countryId'];
        $address->firstname = $addressData['firstName'];
        $address->lastname = $addressData['lastName'];
        $address->postcode = $addressData['zipcode'];
        $address->id_state = $addressData['zoneId'];
        $address->address1 = $addressData['address1'];
        $address->address2 = $addressData['address2'];


        if (!$address->save()) {
            throw new Exception("Update failed");
        }

        return $this->address(array('id' => $address->id));
    }

    public function removeAddress($args)
    {
        $address = new Address($args['id']);

        if (!$address->delete()) {
            throw new Exception("Delete failed");
        }

        return $this->addressList($args);
    }

    public function paymentMethodList()
    {
        $paymentMethods = array();
        $this->load->model('common/payment');

        $result = $this->model_common_payment->getPaymentMethods($this->context->customer);

        foreach ($result as $value) {
            $paymentMethods[] = array(
                'id' => $value['id'],
                'last4' => $value['card']['last4'],
                'brand' => $value['card']['brand'],
                'expMonth' => $value['card']['exp_month'],
                'expYear' => $value['card']['exp_year']
            );
        }

        return $paymentMethods;
    }

    public function addPaymentMethod($args)
    {
        $this->load->model('common/payment');

        $result = $this->model_common_payment->addPaymentMethod($this->context->customer, $args['paymentMethod']);
        return $result;
    }
    
    public function removePaymentMethod($args)
    {
        $this->load->model('common/payment');

        $result = $this->model_common_payment->removePaymentMethod($this->context->customer, $args['id']);
        return $this->paymentMethodList();
    }
}
