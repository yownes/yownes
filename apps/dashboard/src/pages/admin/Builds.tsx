import React from "react";
import { Card, Col, Row, Table, Typography, TableColumnsType } from "antd";
import { useQuery } from "@apollo/client";
import forIn from "lodash/forIn";
import { useTranslation } from "react-i18next";

import { BUILDS } from "../../api/queries";
import {
  Builds as IBuilds,
  BuildsVariables,
  Builds_builds_edges_node,
} from "../../api/types/Builds";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import { Loading } from "../../components/atoms";
import { BuildState as BuildStateVisualizer } from "../../components/molecules";

import styles from "./Builds.module.css";

const { Title } = Typography;

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

const Builds = () => {
  const { t } = useTranslation(["translation", "admin"]);
  const { data, loading } = useQuery<IBuilds, BuildsVariables>(BUILDS);

  if (loading) return <Loading />;

  const columns: TableColumnsType<Builds_builds_edges_node> = [
    {
      title: t("admin:date"),
      dataIndex: "date",
      key: "data",
      render: (date: Date) => date.toLocaleDateString(),
      sorter: (a, b) => a.date - b.date,
    },
    {
      title: t("admin:buildId"),
      dataIndex: "buildId",
      key: "buildId",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["buildId"],
        t("admin:search"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.buildId.localeCompare(b.buildId),
    },
    {
      title: t("admin:client"),
      dataIndex: ["app", "customer", "username"],
      key: "client",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "customer", "username"],
        t("admin:search"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) =>
        a.app!.customer!.username.localeCompare(b.app!.customer!.username),
    },
    {
      title: t("admin:clientId"),
      dataIndex: ["app", "customer", "id"],
      key: "clientId",
      ...getColumnSearchProps<Builds_builds_edges_node>(
        ["app", "customer", "id"],
        t("admin:search"),
        t("search"),
        t("reset")
      ),
      sorter: (a, b) => a.app!.customer!.id.localeCompare(b.app!.customer!.id),
    },
    {
      title: t("app"),
      dataIndex: ["app", "name"],
      key: "app",
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
        return <BuildStateVisualizer state={state}></BuildStateVisualizer>;
      },
      ...getColumnFilterProps<Builds_builds_edges_node>(
        ["buildStatus"],
        getBuildStatusFilters()
      ),
      sorter: (a, b) => a.buildStatus.localeCompare(b.buildStatus),
    },
  ];

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:buildList")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <div className={styles.overflow}>
                <Table
                  className={styles.table}
                  columns={columns}
                  dataSource={connectionToNodes(data?.builds)}
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
                  rowClassName={(row) =>
                    !row.app?.isActive ? styles.app_deleted : ""
                  }
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

export default Builds;
