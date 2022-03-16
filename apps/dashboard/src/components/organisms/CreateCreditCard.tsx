import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Form,
  Input,
  Select,
  Space,
  FormInstance,
} from "antd";
import {
  CardElement,
  Elements,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { loadStripe, PaymentMethod, StripeError } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import { CardSection, Errors } from "../molecules";

import * as Countries from "../../data/countries.json";

const { Option } = Select;

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

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
  const { t, i18n } = useTranslation(["translation", "client"]);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";

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
            address: {
              city: values.city,
              country: values.country,
              line1: values.direction,
              state: values.state,
            },
            email: values.email,
            name: values.name,
            phone: values.phone ?? null,
          },
          metadata: { document_id: values.documentId },
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
      <Form.Item name="name" rules={[{ required: true }]} label={t("fullName")}>
        <Input autoFocus placeholder={t("fullName")} />
      </Form.Item>
      <Form.Item name="email" rules={[{ required: true }]} label={t("email")}>
        <Input placeholder={t("email")} type="email" />
      </Form.Item>
      <Form.Item
        name="direction"
        rules={[{ required: true }]}
        label={t("location")}
      >
        <Input placeholder={t("location")} />
      </Form.Item>
      <Form.Item
        name="country"
        rules={[{ required: true }]}
        label={t("country")}
      >
        <Select
          optionFilterProp="children"
          placeholder={t("country")}
          showSearch
        >
          {Object.entries(Countries.countries).map(([key, value]) => (
            <Option key={key} value={key}>
              {value[language] ?? value.es}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        name="state"
        rules={[{ required: true }]}
        label={t("province")}
      >
        <Input placeholder={t("province")} />
      </Form.Item>
      <Form.Item name="city" rules={[{ required: true }]} label={t("city")}>
        <Input placeholder={t("city")} />
      </Form.Item>
      <Form.Item name="phone" label={t("phone")}>
        <Input placeholder={t("phone")} />
      </Form.Item>
      <Form.Item name="documentId" label={t("documentId")}>
        <Input placeholder={t("documentId")} />
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
