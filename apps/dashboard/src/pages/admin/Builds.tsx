import React, { useState } from "react";
import {
  Button,
  Form,
  InputNumber,
  message,
  Modal,
  Table,
  Tooltip,
  Typography,
} from "antd";
import { ColumnsType } from "antd/lib/table";
import { useMutation, useQuery } from "@apollo/client";
import forIn from "lodash/forIn";
import { useTranslation } from "react-i18next";

import { UPDATE_BUILDS_LIMIT } from "../../api/mutations";
import { BUILDS, LIMIT } from "../../api/queries";
import {
  Builds as IBuilds,
  BuildsVariables,
  Builds_builds_edges_node,
} from "../../api/types/Builds";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import { LimitBuilds } from "../../api/types/LimitBuilds";
import {
  UpdateBuildsLimit,
  UpdateBuildsLimitVariables,
} from "../../api/types/UpdateBuildsLimit";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Filter,
  getColumnFilterProps,
  getColumnSearchProps,
} from "../../lib/filterColumns";

import { Loading } from "../../components/atoms";
import { BuildState as BuildStateVisualizer } from "../../components/molecules";

import styles from "./Builds.module.css";

const { Text } = Typography;

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
  const { data, loading } = useQuery<IBuilds, BuildsVariables>(BUILDS);
  const { data: limitData, loading: loadingLimit } = useQuery<LimitBuilds>(
    LIMIT
  );
  const { t } = useTranslation(["translation", "admin"]);
  const [formBuilds] = Form.useForm();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [updateBuildsLimit, { loading: updating }] = useMutation<
    UpdateBuildsLimit,
    UpdateBuildsLimitVariables
  >(UPDATE_BUILDS_LIMIT);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    formBuilds.submit();
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const save = () => {
    updateBuildsLimit({
      variables: {
        limit: formBuilds.getFieldValue("allowed"),
      },
      update(cache, { data }) {
        if (data?.updateBuildsLimit?.ok) {
          cache.modify({
            id: cache.identify({ ...limitData?.configs?.edges[0]?.node }),
            fields: {
              limit() {
                return formBuilds.getFieldValue("allowed");
              },
            },
          });
          message.success(t("admin:updateBuildsLimitSuccessful"), 4);
        } else {
          message.error(
            t(`admin:errors.${data?.updateBuildsLimit?.error}`, t("error")),
            4
          );
        }
        setIsModalVisible(false);
      },
    });
  };

  if (loading || loadingLimit) return <Loading />;

  const columns: ColumnsType<Builds_builds_edges_node> = [
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
        t("admin:search", { data: t("admin:buildId") }),
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
        t("admin:search", { data: t("admin:client") }),
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
        t("admin:search", { data: t("admin:clientId") }),
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
        t("admin:search", { data: t("admin:app") }),
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
    <div>
      <div style={{ marginBottom: 15, position: "relative", float: "right" }}>
        <Tooltip title={t("update")}>
          <Button type="default" onClick={showModal}>
            {t("admin:yearBuildsLimit", {
              limit: limitData?.configs?.edges[0]?.node?.limit,
            })}
          </Button>
        </Tooltip>
      </div>
      <Modal
        title={t("admin:buildsLimit")}
        visible={isModalVisible}
        okButtonProps={{ loading: updating }}
        okText={t("update")}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <>
          <Form
            form={formBuilds}
            component={false}
            initialValues={{
              allowed: limitData?.configs?.edges[0]?.node?.limit,
            }}
            onFinish={() => save()}
          >
            <Form.Item
              name="allowed"
              style={{ margin: 0 }}
              rules={[
                {
                  required: true,
                  message: t("admin:requiredInput"),
                },
              ]}
            >
              <InputNumber />
            </Form.Item>
          </Form>
          <Text style={{ display: "block", marginTop: 20 }} type="secondary">
            {t("admin:warningBuildsLimit")}
          </Text>
        </>
      </Modal>
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
            }),
        }}
        rowClassName={(row) => (!row.app?.isActive ? styles.app_deleted : "")}
        rowKey={(row) => row.id}
      />
    </div>
  );
};

export default Builds;
