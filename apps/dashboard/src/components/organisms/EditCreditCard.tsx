import React, { useState, useEffect } from "react";

import {
  Button,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Space,
} from "antd";
import { useMutation } from "@apollo/client";
import { Elements, useStripe } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import { UPDATE_PAYMENT_METHOD } from "../../api/mutations";
import { CLIENT, MY_PAYMENT_METHODS } from "../../api/queries";
import { MyPaymentMethods_me_customer_paymentMethods_edges_node } from "../../api/types/MyPaymentMethods";
import {
  UpdatePaymentMethod,
  UpdatePaymentMethodVariables,
} from "../../api/types/UpdatePaymentMethod";
import { normalice } from "../../lib/normalice";

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
  address: {
    city: string;
    country: string;
    line1: string;
    postal_code: string;
    state: string;
  };
  email: string;
  name: string;
  phone: string;
}

interface IMetadata {
  document_id?: string;
}

const stripePromise = loadStripe("pk_test_RG1KlTBaXWs8pCamCoLixIIu00FTwuG937");

interface EditCreditCardProps {
  form?: FormInstance;
  payment: MyPaymentMethods_me_customer_paymentMethods_edges_node;
  onEdited: () => void;
  staff?: boolean;
  userId: string;
}

const EditCreditCardContainer = (props: EditCreditCardProps) => {
  return (
    <Elements stripe={stripePromise}>
      <EditCreditCard {...props} />
    </Elements>
  );
};

const EditCreditCard = ({
  form,
  payment,
  onEdited,
  staff,
  userId,
}: EditCreditCardProps) => {
  const [isUpdated, setIsUpdated] = useState(false); // eslint-disable-next-line
  const [errs, setErrs] = useState("");
  const stripe = useStripe();
  const { t } = useTranslation(["translation", "client"]);

  const billingData: IBillingDetails = JSON.parse(
    normalice(payment.billingDetails) ?? "{}"
  );
  const cardData: ICreditCard = JSON.parse(
    payment.card ? normalice(payment.card) : "{}"
  );
  const metadataData: IMetadata = JSON.parse(
    payment.metadata ? normalice(payment.metadata) : "{}"
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
      email: billingData?.email,
      billingDirection: billingData?.address?.line1,
      country: billingData?.address?.country,
      province: billingData?.address?.state,
      city: billingData?.address?.city,
      phone: billingData?.phone,
      documentId: metadataData.document_id,
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
      validateMessages={{ required: t("client:requiredInput") }} // eslint-disable-line no-template-curly-in-string
      onFinish={async (values) => {
        if (!stripe) {
          console.log("!stripe");
          return;
        }
        updatePaymentMethod({
          variables: {
            id: payment.id,
            paymentMethodId: payment.stripeId!!,
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
          .catch((err) => setErrs(t("unknownError")));
      }}
      onFocus={() => setErrs("")}
    >
      <SmallCreditCard data={payment.card} />
      <Form.Item name="name" rules={[{ required: true }]} label={t("fullName")}>
        <Input autoFocus placeholder={t("fullName")} />
      </Form.Item>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: 24,
        }}
      >
        <Form.Item
          name="month"
          rules={[{ required: true }]}
          label={t("expiration")}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            max={12}
            min={1}
            placeholder={t("monthUp")}
            style={{ width: "100%" }}
          />
        </Form.Item>
        <Form.Item
          name="year"
          rules={[{ required: true }]}
          style={{ marginBottom: 0 }}
        >
          <InputNumber
            min={new Date().getFullYear()}
            placeholder={t("yearUp")}
            style={{ width: "100%" }}
          />
        </Form.Item>
      </div>
      <Errors
        errors={{
          nonFieldErrors: errs
            ? [{ message: errs || "", code: "error" }]
            : undefined,
        }}
      />
      <Space direction="vertical" size="middle">
        <Button
          loading={loadingUpdate}
          htmlType="submit"
          type="primary"
          size="large"
        >
          {t("client:updatePaymentMethod")}
        </Button>
      </Space>
    </Form>
  );
};

export default EditCreditCardContainer;
