import { gql } from "@apollo/client";

import {
  ADDRESS_FRAGMENT,
  CART_FRAGMENT,
  PAYMENT_METHOD_FRAGMENT,
} from "./fragments";

export const LOGIN = gql`
  mutation Login($email: String, $password: String) {
    accountLogin(email: $email, password: $password) {
      token
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;
export const REGISTER = gql`
  mutation Register($customer: CustomerInput) {
    accountRegister(customer: $customer) {
      id
      firstName
      lastName
      email
    }
  }
`;

export const LOGOUT = gql`
  mutation Logout {
    accountLogout {
      status
    }
  }
`;

export const ADD_TO_CART = gql`
  mutation AddToCart($id: String, $quantity: Int, $options: [CartOption]) {
    addToCart(id: $id, quantity: $quantity, options: $options) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_TO_FAVOURITE = gql`
  mutation AddToFavourite($id: Int) {
    addToWishlist(id: $id) {
      id
      inWishlist
    }
  }
`;

export const REMOVE_FAVOURITE = gql`
  mutation RemoveFavourite($id: String) {
    removeWishlist(id: $id) {
      id
      inWishlist
    }
  }
`;

export const REMOVE_FROM_CART = gql`
  mutation RemoveFromCart($key: String) {
    removeCart(key: $key) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const UPDATE_CART = gql`
  mutation UpdateCart($key: String, $qty: Int) {
    updateCart(key: $key, quantity: $qty) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const ADD_ADDRESS = gql`
  mutation AddAddress($address: AccountAddressInput) {
    accountAddAddress(address: $address) {
      ...AddressFragment
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const EDIT_ADDRESS = gql`
  mutation EditAddress($id: String, $address: AccountAddressInput) {
    accountEditAddress(id: $id, address: $address) {
      ...AddressFragment
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const DELETE_ADDRESS = gql`
  mutation DeleteAddress($id: String) {
    accountRemoveAddress(id: $id) {
      ...AddressFragment
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod($paymentMethod: String) {
    accountAddPaymentMethod(paymentMethod: $paymentMethod) {
      ...PaymentMethodFragment
    }
  }
  ${PAYMENT_METHOD_FRAGMENT}
`;

export const DELETE_PAYMENT_METHOD = gql`
  mutation DeletePaymentMethod($id: String) {
    accountRemovePaymentMethod(id: $id) {
      ...PaymentMethodFragment
    }
  }
  ${PAYMENT_METHOD_FRAGMENT}
`;

export const CREATE_PAYMENT_INTENT = gql`
  mutation CreatePaymentIntent($paymentMethod: String) {
    createPaymentIntent(paymentMethod: $paymentMethod) {
      clientSecret
    }
  }
`;

export const CONFIRM_ORDER = gql`
  mutation ConfirmOrder($paymentAddress: String, $shippingAddress: String) {
    confirmOrder(
      paymentAddress: $paymentAddress
      shippingAddress: $shippingAddress
    ) {
      order {
        id
      }
    }
  }
`;

export const ADD_DISCOUNT = gql`
  mutation AddDiscount($code: String) {
    addDiscount(code: $code) {
      cart {
        ...CartFragment
      }
      errors
    }
  }
  ${CART_FRAGMENT}
`;

export const REMOVE_DISCOUNT = gql`
  mutation RemoveDiscount($id: String) {
    removeDiscount(id: $id) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const SET_DELIVERY_OPTION = gql`
  mutation SetDeliveryOption($option: String) {
    setDeliveryOption(option: $option) {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;
