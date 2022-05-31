import React from "react";
import type { CSSProperties } from "react";
import { Alert, Button, Typography } from "antd";
import { Link } from "react-router-dom";

const { Text } = Typography;

interface AlertWithLinkProps {
  buttonText: string;
  containerStyle?: CSSProperties;
  message: string[];
  link: string;
}

const AlertWithLink = ({
  buttonText,
  containerStyle,
  message,
  link,
}: AlertWithLinkProps) => {
  return (
    <div style={{ padding: "0px 15px 0px 7.5px", ...containerStyle }}>
      <Alert
        action={
          <Link to={link}>
            <Button size="small" type="primary" style={{ border: "none" }}>
              {buttonText}
            </Button>
          </Link>
        }
        message={
          <div style={{ margin: "5px 10px" }}>
            {message.map((m, i) => (
              <Text key={i} style={{ display: "block" }}>
                {m}
              </Text>
            ))}
          </div>
        }
        showIcon
        type="warning"
      />
    </div>
  );
};

export default AlertWithLink;
