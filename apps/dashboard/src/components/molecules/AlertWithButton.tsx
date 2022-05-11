import React from "react";
import { Alert, Button, Typography } from "antd";

const { Text } = Typography;

interface AlertWithButtonProps {
  buttonText: string;
  message: string[];
}

const AlertWithButton = ({ buttonText, message }: AlertWithButtonProps) => {
  return (
    <div style={{ padding: "16px 15px 0px 7.5px" }}>
      <Alert
        action={
          <Button size="small" type="primary">
            {buttonText}
          </Button>
        }
        message={
          <div style={{ margin: "5px 10px" }}>
            {message.map((m) => (
              <Text style={{ display: "block" }}>{m}</Text>
            ))}
          </div>
        }
        showIcon
        type="warning"
      />
    </div>
  );
};

export default AlertWithButton;
