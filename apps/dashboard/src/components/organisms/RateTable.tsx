import React, { useEffect, useState } from "react";
import { Card, Col, Divider, Row, Switch, Table, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import groupBy from "lodash/groupBy";
import orderBy from "lodash/orderBy";
import { useTranslation } from "react-i18next";

import { PLANS } from "../../api/queries";
import { PlanInterval } from "../../api/types/globalTypes";
import type {
  Plans,
  Plans_features_edges_node,
  Plans_products_edges_node,
  Plans_products_edges_node_prices_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import { Loading } from "../atoms";
import { RateSelection } from "../molecules";
import type { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateTable.module.css";

const { Text, Title } = Typography;

export interface Rate {
  title: string;
  subtitle?: string;
  price: number;
  id: string;
  features: string[];
}

export interface Feature {
  title: string;
  id: string;
}

interface RateTableProps {
  onPlanSelected: (plan: CheckoutLocationState) => void;
}

function selectPlan(
  prices: Plans_products_edges_node_prices_edges_node[],
  interval: PlanInterval,
  name: string
): CheckoutLocationState {
  const plan = prices
    .filter((p) => p.active)
    .find(
      (p) =>
        JSON.parse(normalize(p.recurring!)).interval.toUpperCase() === interval
    );
  if (plan) {
    return {
      ...plan,
      name,
    };
  } else {
    return {
      __typename: "StripePriceType",
      unitAmount: 0,
      currency: "",
      id: "-1",
      stripeId: "-1",
      // eslint-disable-next-line no-useless-escape
      recurring: `{\"interval\": \"${PlanInterval.MONTH.toLowerCase()}\"}`,
      name,
      active: false,
    };
  }
}

function notNull(
  value: Plans_features_edges_node | null,
  index: number,
  array: (Plans_features_edges_node | null)[]
): value is Plans_features_edges_node {
  return (value as Plans_features_edges_node).id !== undefined;
}

const RateTable = ({ onPlanSelected }: RateTableProps) => {
  const { t } = useTranslation("client");
  const { data, loading } = useQuery<Plans>(PLANS);
  const [products, setProducts] = useState<
    Plans_products_edges_node[] | null
  >();
  const [interval, setInterval] = useState(PlanInterval.MONTH);

  useEffect(() => {
    setProducts(
      connectionToNodes(data?.products).filter((prod) =>
        connectionToNodes(prod.prices).find((pri) => pri.active)
      )
    );
  }, [data?.products]);

  if (loading) {
    return <Loading />;
  }

  const plans = orderBy(
    products,
    [
      (item) => JSON.parse(normalize(item.metadata!)).plan_type,
      (item) =>
        connectionToNodes(item.prices)
          .filter((price) => price.active)
          .find(
            (price) =>
              JSON.parse(normalize(price.recurring!)).interval.toUpperCase() ===
              interval
          )?.unitAmount,
    ],
    ["desc", "asc"]
  );

  const plansByType = orderBy(
    groupBy(plans, (p) => JSON.parse(normalize(p.metadata!)).plan_type),
    "desc"
  );

  const dataSource = connectionToNodes(data?.features)
    ?.filter<Plans_features_edges_node>(notNull)
    .map((feat) => {
      const ids = plans
        .map((plan) => ({
          [plan.id]: connectionToNodes(plan.features)
            .map((f) => f.id)
            .includes(feat.id),
        }))
        .reduce((a, b) => ({ ...a, ...b }), {});
      return {
        ...feat,
        ...ids,
        key: feat.id,
      };
    });
  const apps = plans.map((plan) => ({
    [plan.id]: JSON.parse(normalize(plan.metadata!)).allowed_apps,
  }));
  const builds = plans.map((plan) => ({
    [plan.id]: JSON.parse(normalize(plan.metadata!)).allowed_builds,
  }));
  dataSource.push(
    {
      __typename: "FeaturesType",
      id: "apps",
      key: "apps",
      name: t("allowedApps"),
      ...apps.reduce((a, b) => ({ ...a, ...b }), {}),
    },
    {
      __typename: "FeaturesType",
      id: "builds",
      key: "builds",
      name: t("allowedBuilds"),
      ...builds.reduce((a, b) => ({ ...a, ...b }), {}),
    }
  );

  const plan = (rate: Plans_products_edges_node) => ({
    title: (
      <RateSelection
        key={rate.id}
        title={rate.name}
        subtitle={rate.description ?? "-"}
        plan={selectPlan(connectionToNodes(rate.prices), interval, rate.name)}
        onPlanSelected={onPlanSelected}
      />
    ),
    align: "center" as const,
    key: rate.id,
    dataIndex: rate.id,
    render(text?: string | boolean) {
      if (typeof text === "string") {
        return text;
      } else {
        if (text) {
          return <CheckOutlined style={{ fontSize: 14, color: "#61db9b" }} />;
        } else {
          return <CloseOutlined style={{ fontSize: 14, color: "#dd0000" }} />;
        }
      }
    },
  });

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("client:selectPlan")}
              </Title>
              <div className={styles.switch}>
                <Switch
                  checked={interval === PlanInterval.MONTH}
                  onChange={(checked) => {
                    setInterval(
                      checked ? PlanInterval.MONTH : PlanInterval.YEAR
                    );
                  }}
                />
                <span style={{ marginLeft: 16 }}>{t("monthlyPayment")}</span>
              </div>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Table
                columns={[
                  {
                    title: "",
                    dataIndex: "name",
                    fixed: "left",
                    render: (feat) => (
                      <Text className={styles.feature}>{feat}</Text>
                    ),
                    width: "20%",
                  },
                  ...plansByType.map((p) => {
                    return {
                      title: (
                        <Divider className={styles.divider}>
                          {t(
                            `subscriptionType.${
                              JSON.parse(normalize(p[0].metadata!)).plan_type
                            }`
                          )}
                        </Divider>
                      ),
                      children: [
                        ...p.map((rate) => {
                          return plan(rate);
                        }),
                      ],
                    };
                  }),
                ]}
                locale={{ emptyText: t("client:noPlans") }}
                pagination={false}
                dataSource={plans.length > 0 ? dataSource : []}
                className={styles.table}
              />
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default RateTable;
