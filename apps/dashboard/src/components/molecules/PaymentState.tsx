import React from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { ChargeStatus } from "../../api/types/globalTypes";
import { colors } from "../../lib/colors";

interface PaymentStateProps {
  state: ChargeStatus | null;
  tooltip?: React.ReactNode;
}

const COLORS = {
  PENDING: colors.tagDefault,
  SUCCEEDED: colors.tagGreen,
  FAILED: colors.tagRed,
};

const PaymentState = ({ state, tooltip }: PaymentStateProps) => {
  const { t } = useTranslation();
  const selector = state || ChargeStatus.PENDING;
  const color = COLORS[selector];
  const status = `chargeStatus.${selector}`;
  return tooltip ? (
    <Tooltip title={tooltip}>
      <Tag color={color}>{t(status)}</Tag>
    </Tooltip>
  ) : (
    <Tag color={color}>{t(status)}</Tag>
  );
};

export default PaymentState;
