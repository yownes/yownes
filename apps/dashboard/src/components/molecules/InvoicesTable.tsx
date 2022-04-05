import React, { useState } from "react";
import { Badge, Table, Typography, TableColumnsType } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { InvoiceStatus } from "../../api/types/globalTypes";
import { Invoices_invoices_edges_node } from "../../api/types/Invoices";
import { Me } from "../../api/types/Me";
import { MyAccount_me_subscription_invoices_edges_node } from "../../api/types/MyAccount";
import { ME } from "../../api/queries";
import { currencySymbol } from "../../lib/currencySymbol";
import { shortDateTime } from "../../lib/parseDate";

import { ExpandIcon, InvoiceInfo, InvoiceState } from "./";

import styles from "./InvoicesTable.module.css";

const { Text } = Typography;

interface InovicesTableProps {
  invoices:
    | MyAccount_me_subscription_invoices_edges_node[]
    | Invoices_invoices_edges_node[]
    | undefined;
}

const InvoicesTable = ({ invoices }: InovicesTableProps) => {
  const { t } = useTranslation();
  const [expandedRow, setExpandedRow] = useState<string[]>([]);
  const { data } = useQuery<Me>(ME);
  const columns: TableColumnsType<
    MyAccount_me_subscription_invoices_edges_node | Invoices_invoices_edges_node
  > = [
    {
      title: t("amount"),
      dataIndex: "total",
      key: "total",
      render: (total: number, row) => (
        <>
          {total.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          {currencySymbol(row.currency)}
        </>
      ),
    },
    {
      title: t("state"),
      dataIndex: "status",
      key: "state",
      render: (state: InvoiceStatus) => {
        return <InvoiceState state={state} />;
      },
    },
    {
      title: t("invoice"),
      dataIndex: "number",
      key: "invoice",
      render: (number: string) => number || t("draft"),
    },
    {
      title: t("date"),
      dataIndex: "created",
      key: "started",
      render: (created) => shortDateTime(new Date(created)),
    },
    {
      title: t("plan"),
      dataIndex: ["subscription", "plan", "product", "name"],
      key: "plan",
      render: (plan) => plan,
    },
  ];

  return (
    <Table
      columns={columns}
      dataSource={invoices}
      expandable={{
        expandIcon: () => undefined,
        // expandIcon: ({ expanded, onExpand, record }) => (
        //   <Badge
        //     dot
        //     style={
        //       record.status === InvoiceStatus.OPEN ? {} : { display: "none" }
        //     }
        //   >
        //     <ExpandIcon
        //       expanded={expanded}
        //       onExpand={onExpand}
        //       record={record}
        //     />
        //   </Badge>
        // ),
        expandRowByClick: true,
        expandedRowRender: (record) => (
          <div className={styles.expandedContent}>
            <InvoiceInfo invoice={record} staff={data?.me?.isStaff} />
          </div>
        ),

        expandedRowKeys: expandedRow,
        onExpand: (expanded, record) =>
          expanded ? setExpandedRow([record.created]) : setExpandedRow([]),
      }}
      locale={{ emptyText: t("noInvoices") }}
      pagination={{
        showSizeChanger: true,
        showTotal: (total, range) =>
          t("paginationItems", {
            first: range[0],
            last: range[1],
            total: total,
            item: t("invoices"),
          }),
      }}
      rowClassName={(row) =>
        expandedRow.includes(row.created) ? styles.expandedRow : styles.row
      }
      rowKey={(row) => row.created}
      style={{ marginTop: 20 }}
    />
  );
};

export default InvoicesTable;
