import React from "react";
import { Card, Col, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MY_PAYMENT_METHODS } from "../../api/queries";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";

import { Loading } from "../../components/atoms";
import { DeleteAccount } from "../../components/molecules";
import {
  ChangePassword,
  PaymentMethod,
  PersonalData,
  SubscriptionData,
} from "../../components/organisms";

const { Title } = Typography;

const EditProfile = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);

  return (
    <>
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ minWidth: 720 }}>
          <PersonalData />
        </Col>
        <Col span={24} style={{ minWidth: 720 }}>
          <SubscriptionData />
        </Col>
        <Col span={24} style={{ minWidth: 720 }}>
          <Card>
            <Title level={2}>{t("client:paymentMethod")}</Title>
            {loading ? (
              <Loading />
            ) : (
              <PaymentMethod
                customer={data?.me?.customer}
                userId={data?.me?.id!!}
              />
            )}
          </Card>
        </Col>
        <Col span={24} style={{ minWidth: 720 }}>
          <Card>
            <ChangePassword />
          </Card>
        </Col>
        <Col span={24} style={{ minWidth: 720 }}>
          <DeleteAccount />
        </Col>
      </Row>
    </>
  );
};

export default EditProfile;
