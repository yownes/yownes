import { gql } from "@apollo/client";

export const ME = gql`
  query Me {
    me {
      id
      email
      username
      isStaff
    }
  }
`;

export const INVOICE_FRAGMENT = gql`
  fragment InvoiceBasicData on StripeInvoiceType {
    id
    amountDue
    amountPaid
    amountRemaining
    billingReason
    charges {
      edges {
        node {
          id
          amount
          created
          currency
          failureMessage
          paid
          paymentIntent {
            id
            stripeId
          }
          paymentMethod {
            id
            stripeId
            card
          }
          status
          stripeId
        }
      }
    }
    created
    currency
    customer {
      id
      address
      balance
      email
      name
    }
    endingBalance
    invoiceitems {
      edges {
        node {
          id
          amount
          currency
          description
          periodEnd
          periodStart
          price {
            id
            unitAmount
          }
          proration
          quantity
        }
      }
    }
    invoicePdf
    nextPaymentAttempt
    number
    paymentIntent {
      id
      lastPaymentError
      paymentMethod {
        id
        card
      }
    }
    startingBalance
    status
    stripeId
    subscription {
      id
      status
      stripeId
    }
    subtotal
    tax
    taxPercent
    total
  }
`;

export const ACCOUNT_BASIC_DATA_FRAGMENT = gql`
  fragment AccountBasicData on UserNode {
    id
    username
    email
    accountStatus
    verified
    isActive
    isStaff
    dateJoined
    customer {
      id
      address
      name
      phone
      metadata
    }
    subscription {
      id
      cancelAt
      canceledAt
      cancelAtPeriodEnd
      created
      currentPeriodEnd
      currentPeriodStart
      customer {
        id
        address
        balance
        currency
        name
        phone
        metadata
      }
      endedAt
      invoices {
        edges {
          node {
            id
            ...InvoiceBasicData
          }
        }
      }
      stripeId
      status
      plan {
        id
        amount
        interval
        currency
        stripeId
        product {
          id
          description
          features {
            edges {
              node {
                id
                name
              }
            }
          }
          metadata
          name
          prices {
            edges {
              node {
                id
                stripeId
                recurring
                unitAmount
                active
              }
            }
          }
        }
      }
    }
  }
  ${INVOICE_FRAGMENT}
`;

export const APP_FRAGMENT = gql`
  fragment AppBasicData on StoreAppType {
    id
    logo
    name
    isActive
    apiLink
    storeLinks {
      ios
      android
    }
    builds {
      edges {
        node {
          id
          buildStatus
          buildId
          date
        }
      }
    }
  }
`;

export const MY_PAYMENT_METHODS = gql`
  query MyPaymentMethods {
    me {
      id
      customer {
        id
        defaultPaymentMethod {
          id
          stripeId
        }
        paymentMethods {
          edges {
            node {
              id
              stripeId
              card
              billingDetails
              metadata
            }
          }
        }
      }
    }
  }
`;

export const MY_ACCOUNT = gql`
  query MyAccount {
    me {
      id
      ...AccountBasicData
    }
  }
  ${ACCOUNT_BASIC_DATA_FRAGMENT}
`;

export const INVOICES = gql`
  query Invoices($userId: ID!) {
    invoices(id: $userId) {
      edges {
        node {
          id
          ...InvoiceBasicData
        }
      }
    }
  }
  ${INVOICE_FRAGMENT}
`;

export const UPCOMING_INVOICE = gql`
  query UpcomingInvoice($cId: ID!, $sId: ID!) {
    upcominginvoice(cus: $cId, sub: $sId) {
      id
      amountRemaining
      currency
      endingBalance
      nextPaymentAttempt
      number
      startingBalance
    }
  }
`;

export const TEMPLATES = gql`
  query Templates {
    templates {
      edges {
        node {
          id
          isActive
          name
          previewImg
          url
          snack
        }
      }
    }
  }
`;

