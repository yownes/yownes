import React, { Dispatch, SetStateAction } from "react";
import { Col, Divider, Row, Select, Space, Switch, Typography } from "antd";
import find from "lodash/find";
import { useTranslation } from "react-i18next";

import { PlanInterval } from "../../api/types/globalTypes";
import { MyAccount_me_subscription_plan_product } from "../../api/types/MyAccount";
import {
  Plans_features_edges_node,
  Plans_products_edges_node,
  Plans_products_edges_node_features_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { currencySymbol } from "../../lib/currencySymbol";
import { normalize } from "../../lib/normalize";

import { Loading } from "../atoms";
import { Errors } from "../molecules";

import styles from "./ChangeSubscription.module.css";

const { Text } = Typography;

function notNull(
  value: Plans_features_edges_node | null,
  index: number,
  array: (Plans_features_edges_node | null)[]
): value is Plans_features_edges_node {
  return (value as Plans_features_edges_node).id !== undefined;
}

interface ChangeSubscriptionProps {
  activeApps: number;
  amount: number | null | undefined;
  currency: string | undefined;
  currentProductId: string | undefined;
  error: string | null | undefined;
  features: Plans_products_edges_node_features_edges_node[] | undefined;
  interval: PlanInterval;
  loading: boolean;
  onChangeInterval: Dispatch<SetStateAction<PlanInterval>>;
  onChangePlan: (plan: string) => void;
  plan:
    | Plans_products_edges_node
    | MyAccount_me_subscription_plan_product
    | undefined;
  planId: string | undefined;
  plansFeatures: (Plans_features_edges_node | null)[] | null | undefined;
  products: Plans_products_edges_node[];
  step: boolean;
}

const ChangeSubscription = ({
  activeApps,
  amount,
  currency,
  currentProductId,
  error,
  features,
  interval,
  loading,
  onChangeInterval,
  onChangePlan,
  plan,
  planId,
  plansFeatures,
  products,
  step,
}: ChangeSubscriptionProps) => {
  const { t } = useTranslation();

  const allowed_apps = plan?.metadata
    ? JSON.parse(normalize(plan.metadata)).allowed_apps || 1
    : 1;
  const allowed_builds = plan?.metadata
    ? JSON.parse(normalize(plan.metadata)).allowed_builds || 1
    : 1;

  const legacyOption = () => {
    if (find(products, (p) => p.id === currentProductId) !== undefined) {
      return undefined;
    }
    const allowed = JSON.parse(normalize(plan?.metadata!!)).allowed_apps;
    const prices = connectionToNodes(plan?.prices);
    const price = prices
      .filter((price) => price.active)
      .find(
        (price) =>
          JSON.parse(normalize(price.recurring!!)).interval.toUpperCase() ===
          interval
      );

    return (
      <Select.Option disabled key={currentProductId} value={currentProductId}>
        <Row justify="space-between">
          <Row gutter={10} justify="start">
            <Col>
              <Text className={`${styles.disabled} ${styles.strong}`}>
                {plan?.name}{" "}
              </Text>
            </Col>
            {plan?.metadata && (
              <Col>
                <Text className={`${styles.disabled} ${styles.strong}`}>
                  {"("}
                  {allowed} {allowed === 1 ? t("app") : t("apps")}
                  {")"}
                </Text>
              </Col>
            )}
          </Row>
          <Col>
            <Text className={styles.disabled} italic>
              {t("legacy")}
            </Text>
          </Col>
          <Col>
            <Text className={`${styles.disabled} ${styles.strong}`}>
              {price?.unitAmount
                ? (price?.unitAmount / 100).toFixed(2).replace(/\./g, ",")
                : "-"}
              {`${currencySymbol(price?.currency ?? "")}/`}
              {t(`${interval}`.toLocaleLowerCase())}
            </Text>
          </Col>
        </Row>
      </Select.Option>
    );
  };

  return (
    <Row gutter={[24, 24]}>
      {!step ? (
        loading ? (
          <Loading />
        ) : (
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className={styles.switch}>
                  <Switch
                    checked={interval === PlanInterval.MONTH}
                    onChange={(checked) =>
                      checked
                        ? onChangeInterval(PlanInterval.MONTH)
                        : onChangeInterval(PlanInterval.YEAR)
                    }
                  />
                  <span className={styles.switchLabel}>
                    {t("client:monthlyPayment")}
                  </span>
                </div>
              </Col>
              <Col span={24}>
                <Select
                  className={styles.select}
                  defaultValue={currentProductId}
                  onChange={onChangePlan}
                  value={planId}
                >
                  {legacyOption()}
                  {products?.map((product) => {
                    const allowed = parseInt(
                      JSON.parse(normalize(product.metadata!!)).allowed_apps
                    );
                    const exceeded = activeApps ? allowed < activeApps : false;
                    const prices = connectionToNodes(product.prices);
                    const price = prices
                      .filter((price) => price.active)
                      .find(
                        (price) =>
                          JSON.parse(
                            normalize(price.recurring!!)
                          ).interval.toUpperCase() === interval
                      );

                    return (
                      <Select.Option
                        disabled={exceeded}
                        key={product.id}
                        value={product.id}
                      >
                        <Row justify="space-between">
                          <Row gutter={10} justify="start">
                            <Col>
                              <Text
                                className={
                                  plan?.id === product.id
                                    ? styles.strong
                                    : undefined
                                }
                                disabled={exceeded}
                              >
                                {product.name}{" "}
                              </Text>
                            </Col>
                            {product?.metadata && (
                              <Col>
                                <Text
                                  className={
                                    plan?.id === product.id
                                      ? styles.strong
                                      : undefined
                                  }
                                  disabled={exceeded}
                                >
                                  {"("}
                                  {allowed}{" "}
                                  {allowed === 1 ? t("app") : t("apps")}
                                  {")"}
                                </Text>
                              </Col>
                            )}
                          </Row>
                          <Col>
                            <Text
                              className={
                                plan?.id === product.id
                                  ? styles.strong
                                  : undefined
                              }
                              disabled={exceeded}
                            >
                              {price?.unitAmount
                                ? (price?.unitAmount / 100)
                                    .toFixed(2)
                                    .replace(/\./g, ",")
                                : "-"}
                              {`${currencySymbol(price?.currency ?? "")}/`}
                              {t(`${interval}`.toLocaleLowerCase())}
                            </Text>
                          </Col>
                        </Row>
                      </Select.Option>
                    );
                  })}
                </Select>
              </Col>
              <Col span={24}>
                <Row gutter={[24, 16]}>
                  <Col span={24}>
                    <Text type="secondary">
                      {t("client:warnings.changeSubscription")}
                    </Text>
                  </Col>
                  <Col span={24}>
                    <Text type="secondary">
                      {t("client:warnings.appsNow", {
                        num: activeApps,
                      })}
                    </Text>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
        )
      ) : (
        <Col span={24}>
          <Row className={styles.font} gutter={[24, 24]}>
            <Col span={24}>
              <Row gutter={[24, 4]}>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("plan")}</Text>
                    <Text className={styles.plan} type="secondary">
                      {plan?.name}
                    </Text>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("renewal")}</Text>
                    <Text type="secondary">
                      {interval === PlanInterval.MONTH
                        ? t("translation:monthly")
                        : t("translation:annual")}
                    </Text>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("description")}</Text>
                    <Text type="secondary">{plan?.description}</Text>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row>
                    <Col>
                      <Text>{t("include")}</Text>
                    </Col>
                    <Row className={styles.features}>
                      {}
                      {features &&
                        features.map((feat, i) => {
                          return (
                            <span className={styles.feature} key={feat.id}>
                              {i !== 0 && ","}
                              {
                                plansFeatures
                                  ?.filter<Plans_features_edges_node>(notNull)
                                  .find((f) => f?.id === feat.id)?.name
                              }
                            </span>
                          );
                        })}
                      {allowed_apps === "1"
                        ? features && features.length > 0
                          ? `, ${allowed_apps} ${t("includedApp")}`
                          : `${allowed_apps} ${t("includedApp")}`
                        : features && features.length > 0
                        ? `, ${allowed_apps} ${t("includedApps")}`
                        : `${allowed_apps} ${t("includedApps")}`}
                      {allowed_builds === "1"
                        ? ` (${allowed_builds} ${t("includedBuild")})`
                        : ` (${allowed_builds} ${t("includedBuilds")})`}
                    </Row>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row gutter={[24, 4]}>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("raw")}</Text>
                    <Text type="secondary">
                      {amount
                        ? (amount / 100 / 1.21).toFixed(2).replace(/\./g, ",")
                        : "-"}
                      {currencySymbol(currency ?? "")}
                    </Text>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("taxes")}</Text>
                    <Text type="secondary">
                      {amount
                        ? (amount / 100 - amount / 100 / 1.21)
                            .toFixed(2)
                            .replace(/\./g, ",")
                        : "-"}
                      {currencySymbol(currency ?? "")}
                    </Text>
                  </Row>
                </Col>
                <Col span={24}>
                  <Row align="bottom" justify="space-between">
                    <Text>{t("total")}</Text>
                    <Text className={styles.amount} type="secondary">
                      {amount
                        ? (amount / 100).toFixed(2).replace(/\./g, ",")
                        : "-"}
                      {currencySymbol(currency ?? "")}
                    </Text>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row>
                <Text type="secondary">
                  Se aplicarán los cambios desde este mismo instante. FALTA
                  EXPLICAR COMO SE AJUSTARÁ EL COBRO ACTUAL / SIGUIENTE
                </Text>
              </Row>
            </Col>
            {error && (
              <Col span={24}>
                <Row>
                  <Errors
                    errors={{
                      nonFieldErrors: error
                        ? [
                            {
                              message: error,
                              code: "error",
                            },
                          ]
                        : undefined,
                    }}
                  />
                </Row>
              </Col>
            )}
          </Row>
        </Col>
      )}
    </Row>
  );
};

export default ChangeSubscription;
