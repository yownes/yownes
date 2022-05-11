import React from "react";
import { Col, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { TEMPLATES } from "../../api/queries";
import type { Templates } from "../../api/types/Templates";
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

  if (loading) {
    return <Loading />;
  }

  const templates = connectionToNodes(data?.templates);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={5}>{t("template")}</Title>
        </Col>
        <Col span={24}>
          {templates.length > 0 ? (
            <div className={styles.templatesContainer}>
              {templates.map((template) => (
                <div
                  className={styles.previewContainer}
                  key={template.id}
                  onClick={() => onChange(template.id)}
                >
                  <TemplatePreview
                    image={template.previewImg ?? ""}
                    name={template.name ?? ""}
                    selected={template.id === value ?? templates[0]?.id}
                  />
                </div>
              ))}
            </div>
          ) : (
            t("noTemplates")
          )}
        </Col>
      </Row>
    </>
  );
};

export default TemplateSelector;
