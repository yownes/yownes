import React, { Dispatch, SetStateAction } from "react";
import { Col, Divider, Row, Select, Space, Switch, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plans_features_edges_node,
  Plans_products_edges_node,
  Plans_products_edges_node_features_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalice } from "../../lib/normalice";

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
  currentProductId: string | undefined;
  error: string | null | undefined;
  features: Plans_products_edges_node_features_edges_node[] | undefined;
  interval: PlanInterval;
  loading: boolean;
  onChangeInterval: Dispatch<SetStateAction<PlanInterval>>;
  onChangePlan: (plan: string) => void;
  plan: Plans_products_edges_node | undefined;
  planId: string | undefined;
  plansFeatures: (Plans_features_edges_node | null)[] | null | undefined;
  products: Plans_products_edges_node[];
  step: boolean;
}

const ChangeSubscription = ({
  activeApps,
  amount,
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

  return (
    <>
      {!step ? (
        loading ? (
          <Loading />
        ) : (
          <Space direction="vertical" size="large" style={{ width: "100%" }}>
            <Space direction="horizontal">
              <span>{t("client:monthlyPayment")} </span>
              <Switch
                checked={interval === PlanInterval.MONTH}
                onChange={(checked) =>
                  checked
                    ? onChangeInterval(PlanInterval.MONTH)
                    : onChangeInterval(PlanInterval.YEAR)
                }
              />
            </Space>
            <Select
              defaultValue={currentProductId}
              onChange={onChangePlan}
              style={{ width: "100%" }}
              value={planId}
            >
              {products?.map((product) => {
                const prices = connectionToNodes(product.prices);
                const amount = prices
                  .filter((price) => price.active)
                  .find(
                    (price) =>
                      JSON.parse(
                        normalice(price.recurring)
                      ).interval.toUpperCase() === interval
                  )?.unitAmount;
                const exceeded = activeApps
                  ? parseInt(
                      JSON.parse(normalice(product.metadata)).allowed_apps
                    ) < activeApps
                  : false;
                return (
                  <Select.Option
                    disabled={exceeded}
                    key={product.id}
                    value={product.id}
                  >
                    <Row justify="space-between">
                      <Row gutter={10} justify="start">
                        <Col>
                          <Text disabled={exceeded} strong>
                            {product.name}{" "}
                          </Text>
                        </Col>
                        {plan?.metadata && (
                          <Col>
                            <Text disabled={exceeded}>
                              {"("}
                              {
                                JSON.parse(normalice(product?.metadata))
                                  .allowed_apps
                              }
                              {" Apps)"}
                            </Text>
                          </Col>
                        )}
                      </Row>
                      <Col>
                        {amount
                          ? (amount / 100).toFixed(2).replace(/\./g, ",")
                          : "-"}
                        {" €/"}
                        {t(`${interval}`.toLocaleLowerCase())}
                      </Col>
                    </Row>
                  </Select.Option>
                );
              })}
            </Select>
            <Text type="secondary">
              {t("client:warnings.changeSubscription", { num: activeApps })}
            </Text>
          </Space>
        )
      ) : (
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text type="secondary" style={{ marginRight: 20 }}>
                {t("plan")}:
              </Text>
              <Text style={{ margin: 0, padding: 0 }} strong>
                {plan?.name}
              </Text>
            </Row>
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text type="secondary" style={{ marginRight: 20 }}>
                {t("renewal")}:
              </Text>
              <Text style={{ margin: 0, padding: 0 }}>
                {interval === PlanInterval.MONTH
                  ? t("translation:monthly")
                  : t("translation:annual")}
              </Text>
            </Row>
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text type="secondary" style={{ marginRight: 20 }}>
                {t("description")}:
              </Text>
              <Text style={{ margin: 0, padding: 0 }}>{plan?.description}</Text>
            </Row>
            <Row
              style={{
                marginBottom: 5,
              }}
            >
              <Col>
                <Text type="secondary" style={{ marginRight: 20 }}>
                  {t("features")}:
                </Text>
              </Col>
              <Row
                style={{
                  display: "grid",
                  flex: 1,
                  textAlign: "end",
                }}
              >
                {}
                {features && features?.length < 1
                  ? "-"
                  : features?.map((feat) => {
                      return (
                        <div key={feat.id}>
                          <span className={styles.features}>
                            {"· "}
                            {
                              plansFeatures
                                ?.filter<Plans_features_edges_node>(notNull)
                                .find((f) => f?.id === feat.id)?.name
                            }
                          </span>
                        </div>
                      );
                    })}
              </Row>
            </Row>
            <Divider />
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginBottom: 5,
              }}
            >
              <Text type="secondary">{t("raw")}:</Text>
              <Text style={{ margin: 0, padding: 0 }}>
                {amount
                  ? (amount / 100 / 1.21).toFixed(2).replace(/\./g, ",")
                  : "-"}
                {" €"}
              </Text>
            </Row>
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
              }}
            >
              <Text type="secondary">{t("taxes")}:</Text>
              <Text style={{ margin: 0, padding: 0 }}>
                {amount
                  ? (amount / 100 - amount / 100 / 1.21)
                      .toFixed(2)
                      .replace(/\./g, ",")
                  : "-"}
                {" €"}
              </Text>
            </Row>
            <Row
              style={{
                alignItems: "flex-end",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <Text type="secondary">{t("total")}:</Text>
              <Text style={{ margin: 0, padding: 0 }} strong>
                {amount ? (amount / 100).toFixed(2).replace(/\./g, ",") : "-"}
                {" €"}
              </Text>
            </Row>
            <Divider />
            <Row>
              <Text type="secondary">
                Se aplicarán los cambios desde este mismo instante. FALTA
                EXPLICAR COMO SE AJUSTARÁ EL COBRO ACTUAL / SIGUIENTE
              </Text>
            </Row>
            {error && (
              <Row style={{ marginTop: 10 }}>
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
            )}
          </Col>
        </Row>
      )}
    </>
  );
};

export default ChangeSubscription;
