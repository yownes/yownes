import React from "react";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";

import { AccountAccountStatus } from "../../api/types/globalTypes";

interface UserStateProps {
  state?: AccountAccountStatus;
}

const COLORS = {
  REGISTERED: "default",
  WAITING_PAYMENT: "orange",
  PAID_ACCOUNT: "green",
  BANNED: "red",
};

const UserState = ({ state }: UserStateProps) => {
  const { t } = useTranslation();
  const selector = state || AccountAccountStatus.REGISTERED;
  const color = COLORS[selector];
  const status = `accountStatus.${selector}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default UserState;
