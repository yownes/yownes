import { gql } from "@apollo/client";
import { INVOICE_FRAGMENT } from "./queries";

/**
 * AUTH
 */

export const TOKEN_AUTH = gql`
  mutation TokenAuth($password: String!, $email: String, $username: String) {
    tokenAuth(password: $password, email: $email, username: $username) {
      token
      refreshToken
      success
      errors
      user {
        id
        email
        username
        firstName
        lastName
        isStaff
        verified
      }
    }
  }
`;

export const REGISTER = gql`
  mutation Register(
    $email: String!
    $username: String!
    $password1: String!
    $password2: String!
  ) {
    register(
      email: $email
      username: $username
      password1: $password1
      password2: $password2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const VERIFY_TOKEN = gql`
  mutation VerifyToken($token: String!) {
    verifyToken(token: $token) {
      payload
      success
      errors
    }
  }
`;

export const VERIFY_ACCOUNT = gql`
  mutation VerifyAccount($token: String!) {
    verifyAccount(token: $token) {
      success
      errors
    }
  }
`;

export const REFRESH_TOKEN = gql`
  mutation RefreshToken($refreshToken: String!) {
    refreshToken(refreshToken: $refreshToken) {
      token
      refreshToken
      success
      errors
    }
  }
`;

export const PASSWORD_CHANGE = gql`
  mutation PasswordChange(
    $oldPassword: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    passwordChange(
      oldPassword: $oldPassword
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
      token
      refreshToken
    }
  }
`;

export const SEND_PASSWORD_RESET_EMAIL = gql`
  mutation SendPasswordResetEmail($email: String!) {
    sendPasswordResetEmail(email: $email) {
      success
      errors
    }
  }
`;

export const PASSWORD_RESET = gql`
  mutation PasswordReset(
    $token: String!
    $newPassword1: String!
    $newPassword2: String!
  ) {
    passwordReset(
      token: $token
      newPassword1: $newPassword1
      newPassword2: $newPassword2
    ) {
      success
      errors
    }
  }
`;

/**
 * APP
 */

export const UPDATE_APP = gql`
  mutation UpdateApp($data: StoreAppInput!, $id: ID!) {
    updateApp(data: $data, id: $id) {
      ok
      error
    }
  }
`;

export const DELETE_APP = gql`
  mutation DeleteApp($id: ID!) {
    deleteApp(id: $id) {
      ok
      error
    }
  }
`;

export const MODIFY_APP_PAYMENT = gql`
  mutation ModifyAppPayment($data: PaymentMethodAppInput!, $appId: ID!) {
    modifyPaymentMethodApp(data: $data, storeAppId: $appId) {
      ok
      error
    }
  }
`;

export const CREATE_APP = gql`
  mutation CreateApp($data: StoreAppInput!) {
    createApp(data: $data) {
      ok
      error
      storeApp {
        id
        logo
        name
        storeLinks {
          ios
          android
        }
        builds {
          edges {
            node {
              id
              buildStatus
            }
          }
        }
      }
    }
  }
`;

export const GENERATE_APP = gql`
  mutation GenerateApp($appId: ID!) {
    generateApp(id: $appId) {
      ok
      error
      build {
        id
        buildStatus
        date
      }
    }
  }
`;

export const RESTORE_APP = gql`
  mutation RestoreApp($id: ID!) {
    restoreApp(id: $id) {
      ok
      error
    }
  }
`;

/**
 * ACCOUNT
 */

export const DELETE_ACCOUNT = gql`
  mutation DeleteAccount($password: String!) {
    deleteAccount(password: $password) {
      success
      errors
    }
  }
`;

export const BAN_USER = gql`
  mutation BanUser($ban: Boolean!, $userId: ID!) {
    banUser(ban: $ban, userId: $userId) {
      ok
      error
    }
  }
`;

export const CHANGE_VERIFIED = gql`
  mutation ChangeVerified($verify: Boolean!, $userId: ID!) {
    changeVerified(verify: $verify, userId: $userId) {
      ok
      error
    }
  }
`;

export const DELETE_CLIENT = gql`
  mutation DeleteClient($active: Boolean!, $userId: ID!) {
    deleteClient(active: $active, userId: $userId) {
      ok
      error
    }
  }
`;

export const UPDATE_CUSTOMER = gql`
  mutation UpdateCustomer($customer: CustomerInput!, $userId: ID!) {
    updateCustomer(customer: $customer, userId: $userId) {
      ok
      error
      customer {
        id
        address
        name
        phone
        metadata
      }
    }
  }
`;

/**
 * PAYMENTS
 */

export const ADD_PAYMENT_METHOD = gql`
  mutation AddPaymentMethod(
    $isDefault: Boolean
    $paymentMethodId: ID!
    $userId: ID
  ) {
    addPaymentMethod(
      isDefault: $isDefault
      paymentMethodId: $paymentMethodId
      userId: $userId
    ) {
      ok
      error
    }
  }
`;

export const CREATE_PAYMENT_METHOD = gql`
  mutation CreatePaymentMethod($payment: CreatePaymentInput!) {
    createPaymentMethod(payment: $payment) {
      ok
      error
      id
    }
  }
