import React from "react";
import { Typography } from "antd";
import { useTranslation } from "react-i18next";

import { StoreAppInput } from "../../api/types/globalTypes";

import styles from "./AppPreview.module.css";

const { Title } = Typography;

interface AppPreviewProps {
  app: StoreAppInput;
  id: string;
}

const AppPreview = ({ id, app }: AppPreviewProps) => {
  const { t } = useTranslation("client");
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title level={3}>{t("preview")}</Title>
      </div>
      <div className={styles.previewContainer}>
        <div className={styles.preview}></div>
      </div>
    </div>
  );
};

export default AppPreview;
