import React, { useState } from "react";
import { Switch, Table, Typography } from "antd";
import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import reverse from "lodash/reverse";
import { useTranslation } from "react-i18next";

import { PLANS } from "../../api/queries";
import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plans,
  Plans_features_edges_node,
  Plans_products_edges_node_prices_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalice } from "../../lib/normalice";

import { Loading } from "../atoms";
import { RateSelection } from "../molecules";
import { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateTable.module.css";

const { Title } = Typography;

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
    .filter((plan) => plan.active)
    .find(
      (plan) =>
        JSON.parse(normalice(plan.recurring)).interval.toUpperCase() ===
        interval
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
      recurring: `{\"interval\": \"${PlanInterval.DAY.toLowerCase()}\"}`,
      name,
      active: true,
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
  const [interval, setInterval] = useState(PlanInterval.DAY);

  if (loading) return <Loading />;

  const nodes = reverse(connectionToNodes(data?.products));

  const dataSource = connectionToNodes(data?.features)
    ?.filter<Plans_features_edges_node>(notNull)
    .map((feat) => {
      const ids = nodes
        .map((node) => ({
          [node.id]: connectionToNodes(node.features)
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

  // const appsAllowed = nodes
  //   .map(
  //     (plan) =>
  //       plan.metadata && {
  //         key: "allowedApps",
  //         __typename: "CustomType",
  //         [plan.id]: JSON.parse(normalice(plan.metadata)),
  //         name: Object.keys(JSON.parse(normalice(plan.metadata))),
  //       }
  //   )
  //   .reduce((a, b) => ({ ...a, ...b }), {});

  return (
    <>
      <Title level={2}>{t("client:selectPlan")}</Title>
      <Table
        columns={[
          {
            title: (
              <div className={styles.switch}>
                <span>{t("monthlyPayment")} </span>
                <Switch
                  checked={interval === PlanInterval.DAY}
                  onChange={(checked) => {
                    setInterval(checked ? PlanInterval.DAY : PlanInterval.YEAR);
                  }}
                />
              </div>
            ),
            dataIndex: "name",
            fixed: "left",
          },
          ...nodes.map((rate, i) => ({
            title: (
              <RateSelection
                key={rate.id}
                title={rate.name}
                subtitle={rate.description ?? "-"}
                plan={selectPlan(
                  connectionToNodes(rate.prices),
                  interval,
                  rate.name
                )}
                onPlanSelected={onPlanSelected}
              />
            ),
            key: rate.id,
            dataIndex: rate.id,
            render(
              text: any,
              record: Plans_features_edges_node,
              index: number
            ) {
              return text ? (
                <CheckOutlined style={{ fontSize: 20, color: "#61db9b" }} />
              ) : (
                <CloseOutlined style={{ fontSize: 20, color: "#dd0000" }} />
              );
            },
          })),
        ]}
        pagination={false}
        //scroll={{ x: 1500 /*, y: "40vh"*/ }}
        dataSource={dataSource}
        className={styles.table}
      />
    </>
  );
};

export default RateTable;
