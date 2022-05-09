import React from "react";
import { Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import forIn from "lodash/forIn";
import { useTranslation } from "react-i18next";

import type { Builds_builds_edges_node } from "../../api/types/Builds";
import type { Client_user } from "../../api/types/Client";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import type { Filter } from "../../lib/filterColumns";
import {
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import styles from "./BuildsTable.module.css";

import { BuildState as BuildStateVisualizer, BuildState } from ".";

const { Paragraph, Text } = Typography;

interface BuildsTableProps {
  dataSource: Builds_builds_edges_node[];
}

function getBuildStatusFilters() {
  const filters: Filter[] = [];
  forIn(BuildBuildStatus, (value) => {
    filters.push({
      text: <BuildStateVisualizer state={value} />,
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
  const all: Builds_builds_edges_node[] = [];
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
      render: (buildId) => <Paragraph copyable>{buildId}</Paragraph>,
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["buildId"],
        t("admin:search"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.buildId.localeCompare(b.buildId),
    },
    {
      title: "App",
      dataIndex: ["app", "name"],
      key: "app.name",
      render: (name) => name,
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "name"],
        t("admin:search"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.app!.name.localeCompare(b.app!.name),
    },
    {
      title: t("state"),
      dataIndex: "buildStatus",
      key: "state",
      render: (state: BuildBuildStatus) => {
        return <BuildState state={state} />;
      },
      ...getColumnFilterProps<Builds_builds_edges_node>(
        ["buildStatus"],
        getBuildStatusFilters()
      ),
      sorter: (a, b) => a.buildStatus.localeCompare(b.buildStatus),
    },
  ];
  return dataSource.length > 0 ? (
    <div className={styles.overflow}>
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
              item: t("admin:builds"),
            }),
        }}
        rowClassName={(row) => (!row.app?.isActive ? styles.app_deleted : "")}
        rowKey={(row) => row.buildId}
      />
    </div>
  ) : (
    <Text className={styles.empty} type="secondary">
      {t("noBuilds")}
    </Text>
  );
};

export default BuildsTable;
