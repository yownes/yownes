import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Collapse,
  Form,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MODIFY_APP_PAYMENT } from "../../api/mutations";
import { APP_PAYMENTS } from "../../api/queries";
import { AppPayments, AppPaymentsVariables } from "../../api/types/AppPayments";
import {
  ModifyAppPayment,
  ModifyAppPaymentVariables,
} from "../../api/types/ModifyAppPayment";

import { Loading, LoadingFullScreen } from "../atoms";
import { Errors } from "../molecules";

message.config({ maxCount: 1 });
const { Text, Title } = Typography;

interface AppPaymentProps {
  appId: string;
}

const AppPayment = ({ appId }: AppPaymentProps) => {
  const [errs, setErrs] = useState<string | undefined>("");
  const { t } = useTranslation("client");
  const { data, loading } = useQuery<AppPayments, AppPaymentsVariables>(
    APP_PAYMENTS,
    {
      variables: {
        id: appId,
      },
    }
  );
  const [updatePayment, { data: mutationData, loading: updating }] =
    useMutation<ModifyAppPayment, ModifyAppPaymentVariables>(
      MODIFY_APP_PAYMENT,
      {
        refetchQueries: [{ query: APP_PAYMENTS, variables: { id: appId } }],
      }
    );
  useEffect(() => {
    if (mutationData?.modifyPaymentMethodApp?.error) {
      setErrs(mutationData.modifyPaymentMethodApp.error);
    }
  }, [mutationData]);
  useEffect(() => {
    if (mutationData?.modifyPaymentMethodApp?.ok) {
      message.success(t("saveChangesSuccessful"), 4);
    }
  }, [mutationData, t]);

  if (loading) return <Loading />;

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>{t("collectMethod")}</Title>
        </Col>
        <Col span={24}>
          <Text>{t("keysDescription")}</Text>
        </Col>
        <Col span={24}>
          <Collapse>
            <Collapse.Panel key="stripe" header="Stripe">
              <Form
                initialValues={data?.app?.paymentMethod ?? undefined}
                onChange={() => setErrs(undefined)}
                onFinish={(values) => {
                  updatePayment({
                    variables: {
                      data: values,
                      appId,
                    },
                  });
                }}
                validateMessages={{ required: t("requiredInput") }}
              >
                <Form.Item
                  name="stripeTestPublic"
                  label={t("testPublicKey")}
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="stripeTestSecret"
                  label={t("testPrivateKey")}
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="stripeProdPublic"
                  label={t("prodPublicKey")}
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Form.Item
                  name="stripeProdSecret"
                  label={t("prodPrivateKey")}
                  rules={[{ required: true }]}
                >
                  <Input.Password />
                </Form.Item>
                <Space direction="vertical" size="middle">
                  {errs && (
                    <Errors
                      errors={{
                        nonFieldErrors: [
                          {
                            message: t(`errors.${errs}`, t("error")),
                            code: errs,
                          },
                        ],
                      }}
                    />
                  )}
                  <Button loading={updating} htmlType="submit" type="primary">
                    {t("updateStripeKeys")}
                  </Button>
                </Space>
              </Form>
            </Collapse.Panel>
          </Collapse>
        </Col>
        {updating && <LoadingFullScreen tip={t("updatingStripeKeys")} />}
      </Row>
    </>
  );
};

export default AppPayment;
