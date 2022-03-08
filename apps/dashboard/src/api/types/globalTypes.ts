/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

//==============================================================
// START Enums and Input Objects
//==============================================================

/**
 * An enumeration.
 */
export enum AccountAccountStatus {
  BANNED = "BANNED",
  PAID_ACCOUNT = "PAID_ACCOUNT",
  REGISTERED = "REGISTERED",
  WAITING_PAYMENT = "WAITING_PAYMENT",
}

/**
 * An enumeration.
 */
export enum AccountStatus {
  BANNED = "BANNED",
  PAID_ACCOUNT = "PAID_ACCOUNT",
  REGISTERED = "REGISTERED",
  WAITING_PAYMENT = "WAITING_PAYMENT",
}

/**
 * An enumeration.
 */
export enum BuildBuildStatus {
  GENERATING = "GENERATING",
  PUBLISHED = "PUBLISHED",
  QUEUED = "QUEUED",
  STALLED = "STALLED",
  UPLOADING = "UPLOADING",
  WAITING = "WAITING",
}

/**
 * An enumeration.
 */
export enum ChargeStatus {
  FAILED = "FAILED",
  PENDING = "PENDING",
  SUCCEEDED = "SUCCEEDED",
}

export enum IntervalEnum {
  DAY = "DAY",
  MONTH = "MONTH",
  WEEK = "WEEK",
  YEAR = "YEAR",
}

/**
 * An enumeration.
 */
export enum InvoiceBillingReason {
  MANUAL = "MANUAL",
  SUBSCRIPTION = "SUBSCRIPTION",
  SUBSCRIPTION_CREATE = "SUBSCRIPTION_CREATE",
  SUBSCRIPTION_CYCLE = "SUBSCRIPTION_CYCLE",
  SUBSCRIPTION_THRESHOLD = "SUBSCRIPTION_THRESHOLD",
  SUBSCRIPTION_UPDATE = "SUBSCRIPTION_UPDATE",
  UPCOMING = "UPCOMING",
}

/**
 * An enumeration.
 */
export enum InvoiceStatus {
  DRAFT = "DRAFT",
  OPEN = "OPEN",
  PAID = "PAID",
  UNCOLLECTIBLE = "UNCOLLECTIBLE",
  VOID = "VOID",
}

/**
 * An enumeration.
 */
export enum PlanInterval {
  DAY = "DAY",
  MONTH = "MONTH",
  WEEK = "WEEK",
  YEAR = "YEAR",
}

/**
 * An enumeration.
 */
export enum SubscriptionStatus {
  ACTIVE = "ACTIVE",
  CANCELED = "CANCELED",
  INCOMPLETE = "INCOMPLETE",
  INCOMPLETE_EXPIRED = "INCOMPLETE_EXPIRED",
  PAST_DUE = "PAST_DUE",
  TRIALING = "TRIALING",
  UNPAID = "UNPAID",
}

export interface FeatureInput {
  name?: string | null;
}

export interface PaymentBillingDetailsAddressInput {
  line1?: string | null;
  city?: string | null;
  country?: string | null;
  state?: string | null;
}

export interface PaymentBillingDetailsInput {
  name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: PaymentBillingDetailsAddressInput | null;
}

export interface PaymentCardInput {
  expMonth?: string | null;
  expYear?: string | null;
}

export interface PaymentInput {
  billingDetails?: PaymentBillingDetailsInput | null;
  card?: PaymentCardInput | null;
  metadata?: PaymentMetadataInput | null;
}

export interface PaymentMetadataInput {
  documentId?: string | null;
}

export interface PaymentMethodAppInput {
  stripeTestPublic: string;
  stripeTestSecret: string;
  stripeProdPublic: string;
  stripeProdSecret: string;
}

export interface PriceInput {
  active?: boolean | null;
  amount?: number | null;
  currency?: string | null;
  interval?: IntervalEnum | null;
}

export interface ProductInput {
  active?: boolean | null;
  apps?: number | null;
  description?: string | null;
  features?: (string | null)[] | null;
  name?: string | null;
}

export interface StoreAppColorInput {
  color?: string | null;
  text?: string | null;
}

export interface StoreAppInput {
  name: string;
  color?: StoreAppColorInput | null;
  links?: StoreAppLinksInput | null;
  apiLink?: string | null;
  template?: string | null;
  logo?: any | null;
}

export interface StoreAppLinksInput {
  androidLink?: string | null;
  iosLink?: string | null;
}

export interface TemplateInput {
  name: string;
  isActive?: boolean | null;
  previewImg?: any | null;
  url?: string | null;
  snack?: string | null;
}

//==============================================================
// END Enums and Input Objects
//==============================================================
