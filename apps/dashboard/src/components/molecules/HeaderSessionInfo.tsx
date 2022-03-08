import React from "react";
import { Button, Dropdown, Menu, Modal } from "antd";
import useBreakpoint from "antd/lib/grid/hooks/useBreakpoint";
import { EllipsisOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { useAuth } from "../../lib/auth";

import styles from "./HeaderSessionInfo.module.css";

const { Divider, Item, SubMenu } = Menu;
const { confirm } = Modal;

interface HeaderSessionInfoProps {
  email: string;
}

const HeaderSessionInfo = ({ email }: HeaderSessionInfoProps) => {
  const { logout } = useAuth();
  const screens = useBreakpoint();
  const { t } = useTranslation();

  const menu = (
    <Menu>
      <Item key="0">
        <Link to="/profile">{t("profile")}</Link>
      </Item>
      <Divider />
      <SubMenu key="sub1" title={t("help.title")}>
        {/* TODO: add correct links */}
        <Item key="1">
          <Link to="">{t("help.sup")}</Link>
        </Item>
        <Item key="2">
          <Link to="">{t("help.pp")}</Link>
        </Item>
        <Item key="3">
          <Link to="/tos">{t("help.tos")}</Link>
        </Item>
      </SubMenu>
      <Divider />
      <Item
        onClick={() => {
          confirm({
            title: t("confirmLogout"),
            icon: <ExclamationCircleOutlined />,
            okText: t("confirm"),
            onOk: () => logout?.(),
          });
        }}
        key="1"
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
        <Button icon={<EllipsisOutlined />} shape="circle" />
      </Dropdown>
    </div>
  );
};

HeaderSessionInfo.defaultProps = {
  reverse: false,
  editable: false,
};

export default HeaderSessionInfo;
