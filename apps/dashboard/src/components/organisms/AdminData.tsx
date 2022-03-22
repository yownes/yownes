import React from "react";
import { Alert, Button, Card, Col, Form, Input, Row, Typography } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";

import { Loading } from "../atoms";

const { Title } = Typography;

const PersonalData = () => {
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);

  if (loading)
    return (
      <Card>
        <Title level={2}>{t("client:personalData")}</Title>
        <Loading />
      </Card>
    );
  return (
    <>
      {!data?.me?.verified && (
        <Row gutter={[24, 24]}>
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
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <Title level={2}>{t("client:personalData")}</Title>
            <Form
              initialValues={{
                username: data?.me?.username,
                email: data?.me?.email,
              }}
              labelCol={{
                xs: { span: 24 },
                sm: { span: 9 },
                md: { span: 7 },
                lg: { span: 5 },
              }}
              onFinish={() => {}}
              validateMessages={{ required: t("client:requiredInput") }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true }]}
                label={t("username")}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true }]}
                label={t("email")}
              >
                <Input disabled />
              </Form.Item>
              <Button
                disabled
                htmlType="submit"
                type="primary"
                //disabled={loading}
                //loading={loading}
              >
                {t("client:saveChanges")}
              </Button>
            </Form>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default PersonalData;
