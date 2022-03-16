import React, { useState, useEffect } from "react";

import {
  Button,
  Divider,
  Form,
  FormInstance,
  Input,
  InputNumber,
  message,
  Select,
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

import { Errors, SmallCreditCard } from "../molecules";

import * as Countries from "../../data/countries.json";

message.config({ maxCount: 1 });
const { Option } = Select;

interface ICreditCard {
  brand: "visa" | "maestro" | "mastercard";
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

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PK_TEST);

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
  const { t, i18n } = useTranslation(["translation", "client"]);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";

  const normalizedBilling = payment.billingDetails
    ?.replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const billingData: IBillingDetails = JSON.parse(normalizedBilling ?? "{}");

  const normalizedCard = payment.card
    ?.replace(/None/g, "null")
    .replace(/True/g, "true")
    .replace(/False/g, "false")
    .replace(/'/g, '"');
  const cardData: ICreditCard = JSON.parse(normalizedCard ?? "{}");

  const normalizedMetadata = payment.metadata
    ? payment.metadata
        .replace(/None/g, "null")
        .replace(/True/g, "true")
        .replace(/False/g, "false")
        .replace(/'/g, '"')
    : "{}";
  const metadataData: IMetadata = JSON.parse(normalizedMetadata ?? "{}");

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
        email: billingData?.email,
        direction: billingData?.address?.line1,
        country: billingData?.address?.country,
        state: billingData?.address?.state,
        city: billingData?.address?.city,
        phone: billingData?.phone,
        documentId: metadataData.document_id,
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
                email: values.email,
                phone: values.phone,
                address: {
                  line1: values.direction,
                  city: values.city,
                  country: values.country,
                  state: values.state,
                },
              },
              card: {
                expMonth: values.month,
                expYear: values.year,
              },
              metadata: {
                documentId: values.documentId,
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
      <div style={{ display: "flex", justifyContent: "space-between" }}>
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
      <Divider />
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
