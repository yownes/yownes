import React, { useEffect } from "react";
import type { Dispatch, SetStateAction } from "react";
import { Col, Row, Select, Switch, Typography } from "antd";
import type { TFunction } from "i18next";
import find from "lodash/find";
import { useTranslation } from "react-i18next";

import { PlanInterval } from "../../api/types/globalTypes";
import type { MyAccount_me_subscription_plan_product } from "../../api/types/MyAccount";
import type {
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
  currentProduct:
    | Plans_products_edges_node
    | MyAccount_me_subscription_plan_product
    | undefined;
  error: string | null | undefined;
  features: Plans_products_edges_node_features_edges_node[] | undefined;
  interval: PlanInterval;
  loading: boolean;
  onChangeInterval: Dispatch<SetStateAction<PlanInterval>>;
  onChangePlan: (plan: string) => void;
  onDisable: (disable: boolean) => void;
  plan:
    | Plans_products_edges_node
    | MyAccount_me_subscription_plan_product
    | undefined;
  planId: string | undefined;
  plansFeatures: (Plans_features_edges_node | null)[] | null | undefined;
  products: Plans_products_edges_node[];
  step: boolean;
}

function handleAllowedApps(
  allowed: string | number,
  t: TFunction,
  features?: Plans_products_edges_node_features_edges_node[]
) {
  if (allowed === "1") {
    if (features && features.length > 0) {
      return `, ${allowed} ${t("includedApp")}`;
    } else {
      return `${allowed} ${t("includedApp")}`;
    }
  } else {
    if (features && features.length > 0) {
      return `, ${allowed} ${t("includedApps")}`;
    } else {
      return `${allowed} ${t("includedApps")}`;
    }
  }
}

function handleSwitch(
  checked: boolean,
  id: string,
  onChangeInterval: Dispatch<SetStateAction<PlanInterval>>,
  onDisable: (disable: boolean) => void,
  products: Plans_products_edges_node[]
) {
  const prod = products.find((p) => p.id === id);
  const prices = connectionToNodes(prod?.prices);
  const price = prices
    .filter((pr) => pr.active)
    .find(
      (p) =>
        JSON.parse(normalize(p.recurring!)).interval.toUpperCase() ===
        (checked ? PlanInterval.MONTH : PlanInterval.YEAR)
    );
  if (!price) {
    onDisable(true);
  } else {
    onDisable(false);
  }
  if (checked) {
    onChangeInterval(PlanInterval.MONTH);
  } else {
    onChangeInterval(PlanInterval.YEAR);
  }
}

const ChangeSubscription = ({
  activeApps,
  amount,
  currency,
  currentProduct,
  error,
  features,
  interval,
  loading,
  onChangeInterval,
  onChangePlan,
  onDisable,
  plan,
  planId,
  plansFeatures,
  products,
  step,
}: ChangeSubscriptionProps) => {
  const { t } = useTranslation();

  useEffect(() => {
    if (currentProduct?.id === plan?.id) {
      onDisable(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProduct?.id, plan?.id]);

  const allowed_apps = plan?.metadata
    ? JSON.parse(normalize(plan.metadata)).allowed_apps || 1
    : 1;
  const allowed_builds = plan?.metadata
    ? JSON.parse(normalize(plan.metadata)).allowed_builds || 1
    : 1;

  const legacyOption = () => {
    if (find(products, (p) => p.id === currentProduct?.id) !== undefined) {
      return undefined;
    }
    const allowed = currentProduct
      ? JSON.parse(normalize(currentProduct.metadata!)).allowed_apps
      : 0;
    const prices = connectionToNodes(currentProduct?.prices);
    const price = prices
      .filter((p) => p.active)
      .find(
        (p) =>
          JSON.parse(normalize(p.recurring!)).interval.toUpperCase() ===
          interval
      );
    if (!price) {
      return undefined;
    }
    return (
      <Select.Option
        disabled
        key={currentProduct?.id}
        value={currentProduct?.id}
      >
        <Row justify="space-between">
          <Row gutter={10} justify="start">
            <Col>
              <Text className={`${styles.disabled} ${styles.strong}`}>
                {currentProduct?.name}{" "}
              </Text>
            </Col>
            {currentProduct?.metadata && (
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
  if (!step) {
    if (loading) {
      return <Loading />;
    } else {
      return (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Row gutter={[24, 24]}>
              <Col span={24}>
                <div className={styles.switch}>
                  <Switch
                    defaultChecked={interval === PlanInterval.MONTH}
                    onChange={(checked) =>
                      handleSwitch(
                        checked,
                        planId ?? "",
                        onChangeInterval,
                        onDisable,
                        products
                      )
                    }
                  />
                  <span className={styles.switchLabel}>
                    {t("client:monthlyPayment")}
                  </span>
                </div>
              </Col>
              <Col span={24}>
                <Select
                  className="select-field"
                  defaultValue={currentProduct?.id}
                  onChange={onChangePlan}
                  value={planId}
                >
                  {legacyOption()}
                  {products?.map((product) => {
                    const allowed = parseInt(
                      JSON.parse(normalize(product.metadata!)).allowed_apps,
                      10
                    );
                    const exceeded = activeApps ? allowed < activeApps : false;
                    const prices = connectionToNodes(product.prices);
                    const price = prices
                      .filter((p) => p.active)
                      .find(
                        (p) =>
                          JSON.parse(
                            normalize(p.recurring!)
                          ).interval.toUpperCase() === interval
                      );
                    if (!price) {
                      return undefined;
                    }
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
        </Row>
      );
    }
  } else {
    return (
      <Row gutter={[24, 24]}>
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
                      {handleAllowedApps(allowed_apps, t, features)}
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
                  Se aplicar??n los cambios desde este mismo instante. FALTA
                  EXPLICAR COMO SE AJUSTAR?? EL COBRO ACTUAL / SIGUIENTE
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
      </Row>
    );
  }
};

export default ChangeSubscription;
