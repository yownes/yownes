import React, { useMemo } from "react";
import { Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import forIn from "lodash/forIn";
import { useTranslation } from "react-i18next";

import type { AppBasicData } from "../../api/types/AppBasicData";
import type {
  Client_user_apps,
  Client_user_apps_edges_node,
} from "../../api/types/Client";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";
import type { Filter } from "../../lib/filterColumns";
import {
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import styles from "./AppsTable.module.css";

import { BuildState as BuildStateVisualizer, BuildState } from ".";

const { Text } = Typography;

interface AppsTableProps {
  dataSource?: Client_user_apps;
  columns?: TableColumnsType<AppBasicData>;
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

const AppsTable = ({ dataSource, columns }: AppsTableProps) => {
  const { t } = useTranslation("translation");
  const allCols = useMemo(() => {
    const cols: TableColumnsType<AppBasicData> = [
      {
        title: t("icon"),
        dataIndex: "logo",
        key: "icon",
        render: (logo) =>
          logo ? (
            <img
              src={logo}
              alt={t("logo")}
              width={40}
              height={40}
              style={{ objectFit: "contain" }}
            />
          ) : (
            <FileImageOutlined className={styles.icon} />
          ),
      },
      {
        title: t("name"),
        dataIndex: "name",
        key: "name",
        render: (name) => name,
        ...getColumnSearchProps<Client_user_apps_edges_node>(
          ["name"],
          t("admin:search"),
          t("search"),
          t("reset")
        ),
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: t("state"),
        dataIndex: "builds",
        key: "state",
        render: (_, record) => {
          return <BuildState state={getAppBuildState(record)} />;
        },
        ...getColumnFilterProps<Client_user_apps_edges_node>(
          ["builds", "edges", "_", "node", "buildStatus"],
          getBuildStatusFilters(),
          "last",
          BuildBuildStatus.STALLED
        ),
        sorter: (a, b) =>
          getAppBuildState(a).localeCompare(getAppBuildState(b)),
      },
    ];
    return columns ? [...cols, ...columns] : cols;
  }, [columns, t]);
  const data = connectionToNodes(dataSource);
  return data.length > 0 ? (
    <div className={styles.overflow}>
      <Table
        columns={allCols}
        dataSource={data}
        locale={{ emptyText: t("noApps") }}
        pagination={{
          showSizeChanger: true,
          showTotal: (total, range) =>
            t("paginationItems", {
              first: range[0],
              last: range[1],
              total: total,
              item: t("apps"),
            }),
        }}
        rowClassName={(row) => (!row.isActive ? styles.app_deleted : "")}
        rowKey={(row) => row.id}
      />
    </div>
  ) : (
    <Text className={styles.empty} type="secondary">
      {t("noApps")}
    </Text>
  );
};

export default AppsTable;
