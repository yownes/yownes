import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { UPDATE_CUSTOMER } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";
import {
  UpdateCustomer,
  UpdateCustomerVariables,
} from "../../api/types/UpdateCustomer";
import { normalize } from "../../lib/normalize";

import { Loading, LoadingFullScreen, TextField } from "../atoms";
import { Errors } from "../molecules";

import * as Countries from "../../data/countries.json";

const { Option } = Select;
const { Title } = Typography;

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

interface CustomerDataProps {
  onFinish?: () => void;
}

interface IAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface IMetadata {
  document_id?: string;
}

const CustomerData = ({ onFinish }: CustomerDataProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation(["translation", "client"]);
  const [errs, setErrs] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateCustomer, { data: updateData, loading: updating }] = useMutation<
    UpdateCustomer,
    UpdateCustomerVariables
  >(UPDATE_CUSTOMER, { refetchQueries: [{ query: MY_ACCOUNT }] });
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";

  const addressData: IAddress = JSON.parse(
    data?.me?.customer?.address
      ? normalize(data.me.customer.address)
      : "{}" ?? "{}"
  );
  const metadataData: IMetadata = JSON.parse(
    data?.me?.customer?.metadata
      ? normalize(data.me.customer.metadata)
      : "{}" ?? "{}"
  );

  useEffect(() => {
    if (updateData?.updateCustomer?.ok && isUpdated) {
      setIsUpdated(false);
      if (location.pathname !== "/checkout") {
        message.success(t("updateCustomerSuccessful"), 4);
      } else {
        onFinish && onFinish();
      }
    }
  }, [updateData, isUpdated, t]);

  if (loading)
    return (
      <Card>
        <Title level={2}>{t("client:customerData")}</Title>
        <Loading />
      </Card>
    );

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title level={2} style={{ paddingBottom: 24 }}>
            {t("client:customerData")}
          </Title>
          <Form
            initialValues={{
              email: data?.me?.customer?.email,
              name: data?.me?.customer?.name,
              documentId: metadataData.document_id,
              phone: data?.me?.customer?.phone,
              location: addressData.line1,
              city: addressData.city,
              province: addressData.state,
              country: addressData.country,
            }}
            labelCol={{
              xs: { span: 24 },
              sm: { span: 9 },
              md: { span: 7 },
              lg: { span: 5 },
            }}
            onChange={() => setErrs("")}
            onFinish={(values) => {
              setErrs("");
              updateCustomer({
                variables: {
                  userId: data?.me?.id!!,
                  customer: {
                    billingDetails: {
                      email: values.email,
                      name: values.name,
                      phone: values.phone,
                      address: {
                        line1: values.location,
                        city: values.city,
                        country: values.country,
                        state: values.province,
                      },
                    },
                    metadata: {
                      documentId: values.documentId,
                    },
                  },
                },
                update(cache, { data: customerData }) {
                  if (customerData?.updateCustomer?.ok) {
                    setIsUpdated(true);
                  } else {
                    customerData?.updateCustomer?.error &&
                      setErrs(
                        t(
                          `client:errors.${customerData.updateCustomer.error}`,
                          t("error")
                        )
                      );
                  }
                },
              });
            }}
            validateMessages={{ required: t("client:requiredInput") }}
          >
            <Row>
              <Col span={24}>
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={data?.me?.customer?.name}
                      name="name"
                      rules={[{ required: true }]}
                      label={t("name")}
                    />
                  </Col>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={data?.me?.customer?.email}
                      label={t("email")}
                      name="email"
                      rules={[{ required: true }]}
                    />
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={metadataData.document_id}
                      label={t("documentId")}
                      name="documentId"
                      rules={[{ required: true }]}
                    />
                  </Col>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={data?.me?.customer?.phone}
                      label={t("phone")}
                      name="phone"
                      rules={[{ required: true }]}
                    />
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col span={24}>
                    <TextField
                      defaultValue={addressData.line1}
                      label={t("location")}
                      name="location"
                      rules={[{ required: true }]}
                    />
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={addressData.city}
                      label={t("city")}
                      name="city"
                      rules={[{ required: true }]}
                    />
                  </Col>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={addressData.state}
                      label={t("province")}
                      name="province"
                      rules={[{ required: true }]}
                    />
                  </Col>
                </Row>
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <Form.Item
                      name="country"
                      rules={[{ required: true }]}
                      label={t("country")}
                    >
                      <Select
                        defaultValue={addressData.country}
                        optionFilterProp="children"
                        showSearch
                      >
                        {Object.entries(Countries.countries).map(
                          ([key, value]) => (
                            <Option key={key} value={key}>
                              {value[language] ?? value.es}
                            </Option>
                          )
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>
              </Col>
            </Row>
            {errs && (
              <div style={{ paddingBottom: 24 }}>
                <Errors
                  errors={{
                    nonFieldErrors: errs
                      ? [{ message: errs ?? "", code: "error" }]
                      : undefined,
                  }}
                />
              </div>
            )}
            {location.pathname !== "/checkout" ? (
              <Button htmlType="submit" type="primary">
                {t("save")}
              </Button>
            ) : (
              <Row justify="end">
                <Button
                  disabled={updating}
                  loading={updating}
                  htmlType="submit"
                  type="primary"
                >
                  {t("pay")}
                </Button>
              </Row>
            )}
          </Form>
        </Card>
      </Col>
      {updating && location.pathname !== "/checkout" && (
        <LoadingFullScreen tip={t("savingChanges")} />
      )}
    </Row>
  );
};

export default CustomerData;
