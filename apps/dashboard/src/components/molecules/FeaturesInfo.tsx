import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  message,
  Popconfirm,
  Table,
  Typography,
} from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import {
  CREATE_FEATURE,
  DELETE_FEATURE,
  UPDATE_FEATURE,
} from "../../api/mutations";
import {
  CreateFeature,
  CreateFeatureVariables,
} from "../../api/types/CreateFeature";
import {
  DeleteFeature,
  DeleteFeatureVariables,
} from "../../api/types/DeleteFeature";
import { Plan_product_features_edges_node } from "../../api/types/Plan";
import {
  UpdateFeature,
  UpdateFeatureVariables,
} from "../../api/types/UpdateFeature";

import { LoadingFullScreen } from "../atoms";

const { Title } = Typography;

interface FeaturesInfoProps {
  features: Plan_product_features_edges_node[] | undefined;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: "text";
  record: Plan_product_features_edges_node;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { t } = useTranslation(["translation", "admin"]);
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              message: t("admin:requiredInput"),
            },
          ]}
        >
          <Input />
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

const FeaturesInfo = ({ features }: FeaturesInfoProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [formFeatures] = Form.useForm();
  const [editingId, setEditingId] = useState("");
  const [deletingId, setDeletingId] = useState("");
  const [dataSource, setDataSource] = useState<
    Plan_product_features_edges_node[]
  >();
  const isEditing = (record: Plan_product_features_edges_node) =>
    record.id === editingId;
  const [createFeature, { loading: creating }] = useMutation<
    CreateFeature,
    CreateFeatureVariables
  >(CREATE_FEATURE);
  const [deleteFeature, { loading: deleting }] = useMutation<
    DeleteFeature,
    DeleteFeatureVariables
  >(DELETE_FEATURE);
  const [updateFeature, { loading: updating }] = useMutation<
    UpdateFeature,
    UpdateFeatureVariables
  >(UPDATE_FEATURE);

  useEffect(() => {
    setDataSource(features);
  }, [features]);

  const add = () => {
    const newData: Plan_product_features_edges_node = {
      __typename: "FeaturesType",
      id: "1",
      name: "",
    };
    if (dataSource) {
      setDataSource([...dataSource, newData]);
      edit(newData);
    }
  };

  const cancel = () => {
    setEditingId("");
    setDeletingId("");
  };

  const create = () => {
    createFeature({
      variables: {
        feature: {
          name: formFeatures.getFieldValue("name"),
        },
      },
      update(cache, { data }) {
        if (data?.createFeature?.ok) {
          cache.modify({
            fields: {
              features(existing, { toReference }) {
                return {
                  edges: [
                    ...existing.edges,
                    {
                      __typename: "FeaturesType",
                      node: toReference({
                        ...data.createFeature?.feature,
                      }),
                    },
                  ],
                };
              },
            },
          });
          setEditingId("");
          message.success(t("admin:createFeatureSuccessful"), 4);
        } else {
          message.error(
            t(`admin:errors.${data?.createFeature?.error}`, t("error")),
            4
          );
        }
      },
    });
  };

  const del = (record: Plan_product_features_edges_node) => {
    deleteFeature({
      variables: {
        id: record.id,
      },
      update(cache, { data }) {
        if (data?.deleteFeature?.ok) {
          cache.evict({
            id: cache.identify({
              ...record,
            }),
          });
          cache.gc();
          setDeletingId("");
          message.success(t("admin:deleteFeatureSuccessful"), 4);
        } else {
          message.error(
            t(`admin:errors.${data?.deleteFeature?.error}`, t("error")),
            4
          );
        }
      },
    });
  };

  const discard = () => {
    setEditingId("");
    setDeletingId("");
    if (dataSource) {
      let data = dataSource && [...dataSource];
      data.splice(data.map((item) => item.id).indexOf("1"), 1);
      setDataSource(data);
    }
  };

  const edit = (record: Partial<Plan_product_features_edges_node>) => {
    formFeatures.setFieldsValue({
      name: "",
      ...record,
    });
    setEditingId(record.id!);
  };

  const save = (record: Plan_product_features_edges_node) => {
    updateFeature({
      variables: {
        id: record.id,
        feature: {
          name: formFeatures.getFieldValue("name"),
        },
      },
      update(cache, { data }) {
        if (data?.updateFeature?.ok) {
          cache.modify({
            id: cache.identify({ ...record }),
            fields: {
              name() {
                return formFeatures.getFieldValue("name");
              },
            },
          });
          setEditingId("");
          message.success(t("admin:updateFeatureSuccessful"), 4);
        } else {
          message.error(
            t(`admin:errors.${data?.updateFeature?.error}`, t("error")),
            4
          );
        }
      },
    });
  };

  const columns = [
    {
      title: t("admin:feature"),
      dataIndex: "name",
      key: "name",
      width: "70%",
      editable: true,
      render: (name: string) => name,
    },
    {
      title: t("admin:action"),
      dataIndex: "action",
      key: "action",
      render: (_: any, record: Plan_product_features_edges_node) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {record.id === "1" ? (
              <>
                <Popconfirm
                  title={t("admin:warningCreateFeature")}
                  onConfirm={() => formFeatures.submit()}
                >
                  <Button type="link">{t("add")}</Button>
                </Popconfirm>
                <Button type="link" onClick={discard}>
                  {t("cancel")}
                </Button>
              </>
            ) : (
              <>
                <Popconfirm
                  title={t("admin:warningSaveChanges")}
                  onConfirm={() => save(record)}
                >
                  <Button type="link">{t("save")}</Button>
                </Popconfirm>
                <Button type="link" onClick={cancel}>
                  {t("cancel")}
                </Button>
              </>
            )}
          </span>
        ) : (
          <span>
            <Button
              type="link"
              disabled={editingId !== "" || deletingId !== ""}
              onClick={() => edit(record)}
            >
              {t("edit")}
            </Button>
            <Popconfirm
              title={t("admin:warningDeleteFeature")}
              onConfirm={() => del(record)}
              onCancel={() => cancel()}
              visible={deletingId !== "" && deletingId === record.id}
            >
              <Button
                danger
                type="link"
                disabled={
                  (editingId !== "" || deletingId !== "") &&
                  deletingId !== record.id
                }
                onClick={() => !deletingId && setDeletingId(record.id!)}
              >
                {t("delete")}
              </Button>
            </Popconfirm>
          </span>
        );
      },
    },
  ];

  const mergedColumns = columns.map((col) => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: Plan_product_features_edges_node) => ({
        record,
        inputType: "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <div style={{ marginBottom: 20, marginTop: 0, minWidth: 750 }}>
      <Title level={3}>{t("admin:features")}</Title>
      <Button
        disabled={editingId !== "" || deletingId !== ""}
        onClick={() => add()}
        style={{ marginBottom: 15 }}
        type="primary"
      >
        {t("admin:newFeature")}
      </Button>
      <Form form={formFeatures} component={false} onFinish={() => create()}>
        <Table
          columns={mergedColumns}
          components={{
            body: {
              cell: EditableCell,
            },
          }}
          dataSource={dataSource}
          locale={{ emptyText: t("admin:noFeatures") }}
          rowClassName="editable-row"
          rowKey={(row) => row.id}
          pagination={{
            showSizeChanger: true,
            showTotal: (total, range) =>
              t("paginationItems", {
                first: range[0],
                last: range[1],
                total: total,
              }),
          }}
        />
      </Form>
      {creating && <LoadingFullScreen tip={t("admin:creatingFeature")} />}
      {deleting && <LoadingFullScreen tip={t("admin:deletingFeature")} />}
      {updating && <LoadingFullScreen tip={t("admin:updatingFeature")} />}
    </div>
  );
};

export default FeaturesInfo;