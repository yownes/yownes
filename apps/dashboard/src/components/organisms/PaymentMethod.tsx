import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Modal,
  Popconfirm,
  Row,
  Space,
  Typography,
  message,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { PaymentMethod as PaymentMethodType } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ADD_PAYMENT_METHOD, REMOVE_PAYMENT_METHOD } from "../../api/mutations";
import { CLIENT, MY_PAYMENT_METHODS } from "../../api/queries";

import {
  AddPaymentMethod,
  AddPaymentMethodVariables,
} from "../../api/types/AddPaymentMethod";
import {
  Client_user_customer,
  Client_user_customer_paymentMethods_edges_node,
} from "../../api/types/Client";
import {
  MyPaymentMethods_me_customer,
  MyPaymentMethods_me_customer_paymentMethods_edges_node,
} from "../../api/types/MyPaymentMethods";
import {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from "../../api/types/RemovePaymentMethod";
import connectionToNodes from "../../lib/connectionToNodes";
import { colors } from "../../lib/colors";

import { CreateCreditCard, EditCreditCard } from "./";
import { LoadingFullScreen } from "../atoms";
import { AlertWithLink, CreditCard, SelectableCreditCard } from "../molecules";

import { ICreditCardStripe } from "../molecules/CreditCard";

message.config({ maxCount: 1 });
const { Text } = Typography;

interface PaymentMethodProps {
  customer:
    | MyPaymentMethods_me_customer
    | Client_user_customer
    | null
    | undefined;
  onCreated?: (prop: string) => void;
  staff?: boolean;
  userId: string;
}

const PaymentMethod = ({
  customer,
  onCreated,
  staff,
  userId,
}: PaymentMethodProps) => {
  const location = useLocation();
  const [cardId, setCardId] = useState<string | null>(null);
  const [isModalCreateOpen, setisModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setisModalUpdateOpen] = useState(false);
  const [isAdded, setisAdded] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [selectedId, setSelectedId] = useState<string | undefined>(undefined);
  const { t } = useTranslation(["translation", "client"]);
  const [addPayment, { data: paymentData, loading: changing }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD, {
    refetchQueries: staff
      ? [{ query: CLIENT, variables: { id: userId } }]
      : [{ query: MY_PAYMENT_METHODS }],
  });
  const [
    removePaymentMethod,
    { data: removeData, loading: removing },
  ] = useMutation<RemovePaymentMethod, RemovePaymentMethodVariables>(
    REMOVE_PAYMENT_METHOD
  );
  const [tempPaymentMethod, setTempPaymentMethod] = useState<
    PaymentMethodType[] | undefined
  >([]);
  const [paymentMethod, setPaymentMethod] = useState<
    | MyPaymentMethods_me_customer_paymentMethods_edges_node
    | Client_user_customer_paymentMethods_edges_node
  >();
  const [formCreate] = Form.useForm();
  const [formUpdate] = Form.useForm();
  const handleCancelCreate = () => {
    setisModalCreateOpen(false);
    setTimeout(() => formCreate.resetFields(), 300);
  };
  const handleCancelUpdate = () => {
    setisModalUpdateOpen(false);
    setTimeout(() => formUpdate.resetFields(), 300);
  };
  useEffect(() => {
    if (paymentData?.addPaymentMethod?.ok) {
      if (isAdded) {
        formCreate.resetFields();
        message.success(t("client:addPaymentMethodSuccessful"), 4);
        setisAdded(false);
      }
      if (isUpdated) {
        setisModalUpdateOpen(false);
        formUpdate.resetFields();
        message.success(t("client:updatePaymentMethodSuccessful"), 4);
        setisUpdated(false);
      }
    }
  }, [formCreate, formUpdate, isAdded, isUpdated, paymentData, t]);
  useEffect(() => {
    if (removeData?.detachPaymentMethod?.ok) {
      message.success(t("client:removePaymentMethodSuccessful"), 4);
    }
  }, [removeData, t]);
  const card: ICreditCardStripe | undefined =
    (customer?.paymentMethods &&
      customer?.defaultPaymentMethod &&
      JSON.parse(
        connectionToNodes(customer?.paymentMethods)
          .find(
            (payment) =>
              payment.stripeId === customer?.defaultPaymentMethod?.stripeId
          )
          ?.card.replace(/None/g, "null")
          .replace(/True/g, "true")
          .replace(/False/g, "false")
          .replace(/'/g, '"')!!
      )) ||
    undefined;

  return (
    <Row gutter={[20, 20]}>
      <Col span={24}>
        {card && new Date(card.exp_year, card.exp_month) < new Date() && (
          <Row gutter={[20, 20]}>
            {staff ? (
              <Col>
                <Alert
                  message={t("expiredPayment.admin")}
                  showIcon
                  style={{ marginBottom: 24, marginTop: 8 }}
                  type="error"
                />
              </Col>
            ) : (
              <Col span={24}>
                <Alert
                  description={t("expiredPayment.help")}
                  message={t("expiredPayment.message")}
                  showIcon
                  style={{ marginBottom: 12, marginTop: 12 }}
                  type="error"
                />
              </Col>
            )}
            <Col></Col>
          </Row>
        )}
        <Space wrap>
          {customer ? (
            customer?.paymentMethods.edges.length > 0 ? (
              connectionToNodes(customer?.paymentMethods).map((node) => {
                const creditcard: ICreditCardStripe = JSON.parse(
                  node.card
                    .replace(/None/g, "null")
                    .replace(/True/g, "true")
                    .replace(/False/g, "false")
                    .replace(/'/g, '"')
                );
                return (
                  <Card
                    bodyStyle={{
                      padding: 0,
                      marginBottom: 10,
                    }}
                    bordered={false}
                    key={node.stripeId}
                  >
                    <div
                      style={{
                        border:
                          node.stripeId ===
                          customer?.defaultPaymentMethod?.stripeId
                            ? new Date(
                                creditcard.exp_year,
                                creditcard.exp_month
                              ) < new Date()
                              ? `1px solid ${colors.red}`
                              : `1px solid ${colors.green}`
                            : "1px solid #FFF",
                        borderRadius: 20,
                        marginBottom: 5,
                      }}
                    >
                      <CreditCard
                        data={node.card}
                        billing={node.billingDetails}
                      />
                    </div>
                    <Space size="middle">
                      {node.stripeId !==
                      customer?.defaultPaymentMethod?.stripeId ? (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                              setPaymentMethod(node);
                              setisModalUpdateOpen(true);
                            }}
                          />
                          <Popconfirm
                            cancelText={t("cancel")}
                            okText={t("delete")}
                            title={t("client:warnings.card")}
                            placement="topLeft"
                            onConfirm={() => {
                              if (node.stripeId) {
                                removePaymentMethod({
                                  variables: { paymentMethodId: node.stripeId },
                                  update(cache, { data: newData }) {
                                    if (
                                      newData?.detachPaymentMethod?.ok &&
                                      customer
                                    ) {
                                      cache.evict({
                                        id: cache.identify({
                                          ...node,
                                        }),
                                      });
                                      cache.gc();
                                    }
                                  },
                                });
                              }
                            }}
                          >
                            <Button danger icon={<DeleteOutlined />} />
                          </Popconfirm>
                          {new Date(
                            creditcard.exp_year,
                            creditcard.exp_month
                          ) >= new Date() && (
                            <Popconfirm
                              onConfirm={(e) => {
                                addPayment({
                                  variables: {
                                    isDefault: true,
                                    paymentMethodId: cardId!!,
                                    userId: userId,
                                  },
                                  update(cache, { data: newData }) {
                                    if (newData?.addPaymentMethod?.error) {
                                      message.error(
                                        t(
                                          `admin:errors.${newData?.addPaymentMethod?.error}`
                                        ),
                                        4
                                      );
                                    }
                                  },
                                });
                                setisUpdated(true);
                              }}
                              title={t("client:warnings.cardDefault")}
                            >
                              <Button onClick={() => setCardId(node.stripeId)}>
                                {t("client:asDefault")}
                              </Button>
                            </Popconfirm>
                          )}
                        </>
                      ) : (
                        <>
                          <Button
                            icon={<EditOutlined />}
                            onClick={() => {
                              setPaymentMethod(node);
                              setisModalUpdateOpen(true);
                            }}
                          />
                          <Text strong>({t("client:defaultCard")})</Text>
                        </>
                      )}
                    </Space>
                  </Card>
                );
              })
            ) : (
              <Alert message={t("noPaymentMethods")} showIcon type="warning" />
            )
          ) : location.pathname === "/checkout" ? (
            tempPaymentMethod &&
            tempPaymentMethod.map((temp) => (
              <>
                <Card
                  bodyStyle={{
                    padding: 0,
                    marginBottom: 10,
                  }}
                  bordered={false}
                  key={temp.id}
                >
                  <SelectableCreditCard
                    data={temp}
                    onSelected={() => setSelectedId(temp.id)}
                    selected={temp.id === selectedId}
                  />
                </Card>
              </>
            ))
          ) : staff ? (
            <Alert message={t("noPaymentMethods")} showIcon type="warning" />
          ) : (
            <AlertWithLink
              buttonText={t("client:subscribe")}
              containerStyle={{ paddingLeft: 0 }}
              message={[t("client:subscribeNowPayment")]}
              link="/checkout"
            />
          )}
        </Space>
      </Col>
      <Col span={24}>
        <Button
          disabled={!customer && location.pathname !== "/checkout"}
          onClick={() => setisModalCreateOpen(true)}
          type="primary"
        >
          {t("client:addPaymentMethod")}
        </Button>
      </Col>
      <Modal
        centered
        footer={null}
        onCancel={handleCancelCreate}
        title={t("client:addPaymentMethod")}
        visible={isModalCreateOpen}
      >
        <CreateCreditCard
          form={formCreate}
          onCreated={(paymentMethod, isDefault) => {
            if (customer) {
              addPayment({
                variables: {
                  isDefault: isDefault,
                  paymentMethodId: paymentMethod!!.id,
                  userId: userId,
                },
                update(cache, { data: newData }) {
                  if (newData?.addPaymentMethod?.error) {
                    message.error(
                      t(`admin:errors.${newData?.addPaymentMethod?.error}`),
                      4
                    );
                  }
                },
              });
            } else {
              if (paymentMethod) {
                onCreated && onCreated(paymentMethod.id);
                setTempPaymentMethod((tempPaymentMethod) => [
                  ...(tempPaymentMethod ?? []),
                  paymentMethod,
                ]);
                setSelectedId(paymentMethod.id);
                formCreate.resetFields();
              }
            }
            setisAdded(true);
            setisModalCreateOpen(false);
          }}
        />
      </Modal>
      <Modal
        centered
        destroyOnClose
        footer={null}
        onCancel={handleCancelUpdate}
        title={t("client:editPaymentMethod")}
        visible={isModalUpdateOpen}
      >
        {isModalUpdateOpen && (
          <EditCreditCard
            form={formUpdate}
            onEdited={() => {
              setisModalUpdateOpen(false);
            }}
            payment={paymentMethod!!}
            staff={staff}
            userId={userId}
          />
        )}
      </Modal>
      {changing && (
        <LoadingFullScreen
          tip={
            isAdded
              ? t("client:addingPaymentMethod")
              : t("client:updatingPaymentMethod")
          }
        />
      )}
      {removing && (
        <LoadingFullScreen tip={t("client:removingPaymentMethod")} />
      )}
    </Row>
  );
};

export default PaymentMethod;
