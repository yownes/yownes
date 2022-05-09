import React from "react";
import { Card, Col, message, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import type { Invoices, InvoicesVariables } from "../../api/types/Invoices";
import { INVOICES } from "../../api/queries";
import { Loading } from "../atoms";
import { InvoicesTable } from "../molecules";
import connectionToNodes from "../../lib/connectionToNodes";

import styles from "./InvoicesData.module.css";

const { Title } = Typography;

interface InvoicesDataProps {
  userId: string;
}

const InvoicesData = ({ userId }: InvoicesDataProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const { data: invoicesData, loading: loadingInvoices } = useQuery<
    Invoices,
    InvoicesVariables
  >(INVOICES, { variables: { userId: userId } });

  message.config({ maxCount: 1 });

  if (loadingInvoices) {
    return (
      <Card>
        <Title level={2}>{t("invoices")}</Title>
        <Loading />
      </Card>
    );
  }

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title className={styles.header} level={2}>
            {t("invoices")}
          </Title>
          <InvoicesTable invoices={connectionToNodes(invoicesData?.invoices)} />
        </Card>
      </Col>
    </Row>
  );
};

export default InvoicesData;