export const APPS = gql`
  query Apps($is_active: Boolean!) {
    apps(isActive: $is_active) {
      edges {
        node {
          ...AppBasicData
        }
      }
    }
  }
  ${APP_FRAGMENT}
`;

export const APP_OWNER_ACTIVE = gql`
  query AppOwnerActive($id: ID!) {
    appcustomer(id: $id) {
      isOwnerAndActive
    }
  }
`;

export const APP = gql`
  query App($id: ID!) {
    app(id: $id) {
      id
      name
      color {
        color
        text
      }
      customer {
        id
      }
      apiLink
      template {
        id
      }
      logo
      builds {
        edges {
          node {
            id
            buildStatus
            date
          }
        }
      }
      storeLinks {
        ios
        android
      }
    }
  }
`;

export const APP_PAYMENTS = gql`
  query AppPayments($id: ID!) {
    app(id: $id) {
      id
      paymentMethod {
        id
        stripeTestPublic
        stripeTestSecret
        stripeProdPublic
        stripeProdSecret
      }
    }
  }
`;

export const PRODUCT_FRAGMENT = gql`
  fragment ProductBasicData on StripeProductType {
    id
    name
    description
    metadata
    active
    prices {
      edges {
        node {
          id
          stripeId
          currency
          recurring
          unitAmount
          active
        }
      }
    }
  }
`;

export const PLANS = gql`
  query Plans {
    features {
      edges {
        node {
          id
          name
        }
      }
    }
    products {
      edges {
        node {
          features {
            edges {
              node {
                id
              }
            }
          }
          ...ProductBasicData
        }
      }
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const PLAN = gql`
  query Plan($id: ID!) {
    product(id: $id) {
      features {
        edges {
          node {
            id
            name
          }
        }
      }
      ...ProductBasicData
    }
  }
  ${PRODUCT_FRAGMENT}
`;

export const SUBSCRIPTIONS = gql`
  query Subscriptions($userId: ID!) {
    subscriptions(id: $userId) {
      edges {
        node {
          id
          stripeId
          status
          created
          cancelAt
          canceledAt
          cancelAtPeriodEnd
          endedAt
          plan {
            id
            amount
            currency
            interval
            product {
              id
              name
              description
              features {
                edges {
                  node {
                    id
                    name
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

/**
 * ADMIN
 */

export const CLIENTS = gql`
  query Clients($first: Int, $last: Int) {
    users(first: $first, last: $last) {
      edges {
        node {
          id
          username
          apps {
            edges {
              node {
                id
              }
            }
          }
          subscription {
            plan {
              product {
                id
                name
              }
            }
          }
          accountStatus
          verified
          isActive
          isStaff
          dateJoined
        }
      }
    }
  }
`;

export const CLIENT = gql`
  query Client($id: ID!) {
    user(id: $id) {
      id
      ...AccountBasicData
      customer {
        id
        defaultPaymentMethod {
          id
          stripeId
        }
        paymentMethods {
          edges {
            node {
              id
              stripeId
              card
              billingDetails
              metadata
            }
          }
        }
      }
      apps {
        edges {
          node {
            ...AppBasicData
          }
        }
      }
    }
  }
  ${ACCOUNT_BASIC_DATA_FRAGMENT}
  ${APP_FRAGMENT}
`;

export const BUILDS = gql`
  query Builds($first: Int, $last: Int) {
    builds(first: $first, last: $last) {
      edges {
        node {
          id
          buildId
          date
          buildStatus
          app {
            id
            name
            isActive
            customer {
              id
              username
            }
          }
        }
      }
    }
  }
`;

export const LIMIT = gql`
  query LimitBuilds {
    configs {
      edges {
        node {
          id
          limit
        }
      }
    }
  }
`;

export const TEMPLATE = gql`
  query Template($id: ID!) {
    template(id: $id) {
      id
      isActive
      name
      previewImg
      url
      snack
    }
  }
`;
