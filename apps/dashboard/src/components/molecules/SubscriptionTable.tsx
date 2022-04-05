import React, { useState } from "react";
import { Card, Col, Collapse, Table, Typography, TableColumnsType } from "antd";
import { format } from "date-fns";
import es from "date-fns/locale/es";
import { useTranslation } from "react-i18next";

import { SubscriptionStatus } from "../../api/types/globalTypes";
import { MyAccount_me_subscription_invoices_edges_node } from "../../api/types/MyAccount";
import { Plans, Plans_features_edges_node } from "../../api/types/Plans";
import { Subscriptions_subscriptions_edges_node } from "../../api/types/Subscriptions";
import connectionToNodes from "../../lib/connectionToNodes";

import { ExpandIcon, InvoicesTable, SubscriptionState } from "./";

import styles from "./SubscriptionTable.module.css";

const { Panel } = Collapse;
const { Text } = Typography;

interface SubscriptionTableProps {
  invoices: MyAccount_me_subscription_invoices_edges_node[] | undefined;
  plans: Plans | undefined;
  subscriptions: Subscriptions_subscriptions_edges_node[];
}

function notNull(
  value: Plans_features_edges_node | null,
  index: number,
  array: (Plans_features_edges_node | null)[]
): value is Plans_features_edges_node {
  return (value as Plans_features_edges_node).id !== undefined;
}

const SubscriptionTable = ({
  invoices,
  plans,
  subscriptions,
}: SubscriptionTableProps) => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState<string[]>([]);
  const columnsSubscriptions: TableColumnsType<Subscriptions_subscriptions_edges_node> =
    [
      {
        title: t("plan"),
        dataIndex: ["plan", "product", "name"],
        key: "name",
        render: (name) => <Text strong>{name}</Text>,
      },
      {
        title: t("state"),
        dataIndex: "status",
        key: "state",
        render: (state: SubscriptionStatus) => {
          return <SubscriptionState state={state}></SubscriptionState>;
        },
      },
      {
        title: t("started"),
        dataIndex: "created",
        key: "started",
        render: (created) => (
          <Text>
            {format(new Date(created), "dd MMM'. 'HH:mm", {
              locale: es,
            })}
          </Text>
        ),
      },
      {
        title: t("ended"),
        dataIndex: "endedAt",
        key: "ended",
        render: (ended) => (
          <Text>
            {ended
              ? format(
                  new Date(ended),
                  new Date(ended).getFullYear() !== new Date().getFullYear()
                    ? "dd MMM'. 'yyyy' 'HH:mm"
                    : "dd MMM'. 'HH:mm",
                  {
                    locale: es,
                  }
                )
              : t("unknown")}
          </Text>
        ),
      },
    ];
  return (
    <Collapse className={styles.collapse} ghost>
      <Panel
        header={t("showPreviousSubscriptions", {
          num: subscriptions.length,
        })}
        key="subscriptions"
      >
        <Col span="24">
          <Table
            columns={columnsSubscriptions}
            dataSource={subscriptions}
            expandable={{
              expandIcon: ({ expanded, onExpand, record }) => (
                <ExpandIcon
                  expanded={expanded}
                  onExpand={onExpand}
                  record={record}
                />
              ),
              expandRowByClick: true,
              expandedRowRender: (record) => (
                <Card>
                  <p>
                    <Text type="secondary">{t("description")}:</Text>
                    <Text className={styles.description}>
                      {record.plan?.product?.description}
                    </Text>
                  </p>
                  <p>
                    <Text type="secondary">{t("features")}:</Text>
                    {connectionToNodes(record.plan?.product?.features).map(
                      (feat) => {
                        return (
                          <Text
                            key={`${record.stripeId}${feat.id}`}
                            className={styles.features}
                          >
                            {"· "}
                            {
                              connectionToNodes(plans?.features)
                                ?.filter<Plans_features_edges_node>(notNull)
                                .find((f) => f?.id === feat.id)?.name
                            }
                          </Text>
                        );
                      }
                    )}
                  </p>
                  <>
                    <Text type="secondary">{t("invoices")}:</Text>
                    <InvoicesTable
                      invoices={
                        invoices
                          ? invoices.filter(
                              (inv) =>
                                inv.subscription?.stripeId === record.stripeId
                            )
                          : []
                      }
                    />
                  </>
                </Card>
              ),
              expandedRowKeys: expandedRow,
              onExpand: (expanded, record) =>
                expanded
                  ? setExpandedRow([record.created])
                  : setExpandedRow([]),
            }}
            locale={{ emptyText: t("noSubscriptions") }}
            pagination={{
              showSizeChanger: true,
              showTotal: (total, range) =>
                t("paginationItems", {
                  first: range[0],
                  last: range[1],
                  total: total,
                  item: t("subscriptions"),
                }),
            }}
            rowClassName={(row) =>
              expandedRow.includes(row.created) ? styles.expandedRow : ""
            }
            rowKey={(row) => row.created}
          />
        </Col>
      </Panel>
    </Collapse>
  );
};

export default SubscriptionTable;
