import React from "react";
import { Col } from "antd";

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
      <main className={styles.main}>
        <Col xs={{ span: 22, offset: 1 }} lg={{ span: 16, offset: 4 }}>
          {children}
        </Col>
      </main>
    </>
  );
};

export default DashboardTemplate;
