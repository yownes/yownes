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
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";

import { SUBSCRIBE } from "../../api/mutations";
import type { SubscriptionStatus } from "../../api/types/globalTypes";
import {
  AccountAccountStatus,
  PlanInterval,
} from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import type { MyPaymentMethods } from "../../api/types/MyPaymentMethods";
import {
  INVOICES,
  MY_ACCOUNT,
  MY_PAYMENT_METHODS,
  SUBSCRIPTIONS,
  UPCOMING_INVOICE,
} from "../../api/queries";
import type { Subscribe, SubscribeVariables } from "../../api/types/Subscribe";
import { currencySymbol } from "../../lib/currencySymbol";
import { normalize } from "../../lib/normalize";
import connectionToNodes from "../../lib/connectionToNodes";
import { Loading, LoadingFullScreen } from "../atoms";
import { PaymentMethod } from "../organisms";
import type { CheckoutLocationState } from "../../pages/client/Checkout";

import type { ICreditCardStripe } from "./CreditCard";
import styles from "./CheckoutForm.module.css";

const { confirm } = Modal;
const { Title, Text } = Typography;

interface CheckoutFormProps {
  onSubscribed: (status: SubscriptionStatus | undefined) => void;
  plan: CheckoutLocationState;
}

function handleInterval(interval: PlanInterval, t: TFunction) {
  switch (interval) {
    case PlanInterval.DAY:
      return t("daily");
    case PlanInterval.WEEK:
      return t("weekly");
    case PlanInterval.MONTH:
      return t("monthly");
    case PlanInterval.YEAR:
      return t("annual");
    default:
      return "-";
  }
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
        normalize(
          connectionToNodes(paymentMethods?.me?.customer?.paymentMethods).find(
            (payment) =>
              payment.stripeId ===
              paymentMethods?.me?.customer?.defaultPaymentMethod?.stripeId
          )?.card!
        )
      )) ||
    undefined;
  const expired = card
    ? new Date(card?.exp_year, card?.exp_month) < new Date()
    : false;
  const interval = JSON.parse(
    normalize(plan.recurring!)
  ).interval.toUpperCase();

  if (loadingAccount || loadingPayments) {
    return <Loading />;
  }

  return (
    <Row gutter={[24, 24]}>
      <Col sm={24} md={16}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("client:selectPaymentMethod")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <PaymentMethod
                customer={paymentMethods?.me?.customer}
                user={dataAccount?.me}
              />
            </Col>
          </Row>
        </Card>
      </Col>
      <Col sm={24} md={8}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.resumeTitle} level={2}>
                {t("client:yourPayment")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 8]}>
            <Col span={24}>
              <Row justify="space-between">
                <Text>{t("plan")}</Text>
                <Text className={styles.description} type="secondary">
                  {plan.name}
                </Text>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Text>{t("renewal")}</Text>
                <Text className={styles.description} type="secondary">
                  {handleInterval(interval, t)}
                </Text>
              </Row>
            </Col>
            <Col span={24}>
              <Divider className={styles.divider} />
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Text>{t("raw")}</Text>
                <Text className={styles.description} type="secondary">
                  {plan.unitAmount
                    ? (plan.unitAmount / 100 / 1.21)
                        .toFixed(2)
                        .replace(/\./g, ",")
                    : "-"}
                  {currencySymbol(plan.currency)}
                </Text>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="space-between">
                <Text>{t("taxes")}</Text>
                <Text className={styles.description} type="secondary">
                  {plan.unitAmount
                    ? (plan.unitAmount / 100 - plan.unitAmount / 100 / 1.21)
                        .toFixed(2)
                        .replace(/\./g, ",")
                    : "-"}
                  {currencySymbol(plan.currency)}
                </Text>
              </Row>
            </Col>
            <Col span={24}>
              <Row className={styles.total} justify="space-between">
                <Text>{t("total")}</Text>
                <Title className={styles.description} level={5}>
                  {plan.unitAmount
                    ? (plan.unitAmount / 100).toFixed(2).replace(/\./g, ",")
                    : "-"}
                  {currencySymbol(plan.currency)}
                </Title>
              </Row>
            </Col>
            <Col span={24}>
              <Row justify="end">
                {paymentMethodId && expired ? (
                  <Button
                    onClick={() => {
                      if (dataAccount?.me?.id) {
                        confirm({
                          cancelButtonProps: {
                            className: "button-default-default",
                          },
                          icon: <ExclamationCircleOutlined />,
                          onOk: () => {
                            createSubscription({
                              variables: {
                                paymentMethodId,
                                priceId: plan.stripeId!,
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
                            }).catch(() => message.error(t("unknownError"), 4));
                          },
                          title: t("client:warnings.confirmSubscription"),
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
                    <Button
                      disabled={!(paymentMethodId && !expired)}
                      type="primary"
                    >
                      {t("client:confirmSubscription")}
                    </Button>
                  </Tooltip>
                )}
              </Row>
            </Col>
          </Row>
        </Card>
      </Col>
      {subscribing && <LoadingFullScreen tip={t("client:subscribing")} />}
    </Row>
  );
};

export default CheckoutForm;
