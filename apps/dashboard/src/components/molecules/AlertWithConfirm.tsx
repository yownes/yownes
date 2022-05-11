import React from "react";
import type { ReactNode } from "react";
import { Alert, Button, Popconfirm, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface AlertWithConfirmProps {
  big?: boolean;
  buttonText: string;
  confirmText: string | ReactNode;
  description?: string[];
  message: string[];
  onConfirm: () => void;
  style?: React.CSSProperties;
  type?: "success" | "info" | "warning" | "error";
}

const AlertWithConfirm = ({
  big,
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
    <div style={big ? {} : { padding: "0px 15px 0px 7.5px" }}>
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
            <Button size="small" type="primary">
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
    </div>
  );
};

export default AlertWithConfirm;
