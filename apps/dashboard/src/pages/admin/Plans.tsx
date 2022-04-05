import React from "react";
import {
  Card,
  Col,
  Button,
  Row,
  Table,
  TableColumnsType,
  Tooltip,
  Typography,
} from "antd";
import { useQuery } from "@apollo/client";
import { TFunction, useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

import { PLANS } from "../../api/queries";
import {
  Plans as IPlans,
  Plans_products_edges_node,
} from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";
import { normalice } from "../../lib/normalice";

import { Loading } from "../../components/atoms";
import { FeaturesInfo, VerifiedState } from "../../components/molecules";

import styles from "./Plans.module.css";

const { Text, Title } = Typography;

function getPlanTypeFilters(t: TFunction) {
  let filters: Filter[] = [];
  filters.push({
    text: <Text>{t("admin:particular")}</Text>,
    value: "particular",
  });
  filters.push({
    text: <Text>{t("admin:business")}</Text>,
    value: "business",
  });
  return filters;
}

function getVerifiedStatusFilters() {
  let filters: Filter[] = [];
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

const Plans = () => {
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const { data, loading } = useQuery<IPlans>(PLANS);
  const dataSource = connectionToNodes(data?.products);

  if (loading) return <Loading />;

  const columns: TableColumnsType<Plans_products_edges_node> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Tooltip title={record.description}>{name}</Tooltip>
      ),
      ...getColumnSearchProps<Plans_products_edges_node>(
        ["name"],
        t("admin:search", { data: t("name") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("admin:planId"),
      dataIndex: "id",
      key: "id",
      render: (id) => id,
      ...getColumnSearchProps<Plans_products_edges_node>(
        ["id"],
        t("admin:search", { data: t("admin:planId") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: t("admin:planType"),
      dataIndex: "metadata",
      key: "type",
      render: (metadata) =>
        t(`admin:${JSON.parse(normalice(metadata)).plan_type}`),
      ...getColumnFilterProps<Plans_products_edges_node>(
        ["metadata"],
        getPlanTypeFilters(t)
      ),
      sorter: (a, b) =>
        parseInt(
          JSON.parse(normalice(a.metadata!!)).plan_type
            ? JSON.parse(normalice(a.metadata!!)).plan_type
            : 0
        ) -
        parseInt(
          JSON.parse(normalice(b.metadata!!)).plan_type
            ? JSON.parse(normalice(b.metadata!!)).plan_type
            : 0
        ),
    },
    {
      title: t("admin:nApps"),
      dataIndex: "metadata",
      key: "apps",
      render: (metadata) => JSON.parse(normalice(metadata)).allowed_apps,
      sorter: (a, b) =>
        parseInt(
          JSON.parse(normalice(a.metadata!!)).allowed_apps
            ? JSON.parse(normalice(a.metadata!!)).allowed_apps
            : 0
        ) -
        parseInt(
          JSON.parse(normalice(b.metadata!!)).allowed_apps
            ? JSON.parse(normalice(b.metadata!!)).allowed_apps
            : 0
        ),
    },
    {
      title: t("admin:nBuilds"),
      dataIndex: "metadata",
      key: "builds",
      render: (metadata) => JSON.parse(normalice(metadata)).allowed_builds,
      sorter: (a, b) =>
        parseInt(
          JSON.parse(normalice(a.metadata!!)).allowed_builds
            ? JSON.parse(normalice(a.metadata!!)).allowed_builds
            : 0
        ) -
        parseInt(
          JSON.parse(normalice(b.metadata!!)).allowed_builds
            ? JSON.parse(normalice(b.metadata!!)).allowed_builds
            : 0
        ),
    },
    {
      title: t("isActive"),
      dataIndex: "active",
      defaultFilteredValue: ["true"],
      key: "isActive",
      render: (isActive: boolean) => <VerifiedState verified={isActive} />,
      ...getColumnFilterProps<Plans_products_edges_node>(
        ["active"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.active) - Number(b.active),
    },
  ];
  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:subscriptionPlans")}
                <div
                  style={{
                    position: "relative",
                    float: "right",
                  }}
                >
                  <Link to="/planes/new">
                    <Button className="button-default-primary">
                      {t("admin:newPlan")}
                    </Button>
                  </Link>
                </div>
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Table
                className={styles.table}
                columns={columns}
                dataSource={dataSource}
                locale={{ emptyText: t("admin:noPlans") }}
                onRow={(record) => {
                  return {
                    onClick: () => history.push(`/planes/${record.id}`),
                  };
                }}
                pagination={{
                  showSizeChanger: true,
                  showTotal: (total, range) =>
                    t("paginationItems", {
                      first: range[0],
                      last: range[1],
                      total: total,
                      item: t("admin:plans"),
                    }),
                }}
                rowClassName={(row) =>
                  !row.active ? styles.inactive : styles.row
                }
                rowKey={(row) => row.id}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <FeaturesInfo features={connectionToNodes(data?.features)} />
      </Col>
    </Row>
  );
};

export default Plans;
