import React from "react";
import { Radio, Typography } from "antd";
import { RightCircleOutlined } from "@ant-design/icons";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { TEMPLATES } from "../../api/queries";
import { Templates } from "../../api/types/Templates";
import connectionToNodes from "../../lib/connectionToNodes";

import { Loading } from "../atoms";
import { TemplatePreview } from "../molecules";

import styles from "./TemplateSelector.module.css";

const { Title } = Typography;

interface TemplateSelectorProps {
  value?: string;
  onChange: (selected: string) => void;
}

const TemplateSelector = ({ value, onChange }: TemplateSelectorProps) => {
  const { t } = useTranslation("client");
  const { data, loading } = useQuery<Templates>(TEMPLATES);

  if (loading) return <Loading />;

  const templates = connectionToNodes(data?.templates);
  return (
    <div className={styles.container}>
      <Title level={5}>{t("template")}</Title>
      <Radio.Group
        value={value ?? templates[0]?.id}
        onChange={(e) => onChange(e.target.value)}
        style={{ overflowX: "scroll", display: "flex" }}
      >
        {templates.map((template) => (
          <Radio.Button
            value={template.id}
            key={template.id}
            style={{ height: "auto" }}
          >
            <TemplatePreview
              name={template.name ?? ""}
              image={template.previewImg ?? ""}
            />
          </Radio.Button>
        ))}
      </Radio.Group>
      <div className={styles.overlay}>
        <span className={styles.arrow}>
          <RightCircleOutlined style={{ fontSize: "16px", color: "#333" }} />
        </span>
      </div>
    </div>
  );
};

export default TemplateSelector;
