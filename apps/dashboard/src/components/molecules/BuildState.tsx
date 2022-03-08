import { Tag } from "antd";
import React from "react";
import { useTranslation } from "react-i18next";

import { BuildBuildStatus } from "../../api/types/globalTypes";

interface BuildStateProps {
  state: BuildBuildStatus;
}

const COLORS = {
  STALLED: "default",
  QUEUED: "purple",
  GENERATING: "cyan",
  UPLOADING: "magenta",
  PUBLISHED: "green",
  WAITING: "orange",
};

const BuildState = ({ state }: BuildStateProps) => {
  const { t } = useTranslation("client");
  const color = COLORS[state];
  const status = `appStatus.${state}`;
  return <Tag color={color}>{t(status)}</Tag>;
};

export default BuildState;
