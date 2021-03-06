import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MY_ACCOUNT, MY_PAYMENT_METHODS } from "../../api/queries";
import type { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import { Loading } from "../../components/atoms";
import { DeleteAccount } from "../../components/molecules";
import {
  AccountData,
  ChangePassword,
  CustomerData,
  InvoicesData,
  PaymentMethod,
  SubscriptionData,
} from "../../components/organisms";
import type { MyAccount } from "../../api/types/MyAccount";

const { Title } = Typography;

const EditProfile = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data: accountData, loading: loadingAccount } =
    useQuery<MyAccount>(MY_ACCOUNT);
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);

  return (
    <Col
      xs={{ span: 22, offset: 1 }}
      sm={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 16, offset: 4 }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <AccountData />
        </Col>
        <Col span={24}>
          {loadingAccount ? (
            <Card>
              <Title level={2} style={{ paddingBottom: 24 }}>
                {t("client:customerData")}
              </Title>
              <Loading />
            </Card>
          ) : (
            <CustomerData customer={accountData?.me} />
          )}
        </Col>
        <Col span={24}>
          <SubscriptionData />
        </Col>
        <Col span={24}>
          {loading ? (
            <Card>
              <Title level={2} style={{ paddingBottom: 24 }}>
                {t("invoices")}
              </Title>
              <Loading />
            </Card>
          ) : (
            <InvoicesData userId={data?.me?.id ?? ""} />
          )}
        </Col>
        <Col span={24}>
          <Card>
            <Title level={2} style={{ paddingBottom: 24 }}>
              {t("client:paymentMethod")}
            </Title>
            {loading ? (
              <Loading />
            ) : (
              <PaymentMethod
                customer={data?.me?.customer}
                user={accountData?.me}
              />
            )}
          </Card>
        </Col>
        <Col span={24}>
          <Card>
            <ChangePassword />
          </Card>
        </Col>
        <Col span={24}>
          <DeleteAccount />
        </Col>
      </Row>
    </Col>
  );
};

export default EditProfile;
