import { gql } from "@apollo/client";

export const PRODUCT_FRAGMENT = gql`
  fragment BasicProduct on Product {
    id
    name
    price
    special
    image
    manufacturer
    inWishlist
    onSale
  }
`;

export const ADDRESS_FRAGMENT = gql`
  fragment AddressFragment on AccountAddress {
    id
    firstName
    lastName
    company
    address1
    address2
    zone {
      id
      name
    }
    country {
      id
      name
    }
    zipcode
    city
  }
`;

export const PAYMENT_METHOD_FRAGMENT = gql`
  fragment PaymentMethodFragment on AccountPaymentMethod {
    id
    name
    last4
    brand
    expMonth
    expYear
  }
`;

export const CART_FRAGMENT = gql`
  fragment CartFragment on Cart {
    id
    total {
      amount
      value
      label
    }
    subtotals {
      products {
        label
        value
      }
      discounts {
        label
        value
      }
      shipping {
        label
        value
      }
    }
    products {
      key
      quantity
      total
      option {
        name
        value
        type
      }
      product {
        id
        name
        image
        price
      }
    }
    vouchers {
      allowed
      added {
        id
        name
        code
        reduction
      }
    }
    deliveryOption
  }
`;
