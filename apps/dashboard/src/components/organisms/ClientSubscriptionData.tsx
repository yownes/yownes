import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Checkbox,
  Col,
  message,
  Popconfirm,
  Row,
  Tag,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import reverse from "lodash/reverse";
import addDays from "date-fns/addDays";
import { Trans, useTranslation } from "react-i18next";

import { RESUBSCRIBE, UNSUBSCRIBE } from "../../api/mutations";
import {
  INVOICES,
  PLANS,
  SUBSCRIPTIONS,
  UPCOMING_INVOICE,
} from "../../api/queries";
import { Client_user } from "../../api/types/Client";
import {
  AccountAccountStatus,
  InvoiceStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import { Invoices, InvoicesVariables } from "../../api/types/Invoices";
import { MyAccount_me_subscription_invoices_edges_node } from "../../api/types/MyAccount";
import { Plans } from "../../api/types/Plans";
import {
  Subscriptions,
  SubscriptionsVariables,
  Subscriptions_subscriptions_edges_node,
} from "../../api/types/Subscriptions";
import { Resubscribe, ResubscribeVariables } from "../../api/types/Resubscribe";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import {
  UpcomingInvoice,
  UpcomingInvoiceVariables,
} from "../../api/types/UpcomingInvoice";
import connectionToNodes from "../../lib/connectionToNodes";
import { dateTime, longDate } from "../../lib/parseDate";

import { Loading, LoadingFullScreen } from "../atoms";
import {
  SubscriptionInfo,
  SubscriptionTable,
  SubscriptionState,
} from "../molecules";

import styles from "./ClientSubscriptionData.module.css";

message.config({ maxCount: 1 });
const { Text, Title } = Typography;

interface ClientSubscriptionDataProps {
  client: Client_user | null | undefined;
}

const ClientSubscriptionData = ({ client }: ClientSubscriptionDataProps) => {
  const { t } = useTranslation(["translation", "admin"]);

  const [finalizeNow, setFinalizeNow] = useState(true);
  const [invoices, setInvoices] =
    useState<MyAccount_me_subscription_invoices_edges_node[]>();
  const [isResubscribed, setIsResubscribed] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [subscriptions, setSubscriptions] = useState<
    Subscriptions_subscriptions_edges_node[] | null | undefined
  >(null);

  const { data: invoicesData, loading: loadingInvoices } = useQuery<
    Invoices,
    InvoicesVariables
  >(INVOICES, { variables: { userId: client?.id ?? "" } });
  const { data: plansData, loading: loadingPlans } = useQuery<Plans>(PLANS);
  const { data: subscriptionsData, loading: loadingSubscriptions } = useQuery<
    Subscriptions,
    SubscriptionsVariables
  >(SUBSCRIPTIONS, { variables: { userId: client?.id ?? "" } });

  const REFETCH_UPCOMING = {
    refetchQueries: [
      {
        query: UPCOMING_INVOICE,
        variables: {
          cId: client?.id ?? "",
          sId: client?.subscription?.id ?? "",
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
  const { data: upcomingData, loading: loadingUpcoming } = useQuery<
    UpcomingInvoice,
    UpcomingInvoiceVariables
  >(UPCOMING_INVOICE, {
    variables: {
      cId: client?.id ?? "",
      sId: client?.subscription?.id ?? "",
    },
  });

  useEffect(() => {
    if (resubscribeData?.takeUp?.ok) {
      if (isResubscribed) {
        message.success(t("admin:resubscribeClientSuccessful"), 4);
        setIsResubscribed(false);
      }
    }
  }, [isResubscribed, resubscribeData, t]);
  useEffect(() => {
    if (unsubscribeData?.dropOut?.ok) {
      if (isUnsubscribed) {
        message.success(t("admin:unsubscribeClientSuccessful"), 4);
        setIsUnsubscribed(false);
      }
    }
  }, [isUnsubscribed, t, unsubscribeData]);
  useEffect(() => {
    setInvoices(connectionToNodes(client?.subscription?.invoices));
  }, [client]);
  useEffect(() => {
    setSubscriptions(
      reverse(
        connectionToNodes(subscriptionsData?.subscriptions).filter(
          (sub) => sub.stripeId !== client?.subscription?.stripeId
        )
      )
    );
  }, [client, subscriptionsData]);

  if (
    loadingInvoices ||
    loadingPlans ||
    loadingSubscriptions ||
    loadingUpcoming
  )
    return (
      <Card>
        <Title level={2}>{t("admin:clientSubscriptionData")}</Title>
        <Loading />
      </Card>
    );

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title className={styles.header} level={2}>
            <div className={styles.headerContainer}>
              <div>
                {t("admin:clientSubscriptionData")}
                {client?.subscription && (
                  <Text className={styles.tag}>
                    <SubscriptionState state={client.subscription.status} />
                    {(client.subscription.cancelAtPeriodEnd ||
                      client.subscription.cancelAt) && (
                      <Tag>
                        {t("cancelAt", {
                          date: dateTime(
                            new Date(client.subscription.cancelAt)
                          ),
                        })}
                      </Tag>
                    )}
                  </Text>
                )}
              </div>
              <>
                {((client?.subscription?.status === SubscriptionStatus.ACTIVE &&
                  client.subscription.cancelAtPeriodEnd === false) ||
                  client?.subscription?.status ===
                    SubscriptionStatus.INCOMPLETE ||
                  client?.subscription?.status ===
                    SubscriptionStatus.PAST_DUE) && (
                  <Popconfirm
                    cancelText={t("cancel")}
                    destroyTooltipOnHide={true}
                    okText={t("confirm")}
                    title={
                      <>
                        <Trans
                          i18nKey={
                            client?.subscription?.status ===
                            SubscriptionStatus.INCOMPLETE
                              ? "warnings.cancelSubscriptionIncompleteNow"
                              : client?.subscription?.status ===
                                SubscriptionStatus.PAST_DUE
                              ? client.apps && client.apps.edges.length > 0
                                ? "warnings.cancelSubscriptionPastDueNowApps"
                                : "warnings.cancelSubscriptionPastDueNowNoApps"
                              : client.apps && client.apps.edges.length > 0
                              ? "warnings.cancelSubscription"
                              : "warnings.cancelSubscriptionNoApps"
                          }
                          ns="admin"
                          values={{
                            date: dateTime(
                              new Date(client.subscription.currentPeriodEnd)
                            ),
                          }}
                        >
                          <strong></strong>
                          <p></p>
                          <p></p>
                          <p></p>
                        </Trans>
                        {client?.subscription?.status ===
                          SubscriptionStatus.ACTIVE &&
                          client.subscription.cancelAtPeriodEnd === false && (
                            <p>
                              <Checkbox
                                defaultChecked={finalizeNow}
                                onChange={(e) =>
                                  setFinalizeNow(e.target.checked)
                                }
                              >
                                {t("admin:finalizeNow")}
                              </Checkbox>
                            </p>
                          )}
                      </>
                    }
                    placement="left"
                    onConfirm={() => {
                      if (client?.id) {
                        unsubscribe({
                          variables: {
                            userId: client?.id,
                            atPeriodEnd: !finalizeNow,
                          },
                          update(cache, { data: result }) {
                            if (result?.dropOut?.ok && client) {
                              if (!finalizeNow) {
                                cache.modify({
                                  id: cache.identify({
                                    ...client,
                                  }),
                                  fields: {
                                    accountStatus: () =>
                                      result.dropOut?.accountStatus ||
                                      AccountAccountStatus.REGISTERED,
                                  },
                                });
                              } else {
                                cache.modify({
                                  id: cache.identify({
                                    ...client,
                                  }),
                                  fields: {
                                    accountStatus: () =>
                                      result.dropOut?.accountStatus ||
                                      AccountAccountStatus.REGISTERED,
                                    subscription: () => null,
                                  },
                                });
                              }
                            }
                          },
                        });
                        setIsUnsubscribed(true);
                      }
                    }}
                  >
                    <Button
                      className={styles.button}
                      danger
                      onClick={() => setFinalizeNow(true)}
                      type="default"
                    >
                      {t("admin:cancelClientSubscription")}
                    </Button>
                  </Popconfirm>
                )}
                {client?.subscription?.status === SubscriptionStatus.ACTIVE &&
                  client.subscription.cancelAtPeriodEnd && (
                    <Popconfirm
                      cancelText={t("cancel")}
                      okText={t("confirm")}
                      title={
                        <Trans
                          i18nKey={"warnings.unCancelSubscription"}
                          ns="admin"
                        >
                          <strong></strong>
                          <p></p>
                        </Trans>
                      }
                      placement="left"
                      onConfirm={() => {
                        if (client?.id) {
                          resubscribe({
                            variables: { userId: client.id },
                          });
                          setIsResubscribed(true);
                        }
                      }}
                    >
                      <Button className={styles.button} danger type="default">
                        {t("admin:reSubscribeClient")}
                      </Button>
                    </Popconfirm>
                  )}
              </>
            </div>
          </Title>
          <Row gutter={[24, 24]}>
            {
              // TODO: Mensaje error renovación, fecha siguiente intento
              // y permitir intentarlo en este momento
              client?.subscription?.status === SubscriptionStatus.PAST_DUE && (
                <Alert
                  className={styles.renewalAlert}
                  message={[
                    t("admin:renewalClientError", {
                      date:
                        invoices &&
                        longDate(
                          addDays(
                            new Date(
                              reverse(
                                connectionToNodes(client.subscription.invoices)
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
            {client?.subscription &&
              client?.subscription?.plan &&
              (client.subscription.status === SubscriptionStatus.ACTIVE ||
                client.subscription.status === SubscriptionStatus.INCOMPLETE ||
                client.subscription.status === SubscriptionStatus.PAST_DUE ||
                client.subscription.status === SubscriptionStatus.UNPAID) && (
                <SubscriptionInfo
                  subscription={client.subscription}
                  upcoming={upcomingData?.upcominginvoice}
                />
              )}
            {!client?.subscription && (
              <Col>
                <Alert message={t("noSubscription")} showIcon type="warning" />
              </Col>
            )}
          </Row>
          <Row gutter={[24, 24]}></Row>
          {subscriptions &&
            (subscriptions?.length > 1 ||
              (subscriptions.length === 1 &&
                (subscriptions[0].status === SubscriptionStatus.CANCELED ||
                  subscriptions[0].status ===
                    SubscriptionStatus.INCOMPLETE_EXPIRED))) && (
              <Row gutter={[24, 24]}>
                <SubscriptionTable
                  invoices={connectionToNodes(invoicesData?.invoices)}
                  plans={plansData}
                  subscriptions={subscriptions}
                />
              </Row>
            )}
        </Card>
      </Col>
      {resubscribing && (
        <LoadingFullScreen tip={t("admin:resubscribingClient")} />
      )}
      {unsubscribing && (
        <LoadingFullScreen tip={t("admin:unsubscribingClient")} />
      )}
    </Row>
  );
};

export default ClientSubscriptionData;
