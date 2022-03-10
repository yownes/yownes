import React, { useState } from "react";
import { Button, Checkbox, Form, Input, Space } from "antd";
import { FormInstance } from "antd/lib/form";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, PaymentMethod, StripeError } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import { CardSection, Errors } from "../molecules";

const stripePromise = loadStripe("pk_test_RG1KlTBaXWs8pCamCoLixIIu00FTwuG937");

interface CreateCreditCardProps {
  onCreated: (
    paymentMethod: PaymentMethod | undefined,
    isDefault: boolean
  ) => void;
  form?: FormInstance;
}

const CreateCreditCardContainer = (props: CreateCreditCardProps) => {
  return (
    <Elements stripe={stripePromise}>
      <CreateCreditCard {...props} />
    </Elements>
  );
};

const CreateCreditCard = ({ onCreated, form }: CreateCreditCardProps) => {
  const [creating, setCreating] = useState(false);
  const [errs, setErrs] = useState<StripeError>();
  const [isDefault, setIsDefault] = useState(true);
  const stripe = useStripe();
  const elements = useElements();
  const { t } = useTranslation(["translation", "client"]);

  return (
    <Form
      form={form}
      validateMessages={{ required: t("client:requiredInput") }} // eslint-disable-line no-template-curly-in-string
      onFinish={async (values) => {
        setCreating(true);
        if (!stripe || !elements) {
          setCreating(false);
          return;
        }
        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
          setCreating(false);
          return;
        }
        const { error, paymentMethod } = await stripe.createPaymentMethod({
          type: "card",
          card: cardElement,
          billing_details: {
            name: values.name,
          },
        });
        if (error) {
          setCreating(false);
          setErrs(error);
        } else {
          setCreating(false);
          onCreated(paymentMethod, isDefault);
        }
      }}
    >
      <Form.Item
        name="name"
        rules={[{ required: true }]}
        label={t("fullName")}
        labelCol={{ span: 24 }}
      >
        <Input autoFocus placeholder={t("fullName")} />
      </Form.Item>
      <Form.Item
        name="card"
        rules={[{ required: true }]}
        label={t("client:cardDetails")}
        labelCol={{ span: 24 }}
      >
        <CardSection onChange={() => setErrs(undefined)} />
      </Form.Item>
      <Space direction="vertical" size="middle">
        <Checkbox
          defaultChecked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        >
          {t("client:defaultPaymentMethodWarning")}
        </Checkbox>
        <div style={{ marginBottom: 15 }}>
          <Errors
            errors={{
              nonFieldErrors: errs?.type
                ? [{ message: errs?.message || "", code: errs.type }]
                : undefined,
            }}
          />
        </div>
      </Space>
      <Space direction="vertical" size="middle">
        <Button
          loading={creating}
          htmlType="submit"
          type="primary"
          size="large"
        >
          {t("client:createPaymentMethod")}
        </Button>
      </Space>
    </Form>
  );
};

export default CreateCreditCardContainer;
