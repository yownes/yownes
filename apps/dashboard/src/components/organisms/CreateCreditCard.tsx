import React, { useState } from "react";
import { Button, Checkbox, Col, Form, FormInstance, Row } from "antd";
import { useMutation } from "@apollo/client";
import { StripeError } from "@stripe/stripe-js";
import { useTranslation } from "react-i18next";

import { CREATE_PAYMENT_METHOD } from "../../api/mutations";
import {
  CreatePaymentMethod,
  CreatePaymentMethodVariables,
} from "../../api/types/CreatePaymentMethod";

import { TextField } from "../atoms";
import { Errors } from "../molecules";

interface CreateCreditCardProps {
  onCancel: () => void;
  onCreated: (paymentMethod: string | undefined, isDefault: boolean) => void;
  form?: FormInstance;
}

const CreateCreditCard = ({
  onCancel,
  onCreated,
  form,
}: CreateCreditCardProps) => {
  const [errs, setErrs] = useState<StripeError>();
  const [isDefault, setIsDefault] = useState(true);
  const { t } = useTranslation(["translation", "client"]);

  const [createPayment, { data: createData, loading: creating }] = useMutation<
    CreatePaymentMethod,
    CreatePaymentMethodVariables
  >(CREATE_PAYMENT_METHOD);

  return (
    <Form
      form={form}
      onChange={() => setErrs(undefined)}
      onFinish={async (values) => {
        createPayment({
          variables: {
            payment: {
              card: {
                number: values.number,
                expMonth: values.month,
                expYear: values.year,
                cvc: values.cvc,
              },
              billingDetails: {
                name: values.name,
              },
            },
          },
          update(cache, { data }) {
            if (data?.createPaymentMethod?.error) {
              setErrs(t(`admin:errors.${data?.createPaymentMethod?.error}`));
            } else {
              onCreated(data?.createPaymentMethod?.id ?? "", isDefault);
            }
          },
        });
      }}
      validateMessages={{ required: t("client:requiredInput") }} // eslint-disable-line no-template-curly-in-string
    >
      <TextField
        autofocus
        label={t("fullName")}
        name="name"
        rules={[{ required: true }]}
      />
      <TextField
        creditcard
        label={t("cardNumber")}
        maxLength={16}
        minLength={16}
        name="number"
        rules={[{ required: true }]}
      />
      <Row gutter={[24, 24]}>
        <Col span={9}>
          <TextField
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
        <Col span={9}>
          <TextField
            label={t("yearHelp")}
            min={new Date().getFullYear()}
            maxLength={4}
            minLength={4}
            name="year"
            rules={[{ required: true }]}
            type="number"
          />
        </Col>
        <Col span={6}>
          <TextField
            label={t("cvc")}
            max={999}
            maxLength={3}
            minLength={3}
            name="cvc"
            rules={[{ required: true }]}
            type="number"
          />
        </Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Checkbox
            defaultChecked={isDefault}
            onChange={(e) => setIsDefault(e.target.checked)}
          >
            {t("client:defaultPaymentMethodWarning")}
          </Checkbox>
        </Col>
        {errs && (
          <Col span={24}>
            <Errors
              errors={{
                nonFieldErrors: errs?.type
                  ? [{ message: errs?.message ?? "", code: errs.type }]
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
                loading={creating}
                htmlType="submit"
                type="primary"
                size="large"
              >
                {t("client:createPaymentMethod")}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
  );
};

export default CreateCreditCard;
