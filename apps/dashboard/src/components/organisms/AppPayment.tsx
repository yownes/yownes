import React, { useEffect, useState } from "react";
import { Button, Col, Form, message, Row, Typography } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { MODIFY_APP_PAYMENT } from "../../api/mutations";
import { APP_PAYMENTS } from "../../api/queries";
import type {
  AppPayments,
  AppPaymentsVariables,
} from "../../api/types/AppPayments";
import type {
  ModifyAppPayment,
  ModifyAppPaymentVariables,
} from "../../api/types/ModifyAppPayment";
import { Loading, LoadingFullScreen, TextField } from "../atoms";
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

  if (loading) {
    return <Loading />;
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Title level={2}>{t("collectMethod")}</Title>
        </Col>
        <Col span={24}>
          <Text type="secondary">{t("keysDescription")}</Text>
        </Col>
        <Col span={24}>
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
            <TextField
              defaultValue={data?.app?.paymentMethod?.stripeTestPublic}
              label={t("testPublicKey")}
              name="stripeTestPublic"
              rules={[{ required: true }]}
              type="password"
            />
            <TextField
              defaultValue={data?.app?.paymentMethod?.stripeTestSecret}
              label={t("testPrivateKey")}
              name="stripeTestSecret"
              rules={[{ required: true }]}
              type="password"
            />
            <TextField
              defaultValue={data?.app?.paymentMethod?.stripeProdPublic}
              label={t("prodPublicKey")}
              name="stripeProdPublic"
              rules={[{ required: true }]}
              type="password"
            />
            <TextField
              defaultValue={data?.app?.paymentMethod?.stripeProdSecret}
              label={t("prodPrivateKey")}
              name="stripeProdSecret"
              rules={[{ required: true }]}
              type="password"
            />
            {errs && (
              <div style={{ paddingBottom: 24 }}>
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
              </div>
            )}
            <Button loading={updating} htmlType="submit" type="primary">
              {t("updateStripeKeys")}
            </Button>
          </Form>
        </Col>
        {updating && <LoadingFullScreen tip={t("updatingStripeKeys")} />}
      </Row>
    </>
  );
};

export default AppPayment;
