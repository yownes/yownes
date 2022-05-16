import type { ReactNode } from "react";
import React, { useEffect, useState } from "react";
import { Alert, Button, Col, Form, Modal, Row, message } from "antd";
import { useMutation } from "@apollo/client";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ADD_PAYMENT_METHOD } from "../../api/mutations";
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
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import { LoadingFullScreen } from "../atoms";
import { AlertWithLink, SelectableCard } from "../molecules";
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
  staff?: boolean;
  userId: string;
}

function handleCards(
  onEdit: (node: Client_user_customer_paymentMethods_edges_node) => void,
  staff: boolean,
  userId: string,
  t: TFunction,
  customer?: MyPaymentMethods_me_customer | Client_user_customer | null
) {
  if (customer) {
    if (customer.paymentMethods.edges.length > 0) {
      const cards: ReactNode[] = [];
      connectionToNodes(customer.paymentMethods).map((node) => {
        cards.push(
          <SelectableCard
            customer={customer}
            key={node.id}
            onEdit={() => onEdit(node)}
            payment={node}
            staff={staff}
            userId={userId}
          />
        );
      });
      return cards;
    } else {
      return <Alert message={t("noPaymentMethods")} showIcon type="warning" />;
    }
  } else {
    if (location.pathname === "/checkout") {
      return <Alert message={t("noCustomer")} showIcon type="warning" />;
    } else {
      if (staff) {
        return (
          <div className={styles.alertNoPaymentsAdmin}>
            <Alert
              message={t("noPaymentMethodsAdmin")}
              showIcon
              type="warning"
            />
          </div>
        );
      } else {
        return (
          <AlertWithLink
            buttonText={t("client:subscribe")}
            containerStyle={{ paddingLeft: 0 }}
            message={[t("client:subscribeNowPayment")]}
            link="/checkout"
          />
        );
      }
    }
  }
}

const PaymentMethod = ({ customer, staff, userId }: PaymentMethodProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const location = useLocation();
  const [isModalCreateOpen, setisModalCreateOpen] = useState(false);
  const [isModalUpdateOpen, setisModalUpdateOpen] = useState(false);
  const [isAdded, setisAdded] = useState(false);
  const [isUpdated, setisUpdated] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<
    | MyPaymentMethods_me_customer_paymentMethods_edges_node
    | Client_user_customer_paymentMethods_edges_node
  >();

  const [addPayment, { data: paymentData, loading: changing }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD, {
    refetchQueries: staff
      ? [{ query: CLIENT, variables: { id: userId } }]
      : [{ query: MY_PAYMENT_METHODS }],
  });

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
                  className={styles.alertAdmin}
                  message={t("expiredPayment.admin")}
                  showIcon
                  type="error"
                />
              </Col>
            ) : (
              <Col>
                <Alert
                  className={styles.alert}
                  message={t("expiredPayment.message")}
                  showIcon
                  type="error"
                />
              </Col>
            )}
            <Col />
          </Row>
        )}
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <div className={styles.cards}>
              {handleCards(
                (node) => {
                  setPaymentMethod(node);
                  setisModalUpdateOpen(true);
                },
                staff ?? false,
                userId,
                t,
                customer
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
    </Row>
  );
};

export default PaymentMethod;
