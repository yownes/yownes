import React from "react";
import { Table, Typography, TableColumnsType } from "antd";
import forIn from "lodash/forIn";
import { useTranslation } from "react-i18next";

import { Builds_builds_edges_node } from "../../api/types/Builds";
import { Client_user } from "../../api/types/Client";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import { BuildState } from "./";
import { BuildState as BuildStateVisualizer } from "../../components/molecules";

import styles from "./BuildsTable.module.css";

const { Text } = Typography;

interface BuildsTableProps {
  dataSource: Builds_builds_edges_node[];
}

function getBuildStatusFilters() {
  let filters: Filter[] = [];
  forIn(BuildBuildStatus, (value) => {
    filters.push({
      text: <BuildStateVisualizer state={value}></BuildStateVisualizer>,
      value: value,
    });
  });
  return filters;
}

export function getBuildsForCustomer(
  user?: Client_user | null
): Builds_builds_edges_node[] {
  if (!user) {
    return [];
  }
  const nodes = connectionToNodes(user.apps);
  let all: Builds_builds_edges_node[] = [];
  nodes.forEach((app) => {
    const buildNodes =
      connectionToNodes(app.builds).map((build) => ({
        ...build,
        app: {
          ...app,
          customer: user ?? null,
        },
      })) ?? [];
    all.push(...buildNodes);
  });
  return all;
}

const BuildsTable = ({ dataSource }: BuildsTableProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const columns: TableColumnsType<Builds_builds_edges_node> = [
    {
      title: t("date"),
      dataIndex: "date",
      key: "data",
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a, b) => a.date - b.date,
    },
    {
      title: t("buildId"),
      dataIndex: "buildId",
      key: "buildId",
      render: (buildId) => <Text strong>{buildId}</Text>,
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["buildId"],
        t("admin:search", { data: t("buildId") }),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.buildId.localeCompare(b.buildId),
    },
    {
      title: "App",
      dataIndex: ["app", "name"],
      key: "app.name",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "name"],
        t("admin:search", { data: t("app") }),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.app!!.name.localeCompare(b.app!!.name),
    },
    {
      title: t("state"),
      dataIndex: "buildStatus",
      key: "state",
      render: (state: BuildBuildStatus) => {
        return <BuildState state={state}></BuildState>;
      },
      ...getColumnFilterProps<Builds_builds_edges_node>(
        ["buildStatus"],
        getBuildStatusFilters()
      ),
      sorter: (a, b) => a.buildStatus.localeCompare(b.buildStatus),
    },
  ];
  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      locale={{ emptyText: t("noBuilds") }}
      pagination={{
        showSizeChanger: true,
        showTotal: (total, range) =>
          t("paginationItems", {
            first: range[0],
            last: range[1],
            total: total,
          }),
      }}
      rowClassName={(row) => (!row.app?.isActive ? styles.app_deleted : "")}
      rowKey={(row) => row.buildId}
    />
  );
};

export default BuildsTable;
