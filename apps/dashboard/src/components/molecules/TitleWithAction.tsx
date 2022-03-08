import React, { ReactNode, useState } from "react";
import { Button, Popconfirm, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";

import styles from "./TitleWithAction.module.css";

const { Title } = Typography;

interface TitleWithActionProps {
  title: string;
  action?: {
    action: () => void;
    disabled?: boolean;
    label: ReactNode;
    needsConfirmation?: boolean;
    confirmationTitle?: ReactNode;
  };
  description?: string;
  tooltip?: {
    title: string;
    visible: boolean;
  };
}

const TitleWithAction = ({
  title,
  action,
  description,
  tooltip,
}: TitleWithActionProps) => {
  const [visible, setVisible] = useState(false);
  const { t } = useTranslation("client");
  return (
    <div className={styles.container}>
      <div className={styles.title}>
        <Title level={3}>{title}</Title>
        {action &&
          (action.needsConfirmation ? (
            <Tooltip
              title={tooltip && tooltip.title}
              visible={tooltip && tooltip.visible && visible}
            >
              <Popconfirm
                placement="bottomRight"
                title={action.confirmationTitle || t("warnings.action")}
                onConfirm={action.action}
              >
                <div
                  onMouseEnter={() => setVisible(true)}
                  onMouseLeave={() => setVisible(false)}
                >
                  <Button disabled={action.disabled || false} type="primary">
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
                  disabled={action.disabled || false}
                  onClick={action.action}
                  type="primary"
                >
                  {action.label}
                </Button>
              </div>
            </Tooltip>
          ))}
      </div>
      <span>{description}</span>
    </div>
  );
};

export default TitleWithAction;
