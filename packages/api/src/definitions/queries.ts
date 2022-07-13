import { gql } from "@apollo/client";

import {
  ADDRESS_FRAGMENT,
  PRODUCT_FRAGMENT,
  PAYMENT_METHOD_FRAGMENT,
  CART_FRAGMENT,
} from "./fragments";

export const HOME = gql`
  query Home {
    home {
      meta {
        title
        description
      }
      banner
      slides {
        speed
        slides {
          id
          imageUrl
          title
          description
          size {
            width
            height
          }
        }
      }
    }
    latestProducts: productsList(
      page: 1
      size: 6
      sort: "date_added"
      order: "DESC"
    ) {
      content {
        ...BasicProduct
      }
    }

    specialProducts: productsList(
      page: 1
      size: 6
      special: true
      sort: "date_added"
      order: "DESC"
    ) {
      content {
        ...BasicProduct
      }
    }

    bestSells {
      ...BasicProduct
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CATEGORIES = gql`
  query Categories {
    categoriesList(parent: 2) {
      content {
        id
        name
        description
        image
        categories {
          id
          name
        }
      }
    }
  }
`;

export const TOP_SALES = gql`
  query TopSales {
    bestSells {
      ...BasicProduct
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PRODUCTS = gql`
  query Products(
    $category: String
    $page: Int
    $search: String
    $filter: String
    $sort: String
    $order: String
  ) {
    productsList(
      category_id: $category
      page: $page
      search: $search
      filter: $filter
      sort: $sort
      order: $order
    ) {
      last
      totalPages
      content {
        ...BasicProduct
      }
      facets {
        label
        type
        multipleSelectionAllowed
        widgetType
        filters {
          label
          type
          value
          active
        }
      }
      sortOrders {
        entity
        label
        field
        direction
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PRODUCT = gql`
  query Product($id: String) {
    product(id: $id) {
      id
      name
      image
      images {
        imageBig
      }
      shortDescription
      description
      price
      special
      stock
      inWishlist
      manufacturer
      onSale
      attributes {
        name
        options
      }
      options {
        name
        type
        values {
          id
          name
        }
      }
    }
  }
`;

export const ABOUT = gql`
  query About {
    page(id: "4") {
      id
      description
    }
    contact {
      store
      address
      email
      telephone
    }
  }
`;

/**
 * CUSTOMER
 */

export const PROFILE = gql`
  query Profile {
    accountCheckLogged {
      status
      customer {
        id
        firstName
        lastName
        email
      }
    }
  }
`;

export const FAVOURITES = gql`
  query Favourites {
    wishlist {
      ...BasicProduct
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const CART = gql`
  query Cart {
    cart {
      ...CartFragment
    }
  }
  ${CART_FRAGMENT}
`;

export const ADDRESS_LIST = gql`
  query AddressList {
    accountAddressList {
      ...AddressFragment
    }
  }
  ${ADDRESS_FRAGMENT}
`;

export const PAYMENT_METHOD_LIST = gql`
  query PaymentMethodList {
    accountPaymentMethodList {
      ...PaymentMethodFragment
    }
  }
  ${PAYMENT_METHOD_FRAGMENT}
`;

export const ORDERS = gql`
  query Orders {
    orders {
      id
      reference
      date
      state
      total
      quantity
    }
  }
`;

export const ORDER = gql`
  query Order($id: String) {
    order(id: $id) {
      id
      reference
      date
      state
      total
      quantity
      shippingAddress {
        ...AddressFragment
      }
      paymentAddress {
        ...AddressFragment
      }
      shippingMethod {
        id
        name
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
      subtotals {
        label
        value
      }
    }
  }
  ${ADDRESS_FRAGMENT}
`;

/**
 *
 * GLOBALS
 *
 */

export const COUNTRIES_LIST = gql`
  query CountriesList {
    countriesList {
      content {
        id
        name
      }
    }
  }
`;

export const ZONES_LIST = gql`
  query ZonesList($countryId: String) {
    zonesList(country_id: $countryId, size: -1) {
      content {
        id
        name
      }
    }
  }
`;

export const CARRIER_LIST = gql`
  query CarrierList {
    carrierList {
      id
      reference
      name
      delay
      price
    }
  }
`;
