import React from "react";
import { Tag, Tooltip } from "antd";
import { useTranslation } from "react-i18next";

import { SubscriptionStatus } from "../../api/types/globalTypes";

interface SubscriptionStateProps {
  state?: SubscriptionStatus;
  tooltip?: React.ReactNode;
}

const COLORS = {
  ACTIVE: "green",
  CANCELED: "default",
  INCOMPLETE: "orange",
  INCOMPLETE_EXPIRED: "red",
  PAST_DUE: "red",
  TRIALING: "cyan",
  UNPAID: "red",
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
