import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  message,
  Modal,
  Row,
  Tag,
  Tooltip,
  Typography,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import addDays from "date-fns/addDays";
import first from "lodash/first";
import reverse from "lodash/reverse";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import {
  PAY_INVOICE,
  RESUBSCRIBE,
  UNSUBSCRIBE,
  UPDATE_SUBSCRIPTION,
} from "../../api/mutations";
import {
  APPS,
  MY_ACCOUNT,
  MY_PAYMENT_METHODS,
  PLANS,
  SUBSCRIPTIONS,
  UPCOMING_INVOICE,
} from "../../api/queries";
import type { Apps, AppsVariables } from "../../api/types/Apps";
import {
  AccountAccountStatus,
  InvoiceStatus,
  PlanInterval,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import type {
  MyAccount,
  MyAccount_me_subscription_invoices_edges_node,
} from "../../api/types/MyAccount";
import type { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import type {
  PayInvoice,
  PayInvoiceVariables,
} from "../../api/types/PayInvoice";
import type {
  Plans,
  Plans_products_edges_node,
  Plans_products_edges_node_features_edges_node,
} from "../../api/types/Plans";
import type {
  Resubscribe,
  ResubscribeVariables,
} from "../../api/types/Resubscribe";
import type {
  Subscriptions,
  SubscriptionsVariables,
  Subscriptions_subscriptions_edges_node,
} from "../../api/types/Subscriptions";
import type {
  Unsubscribe,
  UnsubscribeVariables,
} from "../../api/types/Unsubscribe";
import type {
  UpcomingInvoice,
  UpcomingInvoiceVariables,
} from "../../api/types/UpcomingInvoice";
import type {
  UpdateSubscription,
  UpdateSubscriptionVariables,
} from "../../api/types/UpdateSubscription";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import { dateTime, longDate } from "../../lib/parseDate";
import { Loading, LoadingFullScreen } from "../atoms";
import {
  AlertWithConfirm,
  AlertWithLink,
  SubscriptionInfo,
  SubscriptionState,
} from "../molecules";
import type { ICreditCardStripe } from "../molecules/CreditCard";

import styles from "./SubscriptionData.module.css";

import { ChangeSubscription } from ".";

const { confirm } = Modal;
const { Text, Title } = Typography;

function handleWarning(apps: number, status?: SubscriptionStatus) {
  if (status === SubscriptionStatus.INCOMPLETE) {
    return "warnings.cancelSubscriptionIncompleteNow";
  } else {
    if (status === SubscriptionStatus.PAST_DUE) {
      if (apps > 0) {
        return "warnings.cancelSubscriptionPastDueNowApps";
      } else {
        return "warnings.cancelSubscriptionPastDueNowNoApps";
      }
    } else {
      if (apps > 0) {
        return "warnings.cancelSubscription";
      } else {
        return "warnings.cancelSubscriptionNoApps";
      }
    }
  }
}

const SubscriptionData = () => {
  const history = useHistory();
  const { t } = useTranslation(["translation", "client"]);
  const { data: appsData, loading: loadingData } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const { data: paymentMethods } =
    useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const { data: plansData, loading: loadingPlans } = useQuery<Plans>(PLANS);
  const { data: subscriptionsData, loading: loadingSubscriptions } = useQuery<
    Subscriptions,
    SubscriptionsVariables
  >(SUBSCRIPTIONS, {
    variables: { userId: data?.me?.id ?? "" },
  });

  const [activeApps, setActiveApps] = useState<number>(0);
  const [amount, setAmount] = useState<number | null | undefined>(null);
  const [currency, setCurrency] = useState<string | undefined>(undefined);
  const [disable, setDisable] = useState(false);
  const [interval, setInterval] = useState<PlanInterval>(PlanInterval.MONTH);
  const [invoices, setInvoices] =
    useState<MyAccount_me_subscription_invoices_edges_node[]>();
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const [isPaid, setIsPaid] = useState(false);
  const [isResubscribed, setIsResubscribed] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [features, setFeatures] =
    useState<Plans_products_edges_node_features_edges_node[]>();
  const [modalStep, setModalStep] = useState(false);
  const [plan, setPlan] = useState<Plans_products_edges_node>();
  const [planId, setPlanId] = useState<string>();
  const [priceId, setPriceId] = useState<string | null | undefined>(null);
  const [products, setProducts] = useState<
    Plans_products_edges_node[] | null | undefined
  >(null);
  const [subscriptions, setSubscriptions] = useState<
    Subscriptions_subscriptions_edges_node[] | null | undefined
  >(null);
  const REFETCH_UPCOMING = {
    refetchQueries: [
      {
        query: UPCOMING_INVOICE,
        variables: {
          cId: data?.me?.id ?? "",
          sId: data?.me?.subscription?.id ?? "",
        },
      },
    ],
  };
  const [unsubscribe, { loading: unsubscribing, data: unsubscribeData }] =
    useMutation<Unsubscribe, UnsubscribeVariables>(
      UNSUBSCRIBE,
      REFETCH_UPCOMING
    );
  const [resubscribe, { loading: resubscribing, data: resubscribeData }] =
    useMutation<Resubscribe, ResubscribeVariables>(
      RESUBSCRIBE,
      REFETCH_UPCOMING
    );
  const [
    updateSubscription,
    { loading: updating, data: updateSubscriptionData, reset },
  ] = useMutation<UpdateSubscription, UpdateSubscriptionVariables>(
    UPDATE_SUBSCRIPTION,
    {
      refetchQueries: [
        { query: MY_ACCOUNT },
        {
          query: UPCOMING_INVOICE,
          variables: {
            cId: data?.me?.id ?? "",
            sId: data?.me?.subscription?.id ?? "",
          },
        },
      ],
    }
  );
  const [payInvoice, { data: payInvoiceData, loading: paying }] = useMutation<
    PayInvoice,
    PayInvoiceVariables
  >(PAY_INVOICE);
  const { data: upcomingData, loading: loadingUpcoming } = useQuery<
    UpcomingInvoice,
    UpcomingInvoiceVariables
  >(UPCOMING_INVOICE, {
    variables: {
      cId: data?.me?.id ?? "",
      sId: data?.me?.subscription?.id ?? "",
    },
  });

  const card: ICreditCardStripe | undefined =
    (paymentMethods?.me?.customer?.paymentMethods &&
      paymentMethods?.me?.customer?.defaultPaymentMethod &&
      JSON.parse(
        normalize(
          connectionToNodes(paymentMethods?.me?.customer?.paymentMethods).find(
            (payment) =>
              payment.stripeId ===
              paymentMethods?.me?.customer?.defaultPaymentMethod?.stripeId
          )?.card!
        )
      )) ||
    undefined;
  const expired = card
    ? new Date(card?.exp_year, card?.exp_month) < new Date()
    : true;

  message.config({ maxCount: 1 });

  useEffect(() => {
    if (resubscribeData?.takeUp?.ok) {
      if (isResubscribed) {
        message.success(t("client:resubscribeSuccessful"), 4);
        setIsResubscribed(false);
      }
    }
  }, [isResubscribed, resubscribeData, t]);
  useEffect(() => {
    if (unsubscribeData?.dropOut?.ok) {
      if (isUnsubscribed) {
        message.success(t("client:unsubscribeSuccessful"), 4);
        setIsUnsubscribed(false);
      }
    }
  }, [isUnsubscribed, t, unsubscribeData]);
  useEffect(() => {
    if (updateSubscriptionData?.updateSubscription?.ok) {
      if (isUpdated) {
        setIsModalUpdateOpen(!isModalUpdateOpen);
        message.success(t("client:updateSubscriptionSuccessful"), 4);
        setIsUpdated(false);
      }
    }
  }, [isModalUpdateOpen, isUpdated, t, updateSubscriptionData]);
  useEffect(() => {
    if (payInvoiceData?.payInvoice?.ok) {
      if (isPaid) {
        message.success(t("client:payInvoiceSubscriptionSuccessful"), 4);
      }
      setIsPaid(false);
    }
  }, [isPaid, payInvoiceData, t]);
  useEffect(() => {
    setProducts(reverse(connectionToNodes(plansData?.products)));
  }, [plansData]);
  useEffect(() => {
    setInvoices(connectionToNodes(data?.me?.subscription?.invoices));
  }, [data]);
  useEffect(() => {
    setSubscriptions(
      reverse(
        connectionToNodes(subscriptionsData?.subscriptions).filter(
          (sub) => sub.stripeId !== data?.me?.subscription?.stripeId
        )
      )
    );
  }, [data, subscriptionsData]);
  useEffect(() => {
    setActiveApps(
      connectionToNodes(appsData?.apps).filter((app) => app.isActive).length
    );
  }, [appsData]);
  useEffect(() => {
    setPlan(products?.find((product) => product.id === planId));
  }, [planId, products]);
  useEffect(() => {
    if (planId) {
      setFeatures(
        connectionToNodes(
          products?.find((prod) => prod.id === planId)?.features
        )
      );
    }
  }, [planId, products]);
  useEffect(() => {
    if (plan?.prices) {
      const price = connectionToNodes(plan?.prices)
        .filter((p) => p.active)
        .find(
          (p) =>
            JSON.parse(normalize(p.recurring!)).interval.toUpperCase() ===
            interval
        );
      setAmount(price?.unitAmount);
      setCurrency(price?.currency);
      setPriceId(price?.stripeId);
    }
  }, [interval, plan]);
  useEffect(() => {
    if (data?.me?.subscription?.plan) {
      const priceInterval = JSON.parse(
        normalize(
          data.me.subscription.plan.product?.prices.edges.find(
            (p) =>
              p?.node && p?.node.stripeId === data.me.subscription.plan.stripeId
          )?.node?.recurring!
        )
      ).interval;
      if (priceInterval) {
        setInterval(priceInterval.toUpperCase());
      }
    }
  }, [data]);

  if (
    loading ||
    loadingData ||
    loadingPlans ||
    loadingSubscriptions ||
    loadingUpcoming
  ) {
    return (
      <Card>
        <Title level={2}>{t("client:subscriptionData")}</Title>
        <Loading />
      </Card>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title className={styles.header} level={2}>
            {t("client:subscriptionData")}
            {data?.me?.subscription && (
              <Text className={styles.tag}>
                <SubscriptionState state={data.me.subscription.status} />
                {(data.me.subscription.cancelAtPeriodEnd ||
                  data.me.subscription.cancelAt) && (
                  <Tag>
                    {t("cancelAt", {
                      date: dateTime(new Date(data.me.subscription.cancelAt)),
                    })}
                  </Tag>
                )}
              </Text>
            )}
          </Title>
          <Row gutter={[24, 24]}>
            {
              // TODO: Mensaje error renovación, fecha siguiente intento
              // y permitir intentarlo en este momento
              data?.me?.subscription?.status ===
                SubscriptionStatus.PAST_DUE && (
                <Alert
                  className={styles.renewalAlert}
                  message={[
                    t("client:renewalError", {
                      date:
                        invoices &&
                        longDate(
                          addDays(
                            new Date(
                              reverse(
                                connectionToNodes(data.me.subscription.invoices)
                              ).find(
                                (inv) => inv.status === InvoiceStatus.OPEN
                              )?.created
                            ),
                            7
                          )
                        ),
                    }),
                  ]}
                  showIcon
                  type="error"
                />
              )
            }
          </Row>
          <Row gutter={[24, 24]}>
            {
              // TODO: Permitir intentar de nuevo con otro método de pago
              data?.me?.subscription?.status ===
                SubscriptionStatus.INCOMPLETE && (
                <AlertWithConfirm
                  buttonText={t("client:retryPayment")}
                  confirmText={
                    <Trans
                      i18nKey={"warnings.renewalNowSubscription"}
                      ns="client"
                    >
                      <strong />
                      <p />
                      <p />
                    </Trans>
                  }
                  message={[
                    t("client:retryIncompleteError"),
                    t("client:retryIncompleteCheck"),
                  ]}
                  onConfirm={() => {
                    payInvoice({
                      variables: {
                        invoiceId:
                          (invoices &&
                            invoices.find(
                              (inv) =>
                                inv.subscription?.stripeId ===
                                data.me?.subscription?.stripeId
                            )?.stripeId) ||
                          "",
                      },
                      update(cache, { data: payData }) {
                        if (!payData?.payInvoice?.ok) {
                          message.error(
                            t(
                              `client:errors.${payData?.payInvoice?.error}`,
                              t("error")
                            ),
                            4
                          );
                        }
                      },
                    });
                    setIsPaid(true);
                  }}
                  style={{ marginBottom: 18 }}
                  type="error"
                />
              )
            }
          </Row>
          <Row gutter={[24, 24]}>
            {data?.me?.subscription &&
              data?.me?.subscription?.plan &&
              (data.me.subscription.status === SubscriptionStatus.ACTIVE ||
                data.me.subscription.status === SubscriptionStatus.INCOMPLETE ||
                data.me.subscription.status === SubscriptionStatus.PAST_DUE ||
                data.me.subscription.status === SubscriptionStatus.UNPAID) && (
                <SubscriptionInfo
                  subscription={data.me.subscription}
                  upcoming={upcomingData?.upcominginvoice}
                />
              )}
          </Row>
          <Row gutter={[24, 24]}>
            {data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd && (
                <div className={styles.paddingTop24}>
                  <AlertWithConfirm
                    buttonText={t("client:reSubscribe")}
                    confirmText={
                      <Trans
                        i18nKey={"warnings.unCancelSubscription"}
                        ns="client"
                      >
                        <strong />
                        <p />
                      </Trans>
                    }
                    message={[t("client:reSubscribeNow")]}
                    onConfirm={() => {
                      if (data?.me?.id) {
                        resubscribe({
                          variables: { userId: data.me.id },
                        });
                        setIsResubscribed(true);
                      }
                    }}
                  />
                </div>
              )}
          </Row>
          <Row gutter={[24, 24]}>
            {(!data?.me?.subscription ||
              (data.me.subscription.status === SubscriptionStatus.ACTIVE &&
                data.me.subscription.cancelAtPeriodEnd) ||
              data.me.subscription.status === SubscriptionStatus.CANCELED ||
              data.me.subscription.status === SubscriptionStatus.UNPAID) &&
              (data?.me?.subscription &&
              data.me.subscription.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd ? (
                <div className={styles.paddingTop24}>
                  <AlertWithConfirm
                    buttonText={t("client:subscribe")}
                    confirmText={
                      <Trans i18nKey={"warnings.newSubscription"} ns="client">
                        <strong />
                        <p />
                        <p />
                        <p />
                        <p />
                      </Trans>
                    }
                    message={[t("client:startSubscribeNow")]}
                    onConfirm={() => history.push("/checkout")}
                  />
                </div>
              ) : (
                <AlertWithLink
                  buttonText={t("client:subscribe")}
                  message={
                    first(subscriptions)?.status ===
                    SubscriptionStatus.INCOMPLETE_EXPIRED
                      ? [t("client:incompleteSubscribeNow")]
                      : [t("client:subscribeNow")]
                  }
                  link="/checkout"
                />
              ))}
          </Row>
          <Row gutter={[24, 24]}>
            {data?.me?.subscription?.status ===
              SubscriptionStatus.INCOMPLETE_EXPIRED && (
              <AlertWithLink
                buttonText={t("client:subscribe")}
                message={[t("client:incompleteSubscribeNow")]}
                link="/checkout"
              />
            )}
          </Row>
          <Row gutter={[24, 24]}>
            {data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd === false && (
                <Col>
                  <div className={styles.paddingTop24}>
                    {!expired ? (
                      <Button
                        className="button-default-default"
                        onClick={() => {
                          data?.me?.subscription?.plan &&
                            setInterval(
                              JSON.parse(
                                normalize(
                                  data?.me?.subscription?.plan.product?.prices.edges.find(
                                    (p) =>
                                      p?.node &&
                                      p?.node.stripeId ===
                                        data?.me?.subscription?.plan?.stripeId
                                  )?.node?.recurring!
                                )
                              ).interval.toUpperCase()
                            );
                          setPlanId(data?.me?.subscription?.plan?.product?.id);
                          setModalStep(false);
                          setIsModalUpdateOpen(!isModalUpdateOpen);
                        }}
                        type="default"
                      >
                        {t("client:changeSubscription")}
                      </Button>
                    ) : (
                      <Tooltip title={t("client:changeSubscriptionDisabled")}>
                        <Button disabled type="default">
                          {t("client:changeSubscription")}
                        </Button>
                      </Tooltip>
                    )}
                  </div>
                </Col>
              )}
            {((data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd === false) ||
              data?.me?.subscription?.status ===
                SubscriptionStatus.INCOMPLETE ||
              data?.me?.subscription?.status ===
                SubscriptionStatus.PAST_DUE) && (
              <Col>
                <div className={styles.paddingTop24}>
                  <Button
                    danger
                    onClick={() => {
                      confirm({
                        icon: <ExclamationCircleOutlined />,
                        title: t("client:warnings.cancelSubscriptionTitle"),
                        content: (
                          <Trans
                            i18nKey={handleWarning(
                              appsData?.apps ? appsData?.apps?.edges.length : 0,
                              data?.me?.subscription?.status
                            )}
                            ns="client"
                            values={{
                              date: dateTime(
                                new Date(
                                  data.me?.subscription?.currentPeriodEnd
                                )
                              ),
                            }}
                          >
                            <p />
                            <p />
                          </Trans>
                        ),
                        cancelButtonProps: {
                          className: "button-default-default",
                        },
                        cancelText: t("close"),
                        okButtonProps: {
                          autoFocus: false,
                          danger: true,
                          type: "default",
                        },
                        okText: t("client:cancelSubscriptionConfirm"),
                        onOk: () => {
                          if (data?.me?.id) {
                            unsubscribe({
                              variables: {
                                userId: data?.me?.id,
                                atPeriodEnd:
                                  data?.me?.subscription?.status ===
                                  SubscriptionStatus.ACTIVE
                                    ? true
                                    : false,
                              },
                              update(cache, { data: result }) {
                                if (result?.dropOut?.ok && data.me) {
                                  if (
                                    data?.me?.subscription?.status !==
                                    SubscriptionStatus.ACTIVE
                                  ) {
                                    cache.modify({
                                      id: cache.identify({
                                        ...data?.me,
                                      }),
                                      fields: {
                                        accountStatus: () =>
                                          result.dropOut?.accountStatus ||
                                          AccountAccountStatus.REGISTERED,
                                        subscription: () => null,
                                      },
                                    });
                                  } else {
                                    cache.modify({
                                      id: cache.identify({
                                        ...data?.me,
                                      }),
                                      fields: {
                                        accountStatus: () =>
                                          result.dropOut?.accountStatus ||
                                          AccountAccountStatus.REGISTERED,
                                      },
                                    });
                                  }
                                }
                              },
                            });
                            setIsUnsubscribed(true);
                          }
                        },
                      });
                    }}
                    type="default"
                  >
                    {t("client:cancelSubscription")}
                  </Button>
                </div>
              </Col>
            )}
          </Row>
        </Card>
      </Col>
      <Modal
        destroyOnClose
        title={
          modalStep ? t("client:confirmNewPlan") : t("client:selectNewPlan")
        }
        visible={isModalUpdateOpen}
        afterClose={reset}
        onCancel={() => {
          setInterval(PlanInterval.MONTH);
          setIsModalUpdateOpen(!isModalUpdateOpen);
        }}
        cancelText={modalStep ? t("back") : t("cancel")}
        okText={modalStep ? t("confirm") : t("next")}
        okButtonProps={{
          loading: updating,
          disabled: disable,
          onClick: () => {
            if (modalStep) {
              if (data?.me?.subscription?.stripeId && priceId) {
                updateSubscription({
                  variables: {
                    subscriptionId: data?.me?.subscription?.stripeId,
                    priceId: priceId,
                  },
                });
                setIsUpdated(true);
              } else {
                message.error(t("client:updateSubscriptionError"), 4);
              }
            } else {
              setModalStep(true);
            }
          },
        }}
        cancelButtonProps={{
          className: "button-default-default",
          onClick: () => {
            if (modalStep) {
              reset();
              setModalStep(false);
            } else {
              setIsModalUpdateOpen(false);
            }
          },
        }}
      >
        <ChangeSubscription
          activeApps={activeApps}
          amount={amount}
          currency={currency}
          currentProduct={data?.me?.subscription?.plan?.product ?? undefined}
          error={
            updateSubscriptionData?.updateSubscription?.error
              ? t(
                  `client:errors.${updateSubscriptionData?.updateSubscription?.error}`,
                  t("error")
                )
              : undefined
          }
          features={features}
          interval={interval}
          loading={loadingPlans}
          onChangeInterval={setInterval}
          onChangePlan={(p) => {
            setDisable(false);
            setPlanId(p);
          }}
          onDisable={(d) => setDisable(d)}
          plan={plan ?? data?.me?.subscription?.plan?.product ?? undefined}
          planId={planId}
          plansFeatures={connectionToNodes(plansData?.features)}
          products={products || []}
          step={modalStep}
        />
      </Modal>
      {paying && <LoadingFullScreen tip={t("client:payingInvoice")} />}
      {resubscribing && <LoadingFullScreen tip={t("client:resubscribing")} />}
      {unsubscribing && <LoadingFullScreen tip={t("client:unsubscribing")} />}
      {updating && <LoadingFullScreen tip={t("client:updatingSubscription")} />}
    </Row>
  );
};

export default SubscriptionData;
