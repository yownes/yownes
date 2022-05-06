import React from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { SubscriptionStatus } from "../../api/types/globalTypes";
import { colors } from "../../lib/colors";

interface SubscriptionStateProps {
  state?: SubscriptionStatus;
  tooltip?: React.ReactNode;
}

const COLORS = {
  ACTIVE: colors.tagGreen,
  CANCELED: colors.tagDefault,
  INCOMPLETE: colors.tagOrange,
  INCOMPLETE_EXPIRED: colors.tagRed,
  PAST_DUE: colors.tagRed,
  TRIALING: colors.tagCyan,
  UNPAID: colors.tagRed,
};

const SubscriptionState = ({ state, tooltip }: SubscriptionStateProps) => {
  const { t } = useTranslation();
  const selector = state || SubscriptionStatus.INCOMPLETE;
  const color = COLORS[selector];
  const status = `subscriptionStatus.${selector}`;
  return tooltip ? (
    <Tooltip title={tooltip}>
      <Tag color={color}>{t(status)}</Tag>
    </Tooltip>
  ) : (
    <Tag color={color}>{t(status)}</Tag>
  );
};

export default SubscriptionState;
