import React from "react";
import { Button, Dropdown, Menu, Modal, Grid } from "antd";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../../lib/auth";

import styles from "./HeaderSessionInfo.module.css";

const { Divider, Item, SubMenu } = Menu;
const { confirm } = Modal;

interface HeaderSessionInfoProps {
  email: string;
  staff: boolean;
}

const HeaderSessionInfo = ({ email, staff }: HeaderSessionInfoProps) => {
  const { logout } = useAuth();
  const screens = Grid.useBreakpoint();
  const { t } = useTranslation();

  const menu = (
    <Menu>
      {!staff && (
        <Item key="0">
          <Link to="/profile">{t("dashboard")}</Link>
        </Item>
      )}
      <Item key="1">
        <Link to={staff ? "/profile" : "/profile/edit"}>{t("profile")}</Link>
      </Item>
      <Divider />
      <SubMenu key="sub1" title={t("help.title")}>
        {/* TODO: add correct links */}
        <Item key="2">
          <Link to="">{t("help.sup")}</Link>
        </Item>
        <Item key="3">
          <Link to="">{t("help.pp")}</Link>
        </Item>
        <Item key="4">
          <Link to="/tos">{t("help.tos")}</Link>
        </Item>
      </SubMenu>
      <Divider />
      <Item
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
        key="5"
      >
        {t("logout")}
      </Item>
    </Menu>
  );
  return (
    <div className={styles.container}>
      {screens.md && (
        <div className={styles.info}>
          <span className={styles.title}>
            <Link to="/profile">{email}</Link>
          </span>
        </div>
      )}
      <Dropdown overlay={menu} trigger={["click"]}>
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
