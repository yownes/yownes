import React from "react";
import { Card, Col, message, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { Invoices, InvoicesVariables } from "../../api/types/Invoices";
import { MyAccount } from "../../api/types/MyAccount";
import { INVOICES, MY_ACCOUNT } from "../../api/queries";

import { Loading } from "../atoms";
import { InvoicesTable } from "../molecules";

import styles from "./SubscriptionData.module.css";
import connectionToNodes from "../../lib/connectionToNodes";

const { Title } = Typography;

const SubscriptionData = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const { data: invoicesData, loading: loadingInvoices } = useQuery<
    Invoices,
    InvoicesVariables
  >(INVOICES, { variables: { userId: data?.me?.id ?? "" } });

  message.config({ maxCount: 1 });

  if (loading || loadingInvoices)
    return (
      <Card>
        <Title level={2}>{t("invoices")}</Title>
        <Loading />
      </Card>
    );

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

export default SubscriptionData;
