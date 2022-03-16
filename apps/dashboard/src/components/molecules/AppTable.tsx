import React, { useMemo } from "react";
import { Table, TableColumnsType } from "antd";
import { FileImageOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { Apps_apps, Apps_apps_edges_node } from "../../api/types/Apps";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";

import { BuildState } from "./";

import styles from "./AppTable.module.css";

interface AppTableProps {
  dataSource?: Apps_apps | null;
  columns?: TableColumnsType<Apps_apps_edges_node>;
}

const AppTable = ({ dataSource, columns }: AppTableProps) => {
  const { t } = useTranslation("translation");
  const history = useHistory();
  const allCols = useMemo(() => {
    const cols: TableColumnsType<Apps_apps_edges_node> = [
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
      },
      {
        title: t("state"),
        dataIndex: "builds",
        key: "state",
        render: (_, record) => {
          return <BuildState state={getAppBuildState(record)}></BuildState>;
        },
      },
    ];
    return columns ? [...cols, ...columns] : cols;
  }, [columns, t]);
  const data = connectionToNodes(dataSource);
  return (
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
          }),
      }}
      onRow={(record) => {
        return {
          onClick: () => history.push(`/app/${record.id}`),
        };
      }}
      rowClassName={styles.row}
      rowKey={(row) => row.id}
    />
  );
};

export default AppTable;
