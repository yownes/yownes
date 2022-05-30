import React, { useState } from "react";
import { Button, Checkbox, Col, Form, Row } from "antd";
import type { FormInstance } from "antd";
import { useMutation } from "@apollo/client";
import i18n from "i18next";
import { useTranslation } from "react-i18next";

import { CREATE_PAYMENT_METHOD } from "../../api/mutations";
import type {
  CreatePaymentMethod,
  CreatePaymentMethodVariables,
} from "../../api/types/CreatePaymentMethod";
import { TextField } from "../atoms";
import { Errors } from "../molecules";

interface CreateCreditCardProps {
  onCancel: () => void;
  onCreated: (paymentMethod: string | undefined, isDefault: boolean) => void;
  form?: FormInstance;
  userId: string;
}

const CreateCreditCard = ({
  onCancel,
  onCreated,
  form,
  userId,
}: CreateCreditCardProps) => {
  const [errs, setErrs] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const { t } = useTranslation(["translation", "client"]);

  const [createPayment, { loading: creating }] = useMutation<
    CreatePaymentMethod,
    CreatePaymentMethodVariables
  >(CREATE_PAYMENT_METHOD);

  return (
    <Form
      form={form}
      onChange={() => setErrs("")}
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
            userId: userId,
          },
          update(cache, { data }) {
            if (data?.createPaymentMethod?.error) {
              setErrs(
                t(
                  `client:errors.${data?.createPaymentMethod?.error}`,
                  t("error")
                )
              );
              i18n.exists(`client:errors.${data?.createPaymentMethod?.error}`)
                ? setErrs(
                    t(`client:errors.${data?.createPaymentMethod?.error}`)
                  )
                : setErrs(data.createPaymentMethod.error);
            } else {
              onCreated(data?.createPaymentMethod?.id ?? "", isDefault);
            }
          },
        });
      }}
      validateMessages={{ required: t("client:requiredInput") }}
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