`;

export const UPDATE_PAYMENT_METHOD = gql`
  mutation UpdatePaymentMethod(
    $id: ID!
    $paymentMethodId: ID!
    $payment: PaymentInput!
  ) {
    updatePaymentMethod(
      id: $id
      paymentMethodId: $paymentMethodId
      payment: $payment
    ) {
      ok
      error
    }
  }
`;

export const REMOVE_PAYMENT_METHOD = gql`
  mutation RemovePaymentMethod($paymentMethodId: ID!) {
    detachPaymentMethod(paymentMethodId: $paymentMethodId) {
      ok
      error
    }
  }
`;

export const SUBSCRIPTION_BASIC_DATA_FRAGMENT = gql`
  fragment SubscriptionBasicData on StripeSubscriptionType {
    id
    cancelAt
    canceledAt
    cancelAtPeriodEnd
    customer {
      id
      balance
      currency
    }
    currentPeriodEnd
    currentPeriodStart
    endedAt
    invoices {
      edges {
        node {
          ...InvoiceBasicData
        }
      }
    }
    status
  }
  ${INVOICE_FRAGMENT}
`;

export const PAY_INVOICE = gql`
  mutation PayInvoice($invoiceId: ID!) {
    payInvoice(invoiceId: $invoiceId) {
      ok
      error
      invoice {
        ...InvoiceBasicData
      }
    }
  }
  ${INVOICE_FRAGMENT}
`;

export const SUBSCRIBE = gql`
  mutation Subscribe($paymentMethodId: ID!, $priceId: ID!) {
    subscribe(paymentMethodId: $paymentMethodId, priceId: $priceId) {
      ok
      error
      subscription {
        ...SubscriptionBasicData
      }
      accountStatus
    }
  }
  ${SUBSCRIPTION_BASIC_DATA_FRAGMENT}
`;

export const UNSUBSCRIBE = gql`
  mutation Unsubscribe($userId: ID!, $atPeriodEnd: Boolean!) {
    dropOut(userId: $userId, atPeriodEnd: $atPeriodEnd) {
      ok
      error
      subscription {
        ...SubscriptionBasicData
      }
      accountStatus
    }
  }
  ${SUBSCRIPTION_BASIC_DATA_FRAGMENT}
`;

export const RESUBSCRIBE = gql`
  mutation Resubscribe($userId: ID!) {
    takeUp(userId: $userId) {
      ok
      error
      subscription {
        ...SubscriptionBasicData
      }
    }
  }
  ${SUBSCRIPTION_BASIC_DATA_FRAGMENT}
`;

export const UPDATE_SUBSCRIPTION = gql`
  mutation UpdateSubscription($priceId: ID!, $subscriptionId: ID!) {
    updateSubscription(priceId: $priceId, subscriptionId: $subscriptionId) {
      ok
      error
      subscription {
        ...SubscriptionBasicData
      }
      accountStatus
    }
  }
  ${SUBSCRIPTION_BASIC_DATA_FRAGMENT}
`;

/**
 * TEMPLATES
 */

export const CREATE_TEMPLATE = gql`
  mutation CreateTemplate($template: TemplateInput!) {
    createTemplate(data: $template) {
      ok
      error
      template {
        id
        isActive
        name
        previewImg
        url
        snack
      }
    }
  }
`;

export const UPDATE_TEMPLATE = gql`
  mutation UpdateTemplate($id: ID!, $template: TemplateInput!) {
    updateTemplate(templateId: $id, data: $template) {
      ok
      error
    }
  }
`;

/**
 * PLANS/PRODUCTS
 */

export const CREATE_PLAN = gql`
  mutation CreatePlan($plan: ProductInput!) {
    createPlan(data: $plan) {
      ok
      error
      plan {
        id
        active
        description
        features {
          edges {
            node {
              id
            }
          }
        }
        metadata
        name
        prices {
          edges {
            node {
              id
            }
          }
        }
      }
    }
  }
`;

export const UPDATE_PLAN = gql`
  mutation UpdatePlan($id: ID!, $plan: ProductInput!) {
    updatePlan(planId: $id, data: $plan) {
      ok
      error
    }
  }
`;

/**
 * PRICES
 */

export const CREATE_PRICE = gql`
  mutation CreatePrice($id: ID!, $price: PriceInput!) {
    createPrice(productId: $id, data: $price) {
      ok
      error
      price {
        id
        stripeId
        currency
        recurring
        unitAmount
        active
      }
    }
  }
`;

export const UPDATE_PRICE = gql`
  mutation UpdatePrice($id: ID!, $active: Boolean!) {
    updatePrice(priceId: $id, active: $active) {
      ok
      error
    }
  }
`;

/**
 * FEATURES
 */

export const CREATE_FEATURE = gql`
  mutation CreateFeature($feature: FeatureInput!) {
    createFeature(data: $feature) {
      ok
      error
      feature {
        id
        name
      }
    }
  }
`;

export const UPDATE_FEATURE = gql`
  mutation UpdateFeature($id: ID!, $feature: FeatureInput!) {
    updateFeature(featureId: $id, data: $feature) {
      ok
      error
    }
  }
`;

export const DELETE_FEATURE = gql`
  mutation DeleteFeature($id: ID!) {
    deleteFeature(featureId: $id) {
      ok
      error
    }
  }
`;
