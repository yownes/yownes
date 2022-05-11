import React from "react";
import { Alert, Card, Col, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MY_ACCOUNT } from "../../api/queries";
import type { MyAccount } from "../../api/types/MyAccount";
import { Loading } from "../atoms";
import { Descriptions, NotVerifiedAlert } from "../molecules";

const { Title } = Typography;

const AccountData = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);

  if (loading) {
    return (
      <Card>
        <Title level={2}>{t("client:accountData")}</Title>
        <Loading />
      </Card>
    );
  }

  return (
    <>
      {!data?.me?.verified && (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <NotVerifiedAlert email={data?.me?.email ?? ""} />
          </Col>
          <Col />
        </Row>
      )}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Title level={2} style={{ paddingBottom: 24 }}>
              {t("client:accountData")}
            </Title>
            <Descriptions
              items={[
                { title: t("username"), description: data?.me?.username },
                { title: t("email"), description: data?.me?.email },
              ]}
            />
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default AccountData;
