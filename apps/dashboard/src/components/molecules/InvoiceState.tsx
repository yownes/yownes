import React from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { InvoiceStatus } from "../../api/types/globalTypes";

interface InvoiceStateProps {
  state: InvoiceStatus | null;
  tooltip?: React.ReactNode;
}

const COLORS = {
  DRAFT: "default",
  OPEN: "orange",
  PAID: "green",
  UNCOLLECTIBLE: "red",
  VOID: "default",
};

const InvoiceState = ({ state, tooltip }: InvoiceStateProps) => {
  const { t } = useTranslation();
  const selector = state || InvoiceStatus.OPEN;
  const color = COLORS[selector];
  const status = `invoiceStatus.${selector}`;
  return tooltip ? (
    <Tooltip title={tooltip}>
      <Tag color={color}>{t(status)}</Tag>
    </Tooltip>
  ) : (
    <Tag color={color}>{t(status)}</Tag>
  );
};

export default InvoiceState;
