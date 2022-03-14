import React from "react";
import { Button, Table, TableColumnsType } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

import { TEMPLATES } from "../../api/queries";
import {
  Templates as ITemplates,
  Templates_templates_edges_node,
} from "../../api/types/Templates";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import { Loading } from "../../components/atoms";
import { VerifiedState } from "../../components/molecules";

import styles from "./Templates.module.css";

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

const Templates = () => {
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const { data, loading } = useQuery<ITemplates>(TEMPLATES);
  const dataSource = connectionToNodes(data?.templates);

  if (loading) return <Loading />;

  const columns: TableColumnsType<Templates_templates_edges_node> = [
    {
      title: t("name"),
      dataIndex: "name",
      key: "name",
      render: (name, record) => (
        <Link to={`/templates/${record.id}`}>{name}</Link>
      ),
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["name"],
        t("admin:search", { data: t("name") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: t("admin:templateId"),
      dataIndex: "id",
      key: "id",
      render: (id) => <Link to={`/templates/${id}`}>{id}</Link>,
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["id"],
        t("admin:search", { data: t("admin:templateId") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => a.id.localeCompare(b.id),
    },
    {
      title: t("admin:templateUrl"),
      dataIndex: ["url"],
      key: "url",
      render: (url) => url,
      ellipsis: true,
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["url"],
        t("admin:search", { data: t("admin:templateUrl") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) => (a.url && b.url ? a.url.localeCompare(b.url) : 1),
    },
    {
      title: t("admin:snack"),
      dataIndex: ["snack"],
      key: "snack",
      render: (snack) => snack,
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["snack"],
        t("admin:search", { data: t("admin:snack") }),
        t("search"),
        t("reset"),
        false
      ),
      sorter: (a, b) =>
        a.snack && b.snack ? a.snack.localeCompare(b.snack) : 1,
    },
    {
      title: t("isActive"),
      dataIndex: "isActive",
      defaultFilteredValue: ["true"],
      key: "isActive",
      render: (isActive: boolean) => <VerifiedState verified={isActive} />,
      ...getColumnFilterProps<Templates_templates_edges_node>(
        ["isActive"],
        getVerifiedStatusFilters()
      ),
      sorter: (a, b) => Number(a.isActive) - Number(b.isActive),
    },
  ];
  return (
    <div>
      <Link to="/templates/new">
        <Button style={{ marginBottom: 15 }} type="primary">
          {t("admin:newTemplate")}
        </Button>
      </Link>
      <Table
        className={styles.table}
        columns={columns}
        dataSource={dataSource}
        locale={{ emptyText: t("admin:noTemplates") }}
        onRow={(record) => {
          return { onClick: () => history.push(`/templates/${record.id}`) };
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
        rowClassName={(row) => (!row.isActive ? styles.inactive : styles.row)}
        rowKey={(row) => row.id}
      />
    </div>
  );
};

export default Templates;
