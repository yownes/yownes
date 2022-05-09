import React, { useEffect, useState } from "react";
import { Badge, Col, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import addHours from "date-fns/addHours";
import { useTranslation } from "react-i18next";

import { PlanInterval, SubscriptionStatus } from "../../api/types/globalTypes";
import type {
  MyAccount_me_subscription,
  MyAccount_me_subscription_plan_product_features_edges_node,
} from "../../api/types/MyAccount";
import type { UpcomingInvoice_upcominginvoice } from "../../api/types/UpcomingInvoice";
import { colors } from "../../lib/colors";
import connectionToNodes from "../../lib/connectionToNodes";
import { currencySymbol } from "../../lib/currencySymbol";
import { normalize } from "../../lib/normalize";
import { dateTime, shortDate } from "../../lib/parseDate";

import type { description } from "./Descriptions";
import styles from "./SubscriptionInfo.module.css";

import { Descriptions } from ".";

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

  useEffect(() => {
    if (subscription && subscription.plan) {
      setFeatures(connectionToNodes(subscription.plan.product?.features));
    }
  }, [subscription]);

  const info: description[] = [];
  if (subscription && subscription.plan) {
    const allowed_apps = subscription.plan.product?.metadata
      ? JSON.parse(normalize(subscription.plan.product.metadata))
          .allowed_apps || 1
      : 1;
    const allowed_builds = subscription.plan.product?.metadata
      ? JSON.parse(normalize(subscription.plan.product.metadata))
          .allowed_builds || 1
      : 1;
    subscription.plan.product &&
      info.push({
        title: t("plan"),
        description: subscription.plan.product.name,
      });
    info.push({
      title: t("description"),
      description: (
        <div className={styles.description}>
          {subscription.plan.product?.description}
          {features.length > 0 && (
            <p className={styles.emptyMargin}>
              {`${t("include")} `}
              {features.map((feat, i) => {
                return (
                  <span className={styles.feature} key={feat.id}>
                    {i !== 0 && ","}
                    {feat.name}
                  </span>
                );
              })}
              {allowed_apps === "1"
                ? features.length > 0
                  ? `, ${allowed_apps} ${t("includedApp")}`
                  : `${allowed_apps} ${t("includedApp")}`
                : features.length > 0
                ? `, ${allowed_apps} ${t("includedApps")}`
                : `${allowed_apps} ${t("includedApps")}`}
              {allowed_builds === "1"
                ? ` (${allowed_builds} ${t("includedBuild")})`
                : ` (${allowed_builds} ${t("includedBuilds")})`}
            </p>
          )}
        </div>
      ),
    });
    info.push({
      title: t("price"),
      description: (
        <div className={styles.description}>
          {subscription.plan.amount
            ? subscription.plan.amount.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })
            : "-"}
          {currencySymbol(subscription.plan.currency)}
        </div>
      ),
    });
    info.push({
      title: t("interval"),
      description:
        subscription.plan.interval === PlanInterval.DAY
          ? `${t("renewal")} ${t("daily").toLocaleLowerCase()}`
          : subscription.plan.interval === PlanInterval.WEEK
          ? `${t("renewal")} ${t("weekly").toLocaleLowerCase()}`
          : subscription.plan.interval === PlanInterval.MONTH
          ? `${t("renewal")} ${t("monthly").toLocaleLowerCase()}`
          : subscription.plan.interval === PlanInterval.YEAR
          ? `${t("renewal")} ${t("annual").toLocaleLowerCase()}`
          : "-",
    });
    info.push({
      title: (
        <>
          {t("balance")}
          <Tooltip title={t("balanceInfo")}>
            <InfoCircleOutlined
              className={styles.icon}
              style={{ color: colors.green }}
            />
          </Tooltip>
        </>
      ),
      description: (
        <div className={styles.description}>
          {upcoming &&
            `${(upcoming.startingBalance
              ? (upcoming?.startingBalance / 100) * -1
              : 0
            ).toLocaleString(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}${currencySymbol(upcoming.currency ?? "")}`}
          {!upcoming &&
          (subscription.customer.balance !== undefined &&
            subscription.customer.balance) !== null
            ? `${(subscription.customer.balance
                ? (subscription.customer.balance / 100) * -1
                : 0
              ).toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}${currencySymbol(subscription.customer.currency ?? "")}`
            : null}
          {!upcoming &&
          !subscription.customer.balance &&
          subscription.customer.balance !== 0
            ? t("unknown")
            : null}
        </div>
      ),
    });
    info.push({
      title: t("subscribedSince"),
      description: shortDate(new Date(subscription.created)),
    });
    info.push({
      title: t("currentPeriod"),
      description: t("periodBetween", {
        start: shortDate(new Date(subscription.currentPeriodStart)),
        end: shortDate(new Date(subscription.currentPeriodEnd)),
      }),
    });
    subscription.status !== SubscriptionStatus.INCOMPLETE
      ? info.push({
          title: t("nextInvoice"),
          description: (
            <div className={styles.description}>
              {upcoming ? (
                <Tooltip
                  placement="top"
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
                        })}${currencySymbol(upcoming.currency ?? "")}`
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
                    currency: currencySymbol(upcoming.currency ?? ""),
                    date: upcoming.nextPaymentAttempt
                      ? shortDate(new Date(upcoming.nextPaymentAttempt))
                      : t("unknown").toLocaleLowerCase(),
                  })}
                </Tooltip>
              ) : (
                <Text>{t("nextInvoiceEmpty")}</Text>
              )}
            </div>
          ),
        })
      : info.push({
          title: (
            <Badge dot offset={[4, -1]} title={t("deadlineToPay")}>
              {t("incompleteAt")}
            </Badge>
          ),
          description: dateTime(addHours(new Date(subscription.created), 23)),
        });
  }

  return (
    <Col span="24">
      <Descriptions cols={1} items={info} />
    </Col>
  );
};

export default SubscriptionInfo;
