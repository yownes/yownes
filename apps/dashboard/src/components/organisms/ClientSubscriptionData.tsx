import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  Row,
  Tag,
  Typography,
} from "antd";
import type { MenuProps } from "antd";
import { useQuery } from "@apollo/client";
import { EllipsisOutlined } from "@ant-design/icons";
import reverse from "lodash/reverse";
import addDays from "date-fns/addDays";
import { useTranslation } from "react-i18next";

import {
  INVOICES,
  PLANS,
  SUBSCRIPTIONS,
  UPCOMING_INVOICE,
} from "../../api/queries";
import type { Client_user } from "../../api/types/Client";
import { InvoiceStatus, SubscriptionStatus } from "../../api/types/globalTypes";
import type { Invoices, InvoicesVariables } from "../../api/types/Invoices";
import type { MyAccount_me_subscription_invoices_edges_node } from "../../api/types/MyAccount";
import type { Plans } from "../../api/types/Plans";
import type {
  Subscriptions,
  SubscriptionsVariables,
  Subscriptions_subscriptions_edges_node,
} from "../../api/types/Subscriptions";
import type {
  UpcomingInvoice,
  UpcomingInvoiceVariables,
} from "../../api/types/UpcomingInvoice";
import connectionToNodes from "../../lib/connectionToNodes";
import { dateTime, longDate } from "../../lib/parseDate";
import { Loading } from "../atoms";
import {
  SubscriptionInfo,
  SubscriptionTable,
  SubscriptionState,
  TitleWithAction,
  CancelSubscriptionClient,
  ChangeSubscriptionClient,
} from "../molecules";

import styles from "./ClientSubscriptionData.module.css";

const { Text, Title } = Typography;

interface ClientSubscriptionDataProps {
  client: Client_user | null | undefined;
}

type MenuItemProps = MenuProps["items"];

const ClientSubscriptionData = ({ client }: ClientSubscriptionDataProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [invoices, setInvoices] =
    useState<MyAccount_me_subscription_invoices_edges_node[]>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
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
    setInvoices(connectionToNodes(client?.subscription?.invoices));
  }, [client]);
  useEffect(() => {
    setSubscriptions(
      connectionToNodes(subscriptionsData?.subscriptions).filter(
        (sub) => sub.stripeId !== client?.subscription?.stripeId
      )
    );
  }, [client, subscriptionsData]);

  if (
    loadingInvoices ||
    loadingPlans ||
    loadingSubscriptions ||
    loadingUpcoming
  ) {
    return (
      <Card>
        <Title level={2}>{t("admin:clientSubscriptionData")}</Title>
        <Loading />
      </Card>
    );
  }

  const active =
    client?.subscription?.status === SubscriptionStatus.ACTIVE &&
    client.subscription.cancelAtPeriodEnd === false;
  const cancelAtEnd =
    client?.subscription?.status === SubscriptionStatus.ACTIVE &&
    client.subscription.cancelAtPeriodEnd;
  const incomplete =
    client?.subscription?.status === SubscriptionStatus.INCOMPLETE;
  const pastDue = client?.subscription?.status === SubscriptionStatus.PAST_DUE;
  const disabled = !(active || incomplete || pastDue || cancelAtEnd);

  const items: MenuItemProps = [
    {
      key: "change",
      label: (
        <ChangeSubscriptionClient
          data={client}
          menuVisible={setIsOverlayVisible}
        />
      ),
      disabled: !client?.subscription,
    },
    {
      key: "cancel",
      label: (
        <CancelSubscriptionClient
          data={client}
          menuVisible={setIsOverlayVisible}
        />
      ),
      disabled,
    },
  ];

  const actions = (
    <Dropdown
      overlay={<Menu items={items} />}
      trigger={["click"]}
      visible={isOverlayVisible}
      onVisibleChange={setIsOverlayVisible}
    >
      <Button
        className="button-default-default"
        shape="circle"
        icon={<EllipsisOutlined style={{ color: "#232323" }} />}
      />
    </Dropdown>
  );

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <TitleWithAction
            title={
              <>
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
              </>
            }
            extra={actions}
          />
          {
            // TODO: Mensaje error renovación, fecha siguiente intento
            // y permitir intentarlo en este momento
            pastDue && (
              <Row gutter={[24, 24]}>
                <Col>
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
                                  connectionToNodes(
                                    client?.subscription?.invoices
                                  )
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
                </Col>
                <Col />
              </Row>
            )
          }
          <Row gutter={[24, 24]}>
            {client?.subscription &&
              client?.subscription?.plan &&
              (client.subscription.status === SubscriptionStatus.ACTIVE ||
                incomplete ||
                pastDue ||
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
          {subscriptions &&
            (subscriptions?.length > 1 ||
              (subscriptions.length === 1 &&
                (subscriptions[0].status === SubscriptionStatus.CANCELED ||
                  subscriptions[0].status ===
                    SubscriptionStatus.INCOMPLETE_EXPIRED))) && (
              <Row gutter={[24, 24]}>
                <Col span={24}>
                  <SubscriptionTable
                    invoices={connectionToNodes(invoicesData?.invoices)}
                    plans={plansData}
                    subscriptions={subscriptions}
                  />
                </Col>
              </Row>
            )}
        </Card>
      </Col>
    </Row>
  );
};

export default ClientSubscriptionData;
