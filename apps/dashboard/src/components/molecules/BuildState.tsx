import { Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { BuildBuildStatus } from "../../api/types/globalTypes";
import { colors } from "../../lib/colors";

interface BuildStateProps {
  state: BuildBuildStatus;
}

const COLORS = {
  STALLED: colors.tagDefault,
  QUEUED: colors.tagPurple,
  GENERATING: colors.tagCyan,
  UPLOADING: colors.tagYellow,
  PUBLISHED: colors.tagGreen,
  WAITING: colors.tagOrange,
};

const BuildState = ({ state }: BuildStateProps) => {
  const { t } = useTranslation("client");
  const color = COLORS[state];
  const status = `appStatus.${state}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default BuildState;
