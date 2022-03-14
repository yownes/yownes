import React from "react";
import { Button, Table, TableColumnsType } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
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

import { Loading } from "../../components/atoms";
import { FeaturesInfo, VerifiedState } from "../../components/molecules";

import styles from "./Plans.module.css";

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
      render: (name, record) => <Link to={`/planes/${record.id}`}>{name}</Link>,
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
      render: (id) => <Link to={`/planes/${id}`}>{id}</Link>,
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
      title: t("admin:description"),
      dataIndex: ["description"],
      key: "description",
      render: (description) => description,
      ...getColumnSearchProps<Plans_products_edges_node>(
        ["description"],
        t("admin:search", { data: t("admin:description") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) =>
        a.description && b.description
          ? a.description.localeCompare(b.description)
          : 1,
    },
    {
      title: t("admin:nApps"),
      dataIndex: ["metadata"],
      key: "apps",
      render: (metadata) => JSON.parse(metadata).allowed_apps,
      sorter: (a, b) =>
        parseInt(
          JSON.parse(a.metadata).allowed_apps
            ? JSON.parse(a.metadata).allowed_apps
            : 0
        ) -
        parseInt(
          JSON.parse(b.metadata).allowed_apps
            ? JSON.parse(b.metadata).allowed_apps
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
    <div>
      <div>
        <Link to="/planes/new">
          <Button className={styles.new} type="primary">
            {t("admin:newPlan")}
          </Button>
        </Link>
        <Table
          className={styles.table}
          columns={columns}
          dataSource={dataSource}
          locale={{ emptyText: t("admin:noPlans") }}
          onRow={(record) => {
            return { onClick: () => history.push(`/planes/${record.id}`) };
          }}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) =>
              t("paginationItems", {
                first: range[0],
                last: range[1],
                total: total,
              }),
          }}
          rowClassName={(row) => (!row.active ? styles.inactive : styles.row)}
          rowKey={(row) => row.id}
        />
      </div>
      <FeaturesInfo features={connectionToNodes(data?.features)} />
    </div>
  );
};

export default Plans;
