import React, { useState, useEffect } from "react";
import { Button, Col, Form, message, Row } from "antd";
import type { FormInstance } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { UPDATE_PAYMENT_METHOD } from "../../api/mutations";
import { CLIENT, MY_PAYMENT_METHODS } from "../../api/queries";
import type { MyPaymentMethods_me_customer_paymentMethods_edges_node } from "../../api/types/MyPaymentMethods";
import type {
  UpdatePaymentMethod,
  UpdatePaymentMethodVariables,
} from "../../api/types/UpdatePaymentMethod";
import { normalize } from "../../lib/normalize";
import { TextField } from "../atoms";
import { Errors, SmallCreditCard } from "../molecules";

message.config({ maxCount: 1 });

interface ICreditCard {
  brand: "visa" | "maestro" | "mastercard" | "amex";
  checks: {
    address_line1_check?: string;
    address_postal_code_check?: string;
    cvc_check?: string;
  };
  exp_month: number;
  exp_year: number;
  last4: string;
}

interface IBillingDetails {
  name: string;
}

interface IMetadata {
  document_id?: string;
}

interface EditCreditCardProps {
  form?: FormInstance;
  payment: MyPaymentMethods_me_customer_paymentMethods_edges_node;
  onCancel: () => void;
  onEdited: () => void;
  staff?: boolean;
  userId: string;
}

const EditCreditCard = ({
  form,
  payment,
  onCancel,
  onEdited,
  staff,
  userId,
}: EditCreditCardProps) => {
  const [isUpdated, setIsUpdated] = useState(false);
  const [errs, setErrs] = useState("");
  const { t } = useTranslation(["translation", "client"]);

  const billingData: IBillingDetails = JSON.parse(
    normalize(payment.billingDetails) ?? "{}"
  );
  const cardData: ICreditCard = JSON.parse(
    payment.card ? normalize(payment.card) : "{}"
  );
  const metadataData: IMetadata = JSON.parse(
    payment.metadata ? normalize(payment.metadata) : "{}"
  );

  const [updatePaymentMethod, { data: dataUpdate, loading: loadingUpdate }] =
    useMutation<UpdatePaymentMethod, UpdatePaymentMethodVariables>(
      UPDATE_PAYMENT_METHOD,
      {
        refetchQueries: staff
          ? [{ query: CLIENT, variables: { id: userId } }]
          : [{ query: MY_PAYMENT_METHODS }],
      }
    );

  useEffect(() => {
    form?.setFieldsValue({
      month: cardData.exp_month,
      year: cardData.exp_year,
      name: billingData?.name,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (dataUpdate?.updatePaymentMethod?.ok && isUpdated) {
      onEdited();
      setIsUpdated(false);
      message.success(t("client:updatePaymentMethodSuccessful"), 4);
    }
  }, [dataUpdate, isUpdated, onEdited, t]);

  return (
    <Form
      form={form}
      initialValues={{
        month: cardData.exp_month,
        year: cardData.exp_year,
        name: billingData?.name,
      }}
      onChange={() => setErrs("")}
      onFinish={async (values) => {
        updatePaymentMethod({
          variables: {
            id: payment.id,
            paymentMethodId: payment.stripeId!,
            payment: {
              billingDetails: {
                name: values.name,
              },
              card: {
                expMonth: values.month,
                expYear: values.year,
              },
            },
          },
        })
          .then(({ data }) => {
            if (data?.updatePaymentMethod?.ok) {
              setIsUpdated(true);
            } else {
              data?.updatePaymentMethod?.error &&
                setErrs(data.updatePaymentMethod.error);
            }
          })
          .catch(() => setErrs(t("unknownError")));
      }}
      validateMessages={{ required: t("client:requiredInput") }}
    >
      <SmallCreditCard data={payment.card} />
      <TextField
        defaultValue={billingData?.name}
        label={t("fullName")}
        name="name"
        rules={[{ required: true }]}
      />
      <Row gutter={[24, 24]}>
        <Col span={12}>
          <TextField
            defaultValue={cardData.exp_month}
            label={t("monthHelp")}
            max={12}
            min={1}
            maxLength={2}
            minLength={1}
            name="month"
            rules={[{ required: true }]}
            type="number"
          />
        </Col>
        <Col span={12}>
          <TextField
            defaultValue={cardData.exp_year}
            label={t("yearHelp")}
            max={new Date().getFullYear() + 20}
            min={new Date().getFullYear()}
            maxLength={4}
            minLength={4}
            name="year"
            rules={[{ required: true }]}
            type="number"
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        {errs && (
          <Col span={24}>
            <Errors
              errors={{
                nonFieldErrors: errs
                  ? [{ message: errs ?? "", code: "error" }]
                  : undefined,
              }}
            />
          </Col>
        )}
        <Col span={24}>
          <Row gutter={[8, 24]} justify="end">
            <Col>
              <Button className="button-default-default" onClick={onCancel}>
                {t("cancel")}
              </Button>
            </Col>
            <Col>
              <Button
                loading={loadingUpdate}
                htmlType="submit"
                type="primary"
                size="large"
              >
                {t("client:updatePaymentMethod")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default EditCreditCard;
