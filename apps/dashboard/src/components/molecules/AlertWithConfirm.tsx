import React from "react";
import type { ReactNode } from "react";
import { Alert, Button, Popconfirm, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface AlertWithConfirmProps {
  buttonText: string;
  confirmText: string | ReactNode;
  description?: string[];
  message: string[];
  onConfirm: () => void;
  style?: React.CSSProperties;
  type?: "success" | "info" | "warning" | "error";
}

const AlertWithConfirm = ({
  buttonText,
  confirmText,
  description,
  message,
  onConfirm,
  style,
  type,
}: AlertWithConfirmProps) => {
  const { t } = useTranslation();
  return (
    <Alert
      action={
        <Popconfirm
          cancelButtonProps={{ className: "button-default-default" }}
          cancelText={t("cancel")}
          okText={t("confirm")}
          onConfirm={onConfirm}
          placement="left"
          title={confirmText}
        >
          <Button size="small" type="primary" style={{ border: "none" }}>
            {buttonText}
          </Button>
        </Popconfirm>
      }
      className="alert-with-confirm"
      description={
        description ? (
          <div style={{ margin: "5px 10px" }}>
            {description.map((d) => (
              <Text key={d} style={{ display: "block" }}>
                {d}
              </Text>
            ))}
          </div>
        ) : undefined
      }
      message={
        <div style={{ margin: "5px 10px" }}>
          {message.map((m) => (
            <Text key={m} style={{ display: "block" }}>
              {m}
            </Text>
          ))}
        </div>
      }
      showIcon
      style={style ?? {}}
      type={type || "warning"}
    />
  );
};

export default AlertWithConfirm;
