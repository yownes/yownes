import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  message,
  Popconfirm,
  Row,
  Switch,
  Table,
  Typography,
} from "antd";
import { useMutation } from "@apollo/client";
import type { TFunction } from "i18next";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

import { CREATE_PRICE, UPDATE_PRICE } from "../../api/mutations";
import type {
  CreatePrice,
  CreatePriceVariables,
} from "../../api/types/CreatePrice";
import { PlanInterval } from "../../api/types/globalTypes";
import type {
  Plan_product,
  Plan_product_prices_edges_node,
} from "../../api/types/Plan";
import type {
  UpdatePrice,
  UpdatePriceVariables,
} from "../../api/types/UpdatePrice";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import { LoadingFullScreen, SelectField, TextField } from "../atoms";
import type { Option } from "../atoms/SelectField";

import styles from "./PricesInfo.module.css";

import { VerifiedState } from ".";

const { Text, Title } = Typography;

interface PricesInfoProps {
  product: Plan_product | null | undefined;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  dataSource: Plan_product_prices_edges_node[] | undefined;
  title: string;
  inputType: "number" | "select" | "text";
  record: Plan_product_prices_edges_node;
  index: number;
  children: React.ReactNode;
}

function handleClassName(row: Plan_product_prices_edges_node) {
  if (row.id === "1") {
    return styles.editingRow;
  } else {
    if (!row.active) {
      return styles.inactive;
    } else {
      return "editable-row";
    }
  }
}

function handleInputType(dataIndex: string | string[]) {
  if (dataIndex === "unitAmount") {
    return "number";
  } else {
    if (
      isEqual(dataIndex, ["recurring", "interval"]) ||
      dataIndex === "currency"
    ) {
      return "select";
    } else {
      if (dataIndex === "active") {
        return "switch";
      } else {
        return "text";
      }
    }
  }
}

function handleInterval(
  interval: "day" | "week" | "month" | "year",
  t: TFunction
) {
  switch (interval.toUpperCase()) {
    case PlanInterval.DAY:
      return t("daily");
    case PlanInterval.WEEK:
      return t("weekly");
    case PlanInterval.MONTH:
      return t("monthly");
    case PlanInterval.YEAR:
      return t("annual");
    default:
      return "-";
  }
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  dataSource,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const { t } = useTranslation(["translation", "admin"]);
  const intervals: Option[] = [];
  Object.keys(PlanInterval).map((i) =>
    intervals.push({
      id: i.toLocaleUpperCase(),
      name: t(`admin:intervals.${i}`),
      disabled:
        record &&
        dataSource?.find(
          (r) =>
            r.recurring.interval.toLowerCase() === i.toLowerCase() &&
            r.id !== record.id &&
            r.active
        ) !== undefined,
    })
  );
  let inputNode;
  switch (inputType) {
    case "number":
      inputNode = (
        <TextField
          autofocus={dataIndex === "unitAmount"}
          label={title}
          name={dataIndex}
          rules={[{ required: true }]}
          type="number"
          wrapperClassName={styles.input}
        />
      );
      break;
    case "text":
      inputNode = (
        <TextField
          autofocus={dataIndex === "unitAmount"}
          label={title}
          name={dataIndex}
          rules={[{ required: true }]}
          type="text"
          wrapperClassName={styles.input}
        />
      );
      break;
    default:
      undefined;
  }
  if (editing) {
    if (inputNode) {
      return inputNode;
    } else {
      if (dataIndex === "currency") {
        return (
          <SelectField
            label={t("admin:currency")}
            defaultEmpty
            name="currency"
            options={[
              { id: "eur", name: t("admin:euro") },
              { id: "usd", name: t("admin:usd") },
            ]}
            rules={[{ required: true }]}
            wrapperClassName={styles.input}
          />
        );
      }
      if (isEqual(dataIndex, ["recurring", "interval"])) {
        return (
          <SelectField
            defaultEmpty
            label={t("admin:interval")}
            name="interval"
            options={intervals}
            rules={[{ required: true }]}
            wrapperClassName={styles.input}
          />
        );
      }
      if (dataIndex === "active") {
        return (
          <Form.Item
            className={styles.switch}
            name="active"
            valuePropName="checked"
          >
            <Switch defaultChecked={false} />
          </Form.Item>
        );
      }
    }
  } else {
    return <td {...restProps}>{children}</td>;
  }
};

