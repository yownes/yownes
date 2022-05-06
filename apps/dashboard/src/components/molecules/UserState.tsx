import React from "react";
import { Tag } from "antd";
import { useTranslation } from "react-i18next";

import { AccountAccountStatus } from "../../api/types/globalTypes";
import { colors } from "../../lib/colors";

interface UserStateProps {
  state?: AccountAccountStatus;
}

const COLORS = {
  REGISTERED: colors.tagDefault,
  WAITING_PAYMENT: colors.tagOrange,
  PAID_ACCOUNT: colors.tagGreen,
  BANNED: colors.tagRed,
};

const UserState = ({ state }: UserStateProps) => {
  const { t } = useTranslation();
  const selector = state || AccountAccountStatus.REGISTERED;
  const color = COLORS[selector];
  const status = `accountStatus.${selector}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default UserState;
