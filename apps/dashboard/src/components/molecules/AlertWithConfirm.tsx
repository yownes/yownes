import React from "react";
import { Alert, Button, Popconfirm, Typography } from "antd";
import { useTranslation } from "react-i18next";

const { Text } = Typography;

interface AlertWithConfirmProps {
  buttonText: string;
  confirmText: string | JSX.Element;
  message: string[];
  onConfirm: () => void;
  style?: React.CSSProperties;
  type?: "success" | "info" | "warning" | "error";
}

const AlertWithConfirm = ({
  buttonText,
  confirmText,
  message,
  onConfirm,
  style,
  type,
}: AlertWithConfirmProps) => {
  const { t } = useTranslation();
  return (
    <div style={{ padding: "0px 15px 0px 7.5px" }}>
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
      ></Alert>
    </div>
  );
};

export default AlertWithConfirm;