const PricesInfo = ({ product }: PricesInfoProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [formPrices] = Form.useForm();
  const [editingId, setEditingId] = useState("");
  const [archivingId, setArchivingId] = useState("");
  const [archiveState, setArchiveState] = useState(false);
  const [dataSource, setDataSource] =
    useState<Plan_product_prices_edges_node[]>();
  const [prices, setPrices] = useState<Plan_product_prices_edges_node[]>();
  const isEditing = (record: Plan_product_prices_edges_node) =>
    record.id === editingId;
  const [createPrice, { loading: creating }] = useMutation<
    CreatePrice,
    CreatePriceVariables
  >(CREATE_PRICE);
  const [updatePrice, { loading: archiving }] = useMutation<
    UpdatePrice,
    UpdatePriceVariables
  >(UPDATE_PRICE);

  useEffect(() => {
    setDataSource(prices);
  }, [prices]);

  useEffect(() => {
    setPrices(
      connectionToNodes(product?.prices).map((price) => ({
        ...price,
        recurring: JSON.parse(normalize(price.recurring ?? "")),
      }))
    );
  }, [product]);

  const add = () => {
    const newData: Plan_product_prices_edges_node = {
      __typename: "StripePriceType",
      id: "1",
      stripeId: "",
      currency: "",
      recurring: { interval: "" },
      unitAmount: null,
      active: true,
    };
    if (dataSource) {
      setDataSource([...dataSource, newData]);
      setEditingId(newData.id);
    }
    formPrices.resetFields();
  };

  const arch = (record: Plan_product_prices_edges_node, active: boolean) => {
    setArchivingId("");
    setEditingId("");
    updatePrice({
      variables: {
        id: record.id,
        active: active,
      },
      update(cache, { data }) {
        if (data?.updatePrice?.ok) {
          cache.modify({
            id: cache.identify({ ...record }),
            fields: {
              active() {
                return active;
              },
            },
          });
          message.success(
            active
              ? t("admin:unarchivePriceSuccessful")
              : t("admin:archivePriceSuccessful"),
            4
          );
        } else {
          message.error(t(`admin:errors.${data?.updatePrice?.error}`), 4);
        }
      },
    });
  };

  const cancel = () => {
    setEditingId("");
    setArchivingId("");
  };

  const create = () => {
    createPrice({
      variables: {
        id: product?.id ?? "",
        price: {
          active: formPrices.getFieldValue("active") || false,
          amount: formPrices.getFieldValue("unitAmount") * 100,
          currency: formPrices.getFieldValue("currency"),
          interval: formPrices.getFieldValue("interval"),
        },
      },
      update(cache, { data }) {
        if (data?.createPrice?.ok) {
          cache.modify({
            id: cache.identify({ ...product }),
            fields: {
              prices(existing, { toReference }) {
                return {
                  edges: [
                    ...existing.edges,
                    {
                      __typename: "StripePriceType",
                      node: toReference({
                        ...data.createPrice?.price,
                      }),
                    },
                  ],
                };
              },
            },
          });
          setEditingId("");
          message.success(t("admin:createPriceSuccessful"), 4);
        } else {
          message.error(
            t(`admin:errors.${data?.createPrice?.error}`, t("error")),
            4
          );
        }
      },
    });
  };

  const discard = () => {
    setEditingId("");
    setArchivingId("");
    if (dataSource) {
      const data = dataSource && [...dataSource];
      data.splice(data.map((item) => item.id).indexOf("1"), 1);
      setDataSource(data);
    }
  };

  const columns = [
    {
      title: t("admin:unitAmount"),
      dataIndex: "unitAmount",
      key: "amount",
      width: "25%",
      editable: true,
      render: (amount: number) => amount / 100,
    },
    {
      title: t("admin:currency"),
      dataIndex: "currency",
      key: "currency",
      width: "20%",
      editable: true,
      render: (currency: string) => currency,
    },
    {
      title: t("admin:interval"),
      dataIndex: ["recurring", "interval"],
      key: "interval",
      width: "25%",
      editable: true,
      render: (i: "day" | "week" | "month" | "year") => handleInterval(i, t),
    },
    {
      title: t("isActive"),
      dataIndex: "active",
      key: "isActive",
      width: "10%",
      editable: true,
      render: (isActive: boolean) => <VerifiedState verified={isActive} />,
    },
    {
      title: t("admin:action"),
      dataIndex: "action",
      key: "action",
      render: (_: string, record: Plan_product_prices_edges_node) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {record.id === "1" && (
              <Popconfirm
                cancelButtonProps={{ className: "button-default-default" }}
                onConfirm={() => formPrices.submit()}
                title={t("admin:warningCreatePrice")}
              >
                <Button
                  className="link-button"
                  style={{ padding: 0, marginRight: 16 }}
                  type="link"
                >
                  {t("admin:createPrice")}
                </Button>
              </Popconfirm>
            )}
            <Button
              className="link-button"
              style={{ padding: 0 }}
              danger
              type="link"
              onClick={discard}
            >
              {t("cancel")}
            </Button>
          </span>
        ) : (
          <Popconfirm
            cancelButtonProps={{ className: "button-default-default" }}
            onCancel={() => cancel()}
            onConfirm={() => {
              setArchiveState(record.active);
              record.active ? arch(record, false) : arch(record, true);
            }}
            title={
              record.active
                ? t("admin:warningArchivePrice")
                : t("admin:warningUnarchivePrice")
            }
            visible={archivingId !== "" && archivingId === record.id}
          >
            <Button
              className="link-button"
              style={{ padding: 0 }}
              danger={record.active}
              type="link"
              disabled={
                ((editingId !== "" || archivingId !== "") &&
                  archivingId !== record.id) ||
                (!record.active &&
                  dataSource?.find(
                    (r) =>
                      r.recurring.interval.toUpperCase() ===
                        record.recurring.interval.toUpperCase() &&
                      r.id !== record.id &&
                      r.active
                  ) !== undefined)
              }
              onClick={() => !archivingId && setArchivingId(record.id!)}
            >
              {record.active ? t("admin:archive") : t("admin:unarchive")}
            </Button>
          </Popconfirm>
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
      onCell: (record: Plan_product_prices_edges_node) => ({
        record,
        inputType: handleInputType(col.dataIndex),
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <Card>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title className={styles.title} level={2}>
            {t("admin:pricesInfo")}
            <div
              style={{
                position: "relative",
                float: "right",
              }}
            >
              <Button
                className="button-default-primary"
                disabled={editingId !== "" || archivingId !== ""}
                onClick={() => add()}
              >
                {t("admin:newPrice")}
              </Button>
            </div>
          </Title>
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          {connectionToNodes(product?.prices).find(
            (p) => p.active
          ) ? undefined : (
            <div className={styles.alert}>
              <Alert
                message={t("admin:warnings.notActivePrices")}
                showIcon
                type="warning"
              />
            </div>
          )}
          <Text className={styles.warning} type="secondary">
            {t("admin:warnings.prices")}
          </Text>
          <Form
            form={formPrices}
            component={false}
            onFinish={() => create()}
            validateMessages={{ required: t("client:requiredInput") }}
          >
            <Table
              columns={mergedColumns}
              components={{
                body: {
                  cell: (p: EditableCellProps) =>
                    EditableCell({ ...p, dataSource }),
                },
              }}
              dataSource={dataSource}
              locale={{ emptyText: t("admin:noPrices") }}
              rowClassName={(row) => handleClassName(row)}
              rowKey={(row) => row.id}
              pagination={false}
            />
          </Form>
          {archiving && (
            <LoadingFullScreen
              tip={
                archiveState
                  ? t("admin:archivingPrice")
                  : t("admin:unarchivingPrice")
              }
            />
          )}
          {creating && <LoadingFullScreen tip={t("admin:creatingPrice")} />}
        </Col>
      </Row>
    </Card>
  );
};

export default PricesInfo;
