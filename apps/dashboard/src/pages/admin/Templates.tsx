import React from "react";
import {
  Button,
  Card,
  Col,
  Row,
  Table,
  TableColumnsType,
  Typography,
} from "antd";
import { FileImageOutlined } from "@ant-design/icons";
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

const { Title } = Typography;

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
      title: t("admin:templatePreview"),
      dataIndex: "previewImg",
      key: "preview",
      render: (logo) =>
        logo ? (
          <img
            src={logo}
            alt={t("admin:templatePreview")}
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
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["name"],
        t("admin:search"),
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
      render: (id) => id,
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["id"],
        t("admin:search"),
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
      // ellipsis: true, // hace que las otras Cols tengan el mismo tamaño
      ...getColumnSearchProps<Templates_templates_edges_node>(
        ["url"],
        t("admin:search"),
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
        t("admin:search"),
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
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:templates")}
                <div
                  style={{
                    position: "relative",
                    float: "right",
                  }}
                >
                  <Link to="/templates/new">
                    <Button className="button-default-primary">
                      {t("admin:newTemplate")}
                    </Button>
                  </Link>
                </div>
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
                  locale={{ emptyText: t("admin:noTemplates") }}
                  onRow={(record) => {
                    return {
                      onClick: () => history.push(`/templates/${record.id}`),
                    };
                  }}
                  pagination={{
                    showSizeChanger: true,
                    showTotal: (total, range) =>
                      t("paginationItems", {
                        first: range[0],
                        last: range[1],
                        total: total,
                        item: t("admin:templates"),
                      }),
                  }}
                  rowClassName={(row) =>
                    !row.isActive ? styles.inactive : styles.row
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

export default Templates;
