import React, { useEffect, useState } from "react";
import { Button, Card, message, Popconfirm, Tag } from "antd";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { ADD_PAYMENT_METHOD, REMOVE_PAYMENT_METHOD } from "../../api/mutations";
import { CLIENT, MY_PAYMENT_METHODS } from "../../api/queries";
import type {
  AddPaymentMethod,
  AddPaymentMethodVariables,
} from "../../api/types/AddPaymentMethod";
import type {
  Client_user,
  Client_user_customer,
  Client_user_customer_paymentMethods_edges_node,
} from "../../api/types/Client";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type { MyAccount_me } from "../../api/types/MyAccount";
import type { MyPaymentMethods_me_customer } from "../../api/types/MyPaymentMethods";
import type {
  RemovePaymentMethod,
  RemovePaymentMethodVariables,
} from "../../api/types/RemovePaymentMethod";
import { colors } from "../../lib/colors";
import { normalize } from "../../lib/normalize";
import { LoadingFullScreen } from "../atoms";

import type { ICreditCardStripe } from "./CreditCard";
import CreditCard from "./CreditCard";
import styles from "./SelectableCard.module.css";

interface SelectableCardProps {
  customer: MyPaymentMethods_me_customer | Client_user_customer;
  onEdit: () => void;
  payment: Client_user_customer_paymentMethods_edges_node;
  staff: boolean;
  user: MyAccount_me | Client_user | undefined;
}

function handleBorder(pId: string, dId: string, card: ICreditCardStripe) {
  if (pId === dId) {
    if (new Date(card.exp_year, card.exp_month) < new Date()) {
      return `1px solid ${colors.red}`;
    } else {
      return `1px solid ${colors.green}`;
    }
  } else {
    return "1px solid #FFF";
  }
}

const SelectableCard = ({
  customer,
  onEdit,
  payment,
  staff,
  user,
}: SelectableCardProps) => {
  const [cardId, setCardId] = useState<string>("");
  const [isUpdated, setisUpdated] = useState(false);
  const { t } = useTranslation(["translation", "client"]);

  const [addPayment, { data: paymentData, loading: changing }] = useMutation<
    AddPaymentMethod,
    AddPaymentMethodVariables
  >(ADD_PAYMENT_METHOD, {
    refetchQueries: staff
      ? [{ query: CLIENT, variables: { id: user?.id } }]
      : [{ query: MY_PAYMENT_METHODS }],
  });
  const [removePaymentMethod, { data: removeData, loading: removing }] =
    useMutation<RemovePaymentMethod, RemovePaymentMethodVariables>(
      REMOVE_PAYMENT_METHOD
    );

  const creditcard: ICreditCardStripe = JSON.parse(normalize(payment.card!));
  const expired =
    new Date(creditcard.exp_year, creditcard.exp_month) < new Date();

  useEffect(() => {
    if (paymentData?.addPaymentMethod?.ok) {
      if (isUpdated) {
        message.success(t("client:updatePaymentMethodSuccessful"), 4);
        setisUpdated(false);
      }
    }
  }, [isUpdated, paymentData, t]);
  useEffect(() => {
    if (removeData?.detachPaymentMethod?.ok) {
      message.success(t("client:removePaymentMethodSuccessful"), 4);
    }
  }, [removeData, t]);

  return (
    <Card
      bodyStyle={{
        padding: 0,
        marginBottom: 20,
        marginTop: 4,
      }}
      bordered={false}
      key={payment.stripeId}
    >
      <div
        style={{
          border: handleBorder(
            payment.stripeId ?? "",
            customer.defaultPaymentMethod?.stripeId ?? "",
            creditcard
          ),
          borderRadius: 20,
          marginBottom: 5,
        }}
      >
        <CreditCard data={payment.card!} billing={payment.billingDetails} />
      </div>
      {payment.stripeId !== customer.defaultPaymentMethod?.stripeId ? (
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
            <>
              {!staff &&
              user?.accountStatus ===
                AccountAccountStatus.BANNED ? undefined : (
                <Popconfirm
                  cancelButtonProps={{
                    className: "button-default-default",
                  }}
                  onConfirm={(e) => {
                    addPayment({
                      variables: {
                        isDefault: true,
                        paymentMethodId: cardId,
                        userId: user?.id ?? "",
                      },
                      update(cache, { data: newData }) {
                        if (newData?.addPaymentMethod?.error) {
                          message.error(
                            t(
                              `client:errors.${newData?.addPaymentMethod?.error}`
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
                    onClick={() =>
                      !staff &&
                      user?.accountStatus === AccountAccountStatus.BANNED
                        ? undefined
                        : setCardId(payment.stripeId ?? "")
                    }
                  >
                    {t("client:asDefault")}
                  </Tag>
                </Popconfirm>
              )}
            </>
          ) : (
            <Tag color={colors.tagRed}>{t("expiredPayment.card")}</Tag>
          )}
          {!staff &&
          user?.accountStatus === AccountAccountStatus.BANNED ? undefined : (
            <div>
              <Button
                className={styles.editIcon}
                icon={<EditOutlined />}
                onClick={onEdit}
              />
              <Popconfirm
                cancelButtonProps={{
                  className: "button-default-default",
                }}
                cancelText={t("cancel")}
                okText={t("delete")}
                onConfirm={() => {
                  if (payment.stripeId) {
                    removePaymentMethod({
                      variables: {
                        paymentMethodId: payment.stripeId,
                        userId: user?.id ?? "",
                      },
                      update(cache, { data: newData }) {
                        if (newData?.detachPaymentMethod?.ok && customer) {
                          cache.evict({
                            id: cache.identify({
                              ...payment,
                            }),
                          });
                          cache.gc();
                        }
                        if (newData?.detachPaymentMethod?.error) {
                          message.error(
                            t(
                              `client:errors.${newData?.detachPaymentMethod?.error}`
                            ),
                            4
                          );
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
          )}
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
          <Tag color={expired ? colors.tagRed : colors.tagGreen}>
            {t("client:defaultCard")}
            {expired && ` (${t("expiredPayment.expired")})`}
          </Tag>
          {!staff &&
          user?.accountStatus === AccountAccountStatus.BANNED ? undefined : (
            <Button
              className={styles.editIcon}
              icon={<EditOutlined />}
              onClick={onEdit}
            />
          )}
        </div>
      )}
      {changing && isUpdated && (
        <LoadingFullScreen tip={t("client:updatingPaymentMethod")} />
      )}
      {removing && (
        <LoadingFullScreen tip={t("client:removingPaymentMethod")} />
      )}
    </Card>
  );
};

export default SelectableCard;
