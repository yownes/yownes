import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Select,
  Switch,
  Table,
  Typography,
} from "antd";
import { useMutation } from "@apollo/client";
import isEqual from "lodash/isEqual";
import { useTranslation } from "react-i18next";

import { CREATE_PRICE, UPDATE_PRICE } from "../../api/mutations";
import { CreatePrice, CreatePriceVariables } from "../../api/types/CreatePrice";
import { PlanInterval } from "../../api/types/globalTypes";
import {
  Plan_product,
  Plan_product_prices_edges_node,
} from "../../api/types/Plan";
import { UpdatePrice, UpdatePriceVariables } from "../../api/types/UpdatePrice";
import connectionToNodes from "../../lib/connectionToNodes";

import { VerifiedState } from "./";
import { LoadingFullScreen } from "../atoms";

import styles from "./PricesInfo.module.css";

const { Option } = Select;
const { Paragraph, Title } = Typography;

interface PricesInfoProps {
  product: Plan_product | null | undefined;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  dataSource: Plan_product_prices_edges_node[] | undefined;
  title: any;
  inputType: "number" | "select" | "text";
  record: Plan_product_prices_edges_node;
  index: number;
  children: React.ReactNode;
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
  const inputNode =
    inputType === "number" ? (
      <InputNumber />
    ) : inputType === "text" ? (
      <Input />
    ) : null;
  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          className={styles.editing}
          name={dataIndex}
          rules={
            dataIndex !== "active"
              ? [
                  {
                    required: true,
                    message: t("admin:requiredInput"),
                  },
                ]
              : undefined
          }
          valuePropName={dataIndex === "active" ? "checked" : undefined}
        >
          {inputNode
            ? inputNode
            : (dataIndex === "currency" && (
                <Select className={styles.fullWidth}>
                  <Option key="eur" value="eur">
                    Euro
                  </Option>
                  <Option key="usd" value="usd">
                    USD
                  </Option>
                </Select>
              )) ||
              (isEqual(dataIndex, ["recurring", "interval"]) && (
                <Select className={styles.fullWidth}>
                  {Object.keys(PlanInterval).map((e) => (
                    <Option
                      disabled={
                        dataSource?.find(
                          (r) =>
                            r.recurring.interval.toLowerCase() ===
                              e.toLowerCase() &&
                            r.id !== record.id &&
                            r.active
                        ) !== undefined
                      }
                      key={e.toLowerCase()}
                      value={e.toLowerCase()}
                    >
                      {t(`admin:intervals.${e}`)}
                    </Option>
                  ))}
                </Select>
              )) ||
              (dataIndex === "active" && <Switch defaultChecked={false} />)}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
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
        recurring: JSON.parse(price.recurring),
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

  const create = (record: Plan_product_prices_edges_node) => {
    product &&
      createPrice({
        variables: {
          id: product?.id,
          price: {
            active: record.active || false,
            amount: record.unitAmount,
            currency: record.currency,
            interval: record.recurring.interval.toUpperCase(),
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
      let data = dataSource && [...dataSource];
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
      render: (amount: number) => amount,
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
      render: (i: "day" | "week" | "month" | "year") =>
        i.toUpperCase() === PlanInterval.DAY
          ? t("daily")
          : i.toUpperCase() === PlanInterval.WEEK
          ? t("weekly")
          : i.toUpperCase() === PlanInterval.MONTH
          ? t("monthly")
          : i.toUpperCase() === PlanInterval.YEAR
          ? t("annual")
          : "-",
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
      render: (_: any, record: Plan_product_prices_edges_node) => {
        const editable = isEditing(record);
        return editable ? (
          <span>
            {record.id === "1" && (
              <Popconfirm
                title={t("admin:warningCreatePrice")}
                onConfirm={() => formPrices.submit()}
              >
                <Button type="link">{t("add")}</Button>
              </Popconfirm>
            )}
            <Button type="link" onClick={discard}>
              {t("cancel")}
            </Button>
          </span>
        ) : (
          <Popconfirm
            title={
              record.active
                ? t("admin:warningArchivePrice")
                : t("admin:warningUnarchivePrice")
            }
            onConfirm={() => {
              setArchiveState(record.active);
              record.active ? arch(record, false) : arch(record, true);
            }}
            onCancel={() => cancel()}
            visible={archivingId !== "" && archivingId === record.id}
          >
            <Button
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
        inputType:
          col.dataIndex === "unitAmount"
            ? "number"
            : isEqual(col.dataIndex, ["recurring", "interval"]) ||
              col.dataIndex === "currency"
            ? "select"
            : col.dataIndex === "active"
            ? "switch"
            : "text",
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });
  return (
    <>
      <Title level={3}>{t("admin:pricesInfo")}</Title>
      <Button
        className={styles.new}
        disabled={editingId !== "" || archivingId !== ""}
        onClick={() => add()}
        type="primary"
      >
        {t("admin:newPrice")}
      </Button>
      <Paragraph type="secondary">{t("admin:warnings.prices")}</Paragraph>
      <Form
        form={formPrices}
        component={false}
        onFinish={(values) => create(values)}
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
          rowClassName={(row) =>
            !row.active ? styles.inactive : "editable-row"
          }
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
    </>
  );
};

export default PricesInfo;