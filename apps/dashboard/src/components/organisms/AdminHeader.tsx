import React from "react";
import { Menu } from "antd";
import type { MenuProps } from "antd";
import { useTranslation } from "react-i18next";
import { Link, useLocation } from "react-router-dom";

import styles from "./AdminHeader.module.css";

type MenuItemProps = MenuProps["items"];

const AdminHeader = () => {
  const { t } = useTranslation("admin");
  const location = useLocation();

  const items: MenuItemProps = [
    {
      key: "client",
      label: (
        <div className={styles.item}>
          <Link to="/clients">{t("clients")}</Link>
        </div>
      ),
    },
    {
      key: "builds",
      label: (
        <div className={styles.item}>
          <Link to="/builds">{t("builds")}</Link>
        </div>
      ),
    },
    {
      key: "templa",
      label: (
        <div className={styles.item}>
          <Link to="/templates">{t("templates")}</Link>
        </div>
      ),
    },
    {
      key: "planes",
      label: (
        <div className={styles.item}>
          <Link to="/planes">{t("plans")}</Link>
        </div>
      ),
    },
    {
      key: "profil",
      label: (
        <div className={styles.item}>
          <Link to="/profile">{t("profile")}</Link>
        </div>
      ),
    },
  ];

  return (
    <Menu
      className={styles.menu}
      items={items}
      mode="horizontal"
      selectedKeys={[location.pathname.slice(1, 7)]}
    />
  );
};

export default AdminHeader;
