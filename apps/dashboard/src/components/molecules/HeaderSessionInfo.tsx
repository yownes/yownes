import React from "react";
import { Button, Dropdown, Menu, Modal, Grid } from "antd";
import type { MenuProps } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../../lib/auth";

import styles from "./HeaderSessionInfo.module.css";

const { confirm } = Modal;

interface HeaderSessionInfoProps {
  email: string;
  staff: boolean;
}

type MenuItemProps = MenuProps["items"];

const HeaderSessionInfo = ({ email, staff }: HeaderSessionInfoProps) => {
  const { logout } = useAuth();
  const screens = Grid.useBreakpoint();
  const { t } = useTranslation();

  const items: MenuItemProps = [
    !staff
      ? {
          key: "0",
          label: <Link to="/profile">{t("dashboard")}</Link>,
        }
      : null,
    {
      key: "1",
      label: (
        <Link to={staff ? "/profile" : "/profile/edit"}>{t("profile")}</Link>
      ),
    },
    {
      key: "sub1",
      label: t("help.title"),
      children: [
        {
          key: "2",
          label: <Link to="">{t("help.sup")}</Link>, // TODO: add correct link
        },
        {
          key: "3",
          label: <Link to="">{t("help.pp")}</Link>, // TODO: add correct link
        },
        {
          key: "4",
          label: <Link to="/tos">{t("help.tos")}</Link>,
        },
      ],
    },
    {
      key: "5",
      label: (
        <div
          onClick={() => {
            confirm({
              cancelButtonProps: {
                className: "button-default-default",
              },
              className: "none",
              icon: <ExclamationCircleOutlined />,
              okText: t("confirm"),
              onOk: () => logout?.(),
              title: t("confirmLogout"),
            });
          }}
        >
          {t("logout")}
        </div>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      {screens.xl && (
        <div className={styles.info}>
          <span className={styles.title}>
            <Link to="/profile">{email}</Link>
          </span>
        </div>
      )}
      <Dropdown overlay={<Menu items={items} />} trigger={["click"]}>
        <Button
          className="button-default-default"
          icon={<EllipsisOutlined className={styles.icon} />}
          shape="circle"
        />
      </Dropdown>
    </div>
  );
};

HeaderSessionInfo.defaultProps = {
  reverse: false,
  editable: false,
};

export default HeaderSessionInfo;
