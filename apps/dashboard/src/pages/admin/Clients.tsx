import React from "react";
import { Col, Card, Row, Table, Tooltip, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { useQuery } from "@apollo/client";
import forIn from "lodash/forIn";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { CLIENTS, PLANS } from "../../api/queries";
import type {
  Clients as IClients,
  ClientsVariables,
  Clients_users_edges_node,
  Clients_users_edges_node_apps_edges,
  Clients_users_edges_node_subscription_plan_product,
} from "../../api/types/Clients";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type { Plans } from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import type { Filter } from "../../lib/filterColumns";
import {
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";
import { Loading } from "../../components/atoms";
import { UserState, VerifiedState } from "../../components/molecules";

import styles from "./Clients.module.css";

const { Text, Title } = Typography;

interface IPlan {
  id: string;
  active: boolean;
  name: string;
}

function getAccountStatusFilters() {
  const filters: Filter[] = [];
  forIn(AccountAccountStatus, (value) => {
    filters.push({ text: <UserState state={value} />, value: value });
  });
  return filters;
}

function getSubscriptionFilters(plans: IPlan[], t: TFunction) {
  const filters: Filter[] = [];
  const active: Filter[] = [];
  const inactive: Filter[] = [];
  for (const plan of plans) {
    if (plan.active) {
      active.push({ text: plan.name, value: plan.id });
    } else {
      inactive.push({ text: plan.name, value: plan.id });
    }
  }
  filters.push({ key: "-", text: t("admin:noSubs"), value: "-" });
  filters.push({ children: active, text: t("admin:activeSubs"), value: "1" });
  filters.push({
    children: inactive,
    text: t("admin:inactiveSubs"),
    value: "0",
  });
  return filters;
}

function getVerifiedStatusFilters() {
  const filters: Filter[] = [];
  filters.push({
    text: <VerifiedState verified={true} />,
    value: true,
  });
  filters.push({
    text: <VerifiedState verified={false} />,
    value: false,
  });
  return filters;
}

const Clients = () => {
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const { data, loading } = useQuery<IClients, ClientsVariables>(CLIENTS);
  const { data: plansData, loading: loadingPlans } = useQuery<Plans>(PLANS);
  const dataSource = connectionToNodes(data?.users).filter(
    (user) => !user.isStaff
  );

  if (loading || loadingPlans) {
    return <Loading />;
  }

  const plans: IPlan[] = connectionToNodes(plansData?.products).map((plan) => ({
    id: plan.id,
    active: plan.active ?? false,
    name: plan.name,
  }));

  const columns: TableColumnsType<Clients_users_edges_node> = [
    {
      title: t("name"),
      dataIndex: "username",
      key: "name",
      render: (name) => name,
      ...getColumnSearchProps<Clients_users_edges_node>(
        ["username"],
        t("admin:search"),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.username.localeCompare(b.username),
    },
    {
      title: t("admin:clientId"),
      dataIndex: "id",
      key: "id",
      render: (id) => id,
      ...getColumnSearchProps<Clients_users_edges_node>(
        ["id"],
        t("admin:search"),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: t("apps"),
      dataIndex: ["apps", "edges"],
      key: "apps",
      render: (apps: Clients_users_edges_node_apps_edges[]) => (
        <Tooltip overlay={t("admin:activeInactiveApps")}>{`${
          apps.filter((a) => a.node?.isActive).length
        } (${
          apps.length - apps.filter((a) => a.node?.isActive).length
        })`}</Tooltip>
      ),
      sorter: (a, b) =>
        a.apps.edges.filter((app) => app?.node?.isActive).length -
        b.apps.edges.filter((app) => app?.node?.isActive).length,
    },
    {
      title: t("state"),
      dataIndex: "accountStatus",
      key: "state",
      render: (state: AccountAccountStatus) => <UserState state={state} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["accountStatus"],
        getAccountStatusFilters()
      ),
      sorter: (a, b) => a.accountStatus.localeCompare(b.accountStatus),
    },
    {
      title: t("subscription"),
      dataIndex: ["subscription", "plan", "product"]
        ? ["subscription", "plan", "product", "name"]
        : "-",
      key: "subscription",
      render: (product: Clients_users_edges_node_subscription_plan_product) =>
        product ?? (
          <Text italic type="secondary">
            {t("admin:noSubs")}
          </Text>
        ),
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["subscription", "plan", "product", "id"],
        getSubscriptionFilters(plans, t)
      ),
      filterMode: "tree",
      sorter: (a, b) =>
        a.subscription
          ? a.subscription.plan!.product!.id.localeCompare(
              b.subscription ? b.subscription.plan!.product!.id : "-"
            )
          : "-".localeCompare(
              b.subscription ? b.subscription.plan!.product!.id : "-"
            ),
    },
    {
      title: t("verifiedStatus"),
      dataIndex: "verified",
      key: "verified",
      render: (verified: boolean) => <VerifiedState verified={verified} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["verified"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.verified) - Number(b.verified),
    },
    {
      title: t("isActive"),
      dataIndex: "isActive",
      key: "isActive",
      render: (isActive: boolean) => <VerifiedState verified={isActive} />,
      ...getColumnFilterProps<Clients_users_edges_node>(
        ["isActive"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
    },
  ];
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:clientList")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div className={styles.overflow}>
                <Table
                  className={styles.table}
                  columns={columns}
                  dataSource={dataSource}
                  locale={{ emptyText: t("admin:noClients") }}
                  onRow={(record) => {
                    return {
                      onClick: () => history.push(`/clients/${record.id}`),
                    };
                  }}
                  pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      t("paginationItems", {
                        first: range[0],
                        last: range[1],
                        total: total,
                        item: t("admin:clients"),
                      }),
                  }}
                  rowClassName={styles.row}
                  rowKey={(row) => row.id}
                />
              </div>
            </Col>
          </Row>
        </Card>
      </Col>
    </Row>
  );
};

export default Clients;
