import React, { useEffect, useState } from "react";
import { Badge, Col, Collapse, Descriptions, Tooltip, Typography } from "antd";
import { InfoCircleOutlined, RightOutlined } from "@ant-design/icons";
import addHours from "date-fns/addHours";
import { useTranslation } from "react-i18next";

import {
  InvoiceStatus,
  PlanInterval,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import {
  MyAccount_me_subscription,
  MyAccount_me_subscription_plan_product_features_edges_node,
} from "../../api/types/MyAccount";
import { UpcomingInvoice_upcominginvoice } from "../../api/types/UpcomingInvoice";
import connectionToNodes from "../../lib/connectionToNodes";
import { currencySymbol } from "../../lib/currencySymbol";
import { dateTime, shortDate } from "../../lib/parseDate";

import { InvoicesTable } from "./";

const { Panel } = Collapse;
const { Item } = Descriptions;
const { Text } = Typography;

interface SubscriptionInfoProps {
  subscription: MyAccount_me_subscription | null | undefined;
  upcoming: UpcomingInvoice_upcominginvoice | null | undefined;
}

const SubscriptionInfo = ({
  subscription,
  upcoming,
}: SubscriptionInfoProps) => {
  const { t } = useTranslation();
  const [features, setFeatures] = useState<
    MyAccount_me_subscription_plan_product_features_edges_node[]
  >([]);
  const [numInvoices, setNumInvoices] = useState<number>(0);

  useEffect(() => {
    if (subscription && subscription.plan) {
      setFeatures(connectionToNodes(subscription.plan.product?.features));
    }
  }, [subscription]);
  useEffect(() => {
    setNumInvoices(
      connectionToNodes(subscription?.invoices).filter(
        (inv) => inv.status === InvoiceStatus.OPEN
      ).length
    );
  }, [subscription]);

  return subscription && subscription.plan ? (
    <>
      <Col span="24">
        <Descriptions
          bordered
          column={3}
          labelStyle={{ color: "#232323", fontWeight: 500 }}
          layout="vertical"
          size="small"
        >
          <Item label={t("plan")}>
            {subscription.plan.product && subscription.plan.product.name}
          </Item>
          <Item span={2} label={t("description")}>
            {subscription.plan.product?.description}
            {features.length > 0 && (
              <p style={{ margin: 0 }}>
                {`${t("features")}:`}
                {features.map((feat) => {
                  return (
                    <Text key={feat.id} style={{ paddingLeft: 15 }}>
                      {"· "}
                      {feat.name}
                    </Text>
                  );
                })}
              </p>
            )}
          </Item>
          <Item label={t("price")}>
            {subscription.plan.amount
              ? subscription.plan.amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : "-"}
            {currencySymbol(subscription.plan.currency)}
          </Item>
          <Item label={t("interval")}>
            {subscription.plan.interval === PlanInterval.DAY
              ? `${t("renewal")} ${t("daily").toLocaleLowerCase()}`
              : subscription.plan.interval === PlanInterval.WEEK
              ? `${t("renewal")} ${t("weekly").toLocaleLowerCase()}`
              : subscription.plan.interval === PlanInterval.MONTH
              ? `${t("renewal")} ${t("monthly").toLocaleLowerCase()}`
              : subscription.plan.interval === PlanInterval.YEAR
              ? `${t("renewal")} ${t("annual").toLocaleLowerCase()}`
              : "-"}
          </Item>
          <Item
            label={
              <>
                {t("balance")}
                <Tooltip title={t("balanceInfo")}>
                  <InfoCircleOutlined style={{ marginLeft: 8 }} />
                </Tooltip>
              </>
            }
          >
            {upcoming &&
              `${(upcoming.startingBalance
                ? (upcoming?.startingBalance / 100) * -1
                : 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}${currencySymbol(upcoming.currency || "")}`}
            {!upcoming &&
            (subscription.customer.balance !== undefined &&
              subscription.customer.balance) !== null
              ? `${(subscription.customer.balance
                  ? (subscription.customer.balance / 100) * -1
                  : 0
                ).toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}${currencySymbol(subscription.customer.currency || "")}`
              : null}
            {!upcoming &&
            !subscription.customer.balance &&
            subscription.customer.balance !== 0
              ? t("unknown")
              : null}
          </Item>
          <Item label={t("subscribedSince")}>
            {shortDate(new Date(subscription.created))}
          </Item>
          <Item label={t("currentPeriod")}>
            {t("periodBetween", {
              start: shortDate(new Date(subscription.currentPeriodStart)),
              end: shortDate(new Date(subscription.currentPeriodEnd)),
            })}
          </Item>
          {subscription.status !== SubscriptionStatus.INCOMPLETE ? (
            <Item label={t("nextInvoice")}>
              {upcoming ? (
                <Tooltip
                  placement="topLeft"
                  title={
                    upcoming.startingBalance !== null &&
                    upcoming.endingBalance !== null &&
                    upcoming.startingBalance - upcoming.endingBalance !== 0
                      ? `${t("appliedBalance")} ${(
                          (upcoming.startingBalance - upcoming.endingBalance) /
                          100
                        ).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })}${currencySymbol(upcoming.currency || "")}`
                      : null
                  }
                >
                  {t("nextInvoiceData", {
                    amount: upcoming.amountRemaining
                      ? upcoming.amountRemaining.toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        })
                      : (0).toLocaleString(undefined, {
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2,
                        }),
                    currency: currencySymbol(upcoming.currency || ""),
                    date: upcoming.nextPaymentAttempt
                      ? shortDate(new Date(upcoming.nextPaymentAttempt))
                      : t("unknown").toLocaleLowerCase(),
                  })}
                </Tooltip>
              ) : (
                <Text>{t("nextInvoiceEmpty")}</Text>
              )}
            </Item>
          ) : (
            <Item
              label={
                <Badge dot offset={[4, -1]} title={t("deadlineToPay")}>
                  {t("incompleteAt")}
                </Badge>
              }
            >
              {dateTime(addHours(new Date(subscription.created), 23))}
            </Item>
          )}
          <Item label={t("invoices")}>
            <Collapse
              expandIcon={(props) => (
                <Badge
                  count={numInvoices}
                  offset={[5, -4]}
                  size="small"
                  style={numInvoices === 0 ? { display: "none" } : {}}
                  title={t("pendingInvoices")}
                >
                  <RightOutlined
                    style={
                      props.isActive
                        ? {
                            transform: "rotate(90deg)",
                            transition: "transform .24s",
                          }
                        : { transition: "transform .24s" }
                    }
                  />
                </Badge>
              )}
              expandIconPosition="right"
              style={{ margin: 10 }}
            >
              <Panel
                header={t("showInvoicesList", {
                  num: connectionToNodes(subscription.invoices).length,
                })}
                key="invoices"
              >
                <InvoicesTable
                  invoices={connectionToNodes(subscription.invoices).filter(
                    (inv) =>
                      inv.subscription?.stripeId === subscription.stripeId
                  )}
                />
              </Panel>
            </Collapse>
          </Item>
        </Descriptions>
      </Col>
    </>
  ) : null;
};

export default SubscriptionInfo;
