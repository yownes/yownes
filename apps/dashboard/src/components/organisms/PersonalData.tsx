import React from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";

import { Loading } from "../../components/atoms";

const { Title } = Typography;

const PersonalData = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);

  if (loading)
    return (
      <Card>
        <Title level={3}>{t("client:personalData")}</Title>
        <Loading />
      </Card>
    );
  return (
    <Form
      initialValues={{
        name: data?.me?.username,
        email: data?.me?.email,
      }}
      onFinish={(values) => {
        //TODO: send to server
        console.log("Finish form", values);
      }}
      validateMessages={{ required: t("client:requiredInput") }}
    >
      {!data?.me?.verified && (
        <Row gutter={[20, 20]}>
          <Col span={24} style={{ minWidth: 550 }}>
            <Alert
              showIcon
              message={t("client:validate.message")}
              description={t("client:validate.description")}
              type="warning"
            />
          </Col>
          <Col></Col>
        </Row>
      )}
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <Title level={3}>{t("client:personalData")}</Title>
            <Row gutter={[20, 20]}>
              <Col md={12} sm={24}>
                <Form.Item
                  name="name"
                  rules={[{ required: true }]}
                  label={t("name")}
                >
                  <Input disabled placeholder={t("name")} />
                </Form.Item>
              </Col>
              <Col md={12} sm={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true }]}
                  label={t("email")}
                >
                  <Input disabled placeholder={t("email")} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[20, 20]}>
              <Col>
                <Button
                  htmlType="submit"
                  type="primary"
                  //disabled={loading}
                  //loading={loading}
                >
                  {t("client:saveChanges")}
                </Button>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Form>
  );
};

export default PersonalData;
