import React from "react";
import { Table, Typography } from "antd";
import type { TableColumnsType } from "antd";
import format from "date-fns/format";
import es from "date-fns/locale/es";
import { useTranslation } from "react-i18next";

import type { ChargeStatus } from "../../api/types/globalTypes";
import type { MyAccount_me_subscription_invoices_edges_node_charges_edges_node } from "../../api/types/MyAccount";
import { currencySymbol } from "../../lib/currencySymbol";

import { Last4Card, PaymentState } from ".";

const { Text } = Typography;

interface PaymentsTableProps {
  payments: MyAccount_me_subscription_invoices_edges_node_charges_edges_node[];
}

const PaymentsTable = ({ payments }: PaymentsTableProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const columns: TableColumnsType<MyAccount_me_subscription_invoices_edges_node_charges_edges_node> =
    [
      {
        title: t("amount"),
        dataIndex: "amount",
        key: "amount",
        render: (amount, record) =>
          `${amount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}${currencySymbol(record.currency)}`,
      },
      {
        title: t("state"),
        dataIndex: "status",
        key: "state",
        render: (state: ChargeStatus) => {
          return <PaymentState state={state} />;
        },
      },
      {
        title: t("paymentMethod"),
        dataIndex: ["paymentMethod", "card"],
        key: "card",
        render: (card) => <Last4Card data={card} />,
      },
      {
        title: t("date"),
        dataIndex: "created",
        key: "date",
        render: (date) =>
          format(new Date(date), "dd MMM'. 'HH:mm", {
            locale: es,
          }),
      },
    ];
  return payments.length > 0 ? (
    <Table
      columns={columns}
      dataSource={payments}
      locale={{ emptyText: t("noPayments") }}
      pagination={false}
      rowKey={(row) => row.id}
    />
  ) : (
    <Text type="secondary">{t("noPayments")}</Text>
  );
};

export default PaymentsTable;
