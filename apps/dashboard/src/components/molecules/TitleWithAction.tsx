import React, { ReactNode, useState } from "react";
import { Button, Popconfirm, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./TitleWithAction.module.css";

const { Title } = Typography;

interface TitleWithActionProps {
  title: string;
  action?: {
    action: () => void;
    buttonClassName?: string;
    disabled?: boolean;
    label: ReactNode;
    needsConfirmation?: boolean;
    confirmationTitle?: ReactNode;
  };
  description?: string;
  extra?: ReactNode;
  tooltip?: {
    title: string;
    visible: boolean;
  };
}

const TitleWithAction = ({
  title,
  action,
  description,
  extra,
  tooltip,
}: TitleWithActionProps) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("client");
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <div className={styles.titleContainer}>
          <Title level={2}>{title}</Title>
          <span className={styles.description}>{description}</span>
        </div>
        {action &&
          (action.needsConfirmation ? (
            <Tooltip
              title={tooltip && tooltip.title}
              visible={tooltip && tooltip.visible && visible}
            >
              <Popconfirm
                cancelButtonProps={{ className: "button-default-default" }}
                onConfirm={action.action}
                placement="bottomRight"
                title={action.confirmationTitle || t("warnings.action")}
              >
                <div
                  onMouseEnter={() => setVisible(true)}
                  onMouseLeave={() => setVisible(false)}
                >
                  <Button
                    className={
                      !action.disabled ? action.buttonClassName : undefined
                    }
                    disabled={action.disabled || false}
                    type="primary"
                  >
                    {action.label}
                  </Button>
                </div>
              </Popconfirm>
            </Tooltip>
          ) : (
            <Tooltip
              title={tooltip && tooltip.title}
              visible={tooltip && tooltip.visible && visible}
            >
              <div
                onMouseEnter={() => setVisible(true)}
                onMouseLeave={() => setVisible(false)}
              >
                <Button
                  className={
                    !action.disabled ? action.buttonClassName : undefined
                  }
                  disabled={action.disabled || false}
                  onClick={action.action}
                  type="default"
                >
                  {action.label}
                </Button>
              </div>
            </Tooltip>
          ))}
        {extra}
      </div>
    </div>
  );
};

export default TitleWithAction;
