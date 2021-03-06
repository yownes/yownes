import React, { useEffect, useState } from "react";
import { Button, Card, Col, Form, message, Row, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { UPDATE_CUSTOMER } from "../../api/mutations";
import { CLIENT, MY_ACCOUNT } from "../../api/queries";
import type { Client_user } from "../../api/types/Client";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type { MyAccount_me } from "../../api/types/MyAccount";
import type {
  UpdateCustomer,
  UpdateCustomerVariables,
} from "../../api/types/UpdateCustomer";
import { normalize } from "../../lib/normalize";
import { LoadingFullScreen, SelectField, TextField } from "../atoms";
import type { Option } from "../atoms/SelectField";
import { Errors } from "../molecules";
import * as Countries from "../../data/countries.json";

const { Title } = Typography;

enum Language {
  en = "en",
  es = "es",
  fr = "fr",
  ca = "ca",
  de = "de",
}

interface CustomerDataProps {
  customer: Client_user | MyAccount_me | null | undefined;
  onFinish?: () => void;
  staff?: boolean;
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

const CustomerData = ({ customer, onFinish, staff }: CustomerDataProps) => {
  const location = useLocation();
  const { t, i18n } = useTranslation(["translation", "client"]);
  const [errs, setErrs] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateCustomer, { data: updateData, loading: updating }] = useMutation<
    UpdateCustomer,
    UpdateCustomerVariables
  >(UPDATE_CUSTOMER, {
    refetchQueries: staff
      ? [{ query: CLIENT, variables: { id: customer?.id } }]
      : [{ query: MY_ACCOUNT }],
  });
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";
  const countries: Option[] = [];
  Object.entries(Countries.countries).map(([key, value]) =>
    countries.push({
      id: key,
      name: value[language] ?? value.es,
    })
  );

  const addressData: IAddress = JSON.parse(
    customer?.customer?.address
      ? normalize(customer.customer.address)
      : "{}" ?? "{}"
  );
  const metadataData: IMetadata = JSON.parse(
    customer?.customer?.metadata
      ? normalize(customer.customer.metadata)
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
  }, [isUpdated, location.pathname, onFinish, t, updateData]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Title level={2} style={{ paddingBottom: 24 }}>
            {t("client:customerData")}
          </Title>
          <Form
            initialValues={{
              email: customer?.customer?.email,
              name: customer?.customer?.name,
              documentId: metadataData.document_id,
              phone: customer?.customer?.phone,
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
                  userId: customer?.id ?? "",
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
                update(cache, { data }) {
                  if (data?.updateCustomer?.ok) {
                    setIsUpdated(true);
                  } else {
                    data?.updateCustomer?.error &&
                      setErrs(
                        t(
                          `client:errors.${data.updateCustomer.error}`,
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
                      defaultValue={customer?.customer?.name}
                      name="name"
                      rules={[{ required: true }]}
                      label={t("name")}
                    />
                  </Col>
                  <Col span={24} md={12}>
                    <TextField
                      defaultValue={customer?.customer?.email}
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
                      defaultValue={customer?.customer?.phone}
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
                    {/* <Form.Item
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
                    </Form.Item> */}
                    <SelectField
                      label={t("country")}
                      defaultEmpty
                      defaultValue={addressData.country}
                      name="country"
                      options={countries}
                      rules={[{ required: true }]}
                    />
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
              <Button
                disabled={
                  customer?.accountStatus === AccountAccountStatus.BANNED
                }
                htmlType="submit"
                type="primary"
              >
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
