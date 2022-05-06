import React from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { InvoiceStatus } from "../../api/types/globalTypes";
import { colors } from "../../lib/colors";

interface InvoiceStateProps {
  state: InvoiceStatus | null;
  tooltip?: React.ReactNode;
}

const COLORS = {
  DRAFT: colors.tagDefault,
  OPEN: colors.tagOrange,
  PAID: colors.tagGreen,
  UNCOLLECTIBLE: colors.tagRed,
  VOID: colors.tagDefault,
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
