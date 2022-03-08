import React from "react";
import { Menu } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import styles from "./AdminHeader.module.css";

const { Item } = Menu;

const AdminHeader = () => {
  const { t } = useTranslation("admin");
  const location = useLocation();
  return (
    <Menu
      className={styles.menu}
      selectedKeys={[location.pathname.slice(1, 7)]}
      mode="horizontal"
    >
      <Item className={styles.item} key="client">
        <Link to="/clients">{t("clients")}</Link>
      </Item>
      <Item className={styles.item} key="builds">
        <Link to="/builds">{t("builds")}</Link>
      </Item>
      <Item className={styles.item} key="templa">
        <Link to="/templates">{t("templates")}</Link>
      </Item>
      <Item className={styles.item} key="planes">
        <Link to="/planes">{t("plans")}</Link>
      </Item>
      <Item className={styles.item} key="profil">
        <Link to="/profile">{t("profile")}</Link>
      </Item>
    </Menu>
  );
};

export default AdminHeader;
