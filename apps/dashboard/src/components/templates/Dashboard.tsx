import React from "react";

import { Header } from "../organisms";

import styles from "./Dashboard.module.css";

interface DashboardTemplateProps {
  children: React.ReactNode;
  header?: React.ReactNode;
}

const DashboardTemplate = ({
  children,
  header: SubHeader,
}: DashboardTemplateProps) => {
  return (
    <>
      <Header />
      {SubHeader}
      <main className={styles.main}>{children}</main>
    </>
  );
};

export default DashboardTemplate;
