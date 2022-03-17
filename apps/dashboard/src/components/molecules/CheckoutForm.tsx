import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Divider,
  message,
  Modal,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { SUBSCRIBE } from "../../api/mutations";
import {
  AccountAccountStatus,
  PlanInterval,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import {
  INVOICES,
  MY_ACCOUNT,
  MY_PAYMENT_METHODS,
  SUBSCRIPTIONS,
  UPCOMING_INVOICE,
} from "../../api/queries";
import { Subscribe, SubscribeVariables } from "../../api/types/Subscribe";
import { normalice } from "../../lib/normalice";
import connectionToNodes from "../../lib/connectionToNodes";

import { Loading, LoadingFullScreen } from "../atoms";
import { ICreditCardStripe } from "./CreditCard";
import { PaymentMethod } from "../organisms";
import { CheckoutLocationState } from "../../pages/client/Checkout";

const { confirm } = Modal;
const { Title, Text } = Typography;

interface CheckoutFormProps {
  onSubscribed: (status: SubscriptionStatus | undefined) => void;
  plan: CheckoutLocationState;
}

const CheckoutForm = ({ onSubscribed, plan }: CheckoutFormProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const [paymentMethodId, setPaymentMethodId] = useState<string | null>();
  const { data: dataAccount, loading: loadingAccount } =
    useQuery<MyAccount>(MY_ACCOUNT);
  const { data: paymentMethods, loading: loadingPayments } =
    useQuery<MyPaymentMethods>(MY_PAYMENT_METHODS);
  const [createSubscription, { loading: subscribing }] = useMutation<
    Subscribe,
    SubscribeVariables
  >(SUBSCRIBE, {
    refetchQueries: [
      { query: INVOICES, variables: { userId: dataAccount?.me?.id ?? "" } },
      { query: MY_PAYMENT_METHODS },
      {
        query: SUBSCRIPTIONS,
        variables: { userId: dataAccount?.me?.id ?? "" },
      },
      {
        query: UPCOMING_INVOICE,
        variables: {
          cId: dataAccount?.me?.id ?? "",
          sId: dataAccount?.me?.subscription?.id ?? "",
        },
      },
    ],
  });
  useEffect(() => {
    setPaymentMethodId(
      paymentMethods?.me?.customer?.defaultPaymentMethod?.stripeId
    );
    return () => {
      setPaymentMethodId(null);
    };
  }, [paymentMethods]);
  const card: ICreditCardStripe | undefined =
    (paymentMethods?.me?.customer?.paymentMethods &&
      paymentMethods?.me?.customer?.defaultPaymentMethod &&
      JSON.parse(
        normalice(
          connectionToNodes(paymentMethods?.me?.customer?.paymentMethods).find(
            (payment) =>
              payment.stripeId ===
              paymentMethods?.me?.customer?.defaultPaymentMethod?.stripeId
          )?.card
        )!!
      )) ||
    undefined;
  const expired = card
    ? new Date(card?.exp_year, card?.exp_month) < new Date()
    : false;
  const interval = JSON.parse(normalice(plan.recurring)).interval.toUpperCase();

  if (loadingAccount || loadingPayments) return <Loading />;

  return (
    <Row gutter={[20, 20]}>
      <Col sm={24} md={16}>
        <Title level={2}>{t("client:selectPaymentMethod")}</Title>
        <PaymentMethod
          customer={paymentMethods?.me?.customer}
          onCreated={setPaymentMethodId}
          userId={dataAccount?.me?.id!!}
        />
      </Col>
      <Col sm={24} md={8}>
        <Row gutter={[20, 20]}>
          <Card style={{ width: "100%" }}>
            <Col span={24}>
              <Row>
                <Title level={2}>{t("client:yourPayment")}</Title>
              </Row>
              <Divider />
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text>{t("plan")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {plan.name}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Text>{t("renewal")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {interval === PlanInterval.DAY
                    ? t("daily")
                    : interval === PlanInterval.WEEK
                    ? t("weekly")
                    : interval === PlanInterval.MONTH
                    ? t("monthly")
                    : interval === PlanInterval.YEAR
                    ? t("annual")
                    : "-"}
                </Text>
              </Row>
              <Divider />
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginBottom: 5,
                }}
              >
                <Text>{t("raw")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {plan.unitAmount
                    ? (plan.unitAmount / 100 / 1.21)
                        .toFixed(2)
                        .replace(/\./g, ",")
                    : "-"}
                  {" €"}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                }}
              >
                <Text>{t("taxes")}:</Text>
                <Text style={{ margin: 0, padding: 0 }} strong>
                  {plan.unitAmount
                    ? (plan.unitAmount / 100 - plan.unitAmount / 100 / 1.21)
                        .toFixed(2)
                        .replace(/\./g, ",")
                    : "-"}
                  {" €"}
                </Text>
              </Row>
              <Row
                style={{
                  alignItems: "flex-end",
                  justifyContent: "space-between",
                  marginTop: 20,
                }}
              >
                <Text>{t("total")}:</Text>
                <Title style={{ margin: 0, padding: 0 }} level={4}>
                  {plan.unitAmount
                    ? (plan.unitAmount / 100).toFixed(2).replace(/\./g, ",")
                    : "-"}
                  {" €"}
                </Title>
              </Row>
              <Divider />
            </Col>
            <Col span={24}>
              {paymentMethodId && !expired ? (
                <Button
                  onClick={() => {
                    if (dataAccount?.me?.id) {
                      confirm({
                        title: t("client:warnings.confirmSubscription"),
                        icon: <ExclamationCircleOutlined />,
                        onOk: () => {
                          createSubscription({
                            variables: {
                              paymentMethodId,
                              priceId: plan.stripeId!!,
                            },
                            update(cache, { data }) {
                              if (data?.subscribe?.ok) {
                                onSubscribed(
                                  data.subscribe.subscription?.status
                                );
                                cache.modify({
                                  id: cache.identify({
                                    ...dataAccount.me,
                                  }),
                                  fields: {
                                    accountStatus: () =>
                                      data.subscribe?.accountStatus ||
                                      AccountAccountStatus.REGISTERED,
                                    subscription: () =>
                                      data.subscribe?.subscription,
                                  },
                                });
                              } else {
                                message.error(
                                  t(
                                    `client:errors.${data?.subscribe?.error}`,
                                    t("error")
                                  ),
                                  4
                                );
                              }
                            },
                          });
                        },
                      });
                    }
                  }}
                  type="primary"
                  size="large"
                >
                  {t("client:confirmSubscription")}
                </Button>
              ) : (
                <Tooltip
                  title={
                    paymentMethodId
                      ? t("client:confirmSubscriptionDisabledInvalid")
                      : t("client:confirmSubscriptionDisabledMethod")
                  }
                >
                  <Button disabled={!(paymentMethodId && !expired)}>
                    {t("client:confirmSubscription")}
                  </Button>
                </Tooltip>
              )}
            </Col>
          </Card>
        </Row>
      </Col>
      {subscribing && <LoadingFullScreen tip={t("client:subscribing")} />}
    </Row>
  );
};

export default CheckoutForm;
