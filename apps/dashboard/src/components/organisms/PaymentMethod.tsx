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
  message,
  Tag,
} from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ADD_PAYMENT_METHOD, REMOVE_PAYMENT_METHOD } from "../../api/mutations";
import { CLIENT, MY_PAYMENT_METHODS } from "../../api/queries";
import type {
  AddPaymentMethod,
  AddPaymentMethodVariables,
} from "../../api/types/AddPaymentMethod";
import type {
  Client_user_customer,
  Client_user_customer_paymentMethods_edges_node,
} from "../../api/types/Client";
import type {
  MyPaymentMethods_me_customer,
  MyPaymentMethods_me_customer_paymentMethods_edges_node,
} from "../../api/types/MyPaymentMethods";
import type {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from "../../api/types/RemovePaymentMethod";
import connectionToNodes from "../../lib/connectionToNodes";
import { colors } from "../../lib/colors";
import { normalize } from "../../lib/normalize";
import { LoadingFullScreen } from "../atoms";
import { AlertWithLink, CreditCard } from "../molecules";
import type { ICreditCardStripe } from "../molecules/CreditCard";

import styles from "./PaymentMethod.module.css";

import { CreateCreditCard, EditCreditCard } from ".";

message.config({ maxCount: 1 });

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
  const { t } = useTranslation(["translation", "client"]);
  const [addPayment, { data: paymentData, loading: changing }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD, {
    refetchQueries: staff
      ? [{ query: CLIENT, variables: { id: userId } }]
      : [{ query: MY_PAYMENT_METHODS }],
  });
  const [removePaymentMethod, { data: removeData, loading: removing }] =
    useMutation<RemovePaymentMethod, RemovePaymentMethodVariables>(
      REMOVE_PAYMENT_METHOD
    );
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
        normalize(
          connectionToNodes(customer.paymentMethods).find(
            (payment) =>
              payment.stripeId === customer.defaultPaymentMethod.stripeId
          )?.card!
        )
      )) ||
    undefined;

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        {card && new Date(card.exp_year, card.exp_month) < new Date() && (
          <Row gutter={[24, 24]}>
            {staff ? (
              <Col>
                <Alert
                  message={t("expiredPayment.admin")}
                  showIcon
                  style={{ marginBottom: 20, marginTop: 24 }}
                  type="error"
                />
              </Col>
            ) : (
              <Col>
                <Alert
                  message={t("expiredPayment.message")}
                  showIcon
                  style={{ marginBottom: 20, marginTop: 4 }}
                  type="error"
                />
              </Col>
            )}
            <Col />
          </Row>
        )}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
              }}
            >
              {customer ? (
                customer?.paymentMethods.edges.length > 0 ? (
                  connectionToNodes(customer?.paymentMethods).map((node) => {
                    const creditcard: ICreditCardStripe = JSON.parse(
                      normalize(node.card!)
                    );
                    const expired =
                      new Date(creditcard.exp_year, creditcard.exp_month) <
                      new Date();
                    return (
                      <Card
                        bodyStyle={{
                          padding: 0,
                          marginBottom: 20,
                          marginTop: 4,
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
                            data={node.card!}
                            billing={node.billingDetails}
                          />
                        </div>
                        {node.stripeId !==
                        customer?.defaultPaymentMethod?.stripeId ? (
                          <div
                            style={{
                              alignItems: "center",
                              display: "flex",
                              flex: 1,
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              padding: "0px 7px",
                            }}
                          >
                            {!expired ? (
                              <Popconfirm
                                cancelButtonProps={{
                                  className: "button-default-default",
                                }}
                                onConfirm={(e) => {
                                  addPayment({
                                    variables: {
                                      isDefault: true,
                                      paymentMethodId: cardId!,
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
                                <Tag
                                  className={styles.clickable}
                                  onClick={() => setCardId(node.stripeId)}
                                >
                                  {t("client:asDefault")}
                                </Tag>
                              </Popconfirm>
                            ) : (
                              <Tag color={colors.tagRed}>
                                {t("expiredPayment.card")}
                              </Tag>
                            )}
                            <div>
                              <Button
                                className={styles.editIcon}
                                icon={<EditOutlined />}
                                onClick={() => {
                                  setPaymentMethod(node);
                                  setisModalUpdateOpen(true);
                                }}
                              />
                              <Popconfirm
                                cancelButtonProps={{
                                  className: "button-default-default",
                                }}
                                cancelText={t("cancel")}
                                okText={t("delete")}
                                onConfirm={() => {
                                  if (node.stripeId) {
                                    removePaymentMethod({
                                      variables: {
                                        paymentMethodId: node.stripeId,
                                      },
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
                                placement="left"
                                title={t("client:warnings.card")}
                              >
                                <Button
                                  className={styles.deleteIcon}
                                  danger
                                  icon={<DeleteOutlined />}
                                />
                              </Popconfirm>
                            </div>
                          </div>
                        ) : (
                          <div
                            style={{
                              alignItems: "center",
                              display: "flex",
                              flex: 1,
                              flexWrap: "wrap",
                              justifyContent: "space-between",
                              padding: "0px 7px",
                            }}
                          >
                            <Tag
                              color={expired ? colors.tagRed : colors.tagGreen}
                            >
                              {t("client:defaultCard")}
                              {expired && ` (${t("expiredPayment.expired")})`}
                            </Tag>
                            <Button
                              className={styles.editIcon}
                              icon={<EditOutlined />}
                              onClick={() => {
                                setPaymentMethod(node);
                                setisModalUpdateOpen(true);
                              }}
                            />
                          </div>
                        )}
                      </Card>
                    );
                  })
                ) : (
                  <Alert
                    message={t("noPaymentMethods")}
                    showIcon
                    type="warning"
                  />
                )
              ) : location.pathname === "/checkout" ? (
                <Alert message={t("noCustomer")} showIcon type="warning" />
              ) : staff ? (
                <div style={{ paddingTop: 20 }}>
                  <Alert
                    message={t("noPaymentMethodsAdmin")}
                    showIcon
                    type="warning"
                  />
                </div>
              ) : (
                <AlertWithLink
                  buttonText={t("client:subscribe")}
                  containerStyle={{ paddingLeft: 0 }}
                  message={[t("client:subscribeNowPayment")]}
                  link="/checkout"
                />
              )}
            </div>
          </Col>
        </Row>
      </Col>
      <Col span={24}>
        <Button
          className={
            !customer && location.pathname !== "/checkout"
              ? undefined
              : "button-default-primary"
          }
          disabled={!customer && location.pathname !== "/checkout"}
          onClick={() => setisModalCreateOpen(true)}
          type="ghost"
        >
          {t("client:addPaymentMethod")}
        </Button>
      </Col>
      <Modal
        centered
        destroyOnClose
        footer={null}
        onCancel={handleCancelCreate}
        title={t("client:addPaymentMethod")}
        visible={isModalCreateOpen}
      >
        <CreateCreditCard
          form={formCreate}
          onCancel={handleCancelCreate}
          onCreated={(pm, isDefault) => {
            if (customer) {
              addPayment({
                variables: {
                  isDefault: isDefault,
                  paymentMethodId: pm ?? "",
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
              message.error(t("noCustomerError"), 4);
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
            onCancel={handleCancelUpdate}
            onEdited={() => {
              setisModalUpdateOpen(false);
            }}
            payment={paymentMethod!}
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
