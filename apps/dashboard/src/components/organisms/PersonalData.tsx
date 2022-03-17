import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  Form,
  Input,
  message,
  Row,
  Select,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { UPDATE_CUSTOMER } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import { MyAccount } from "../../api/types/MyAccount";
import {
  UpdateCustomer,
  UpdateCustomerVariables,
} from "../../api/types/UpdateCustomer";
import { normalice } from "../../lib/normalice";

import { Loading, LoadingFullScreen } from "../atoms";
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

interface IAddress {
  line1?: string;
  city?: string;
  state?: string;
  country?: string;
}

interface IMetadata {
  document_id?: string;
}

const PersonalData = () => {
  const { t, i18n } = useTranslation(["translation", "client"]);
  const [errs, setErrs] = useState("");
  const [isUpdated, setIsUpdated] = useState(false);
  const [updateCustomer, { data: updateData, loading: updating }] = useMutation<
    UpdateCustomer,
    UpdateCustomerVariables
  >(UPDATE_CUSTOMER);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const country = i18n.language.split("-")[0] as Language;
  const language = Language[country] ?? "es";

  const addressData: IAddress = JSON.parse(
    data?.me?.customer?.address
      ? normalice(data.me.customer.address)
      : "{}" ?? "{}"
  );
  const metadataData: IMetadata = JSON.parse(
    data?.me?.customer?.metadata
      ? normalice(data.me.customer.metadata)
      : "{}" ?? "{}"
  );

  useEffect(() => {
    if (updateData?.updateCustomer?.ok && isUpdated) {
      setIsUpdated(false);
      message.success(t("updateCustomerSuccessful"), 4);
    }
  }, [updateData, isUpdated, t]);

  if (loading)
    return (
      <Card>
        <Title level={2}>{t("client:personalData")}</Title>
        <Loading />
      </Card>
    );

  return (
    <>
      {!data?.me?.verified && (
        <Row gutter={[20, 20]}>
          <Col span={24} style={{ minWidth: 550 }}>
            <Alert
              showIcon
              message={t("client:validate.message")}
              description={t("client:validate.description")}
              type="warning"
            />
          </Col>
          <Col></Col>
        </Row>
      )}
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <Title level={2}>{t("client:personalData")}</Title>
            <Form
              initialValues={{
                username: data?.me?.username,
                email: data?.me?.email,
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
              onFinish={(values) => {
                updateCustomer({
                  variables: {
                    userId: data?.me?.id!!,
                    customer: {
                      billing: {
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
                })
                  .then(({ data }) => {
                    if (data?.updateCustomer?.ok) {
                      setIsUpdated(true);
                    } else {
                      data?.updateCustomer?.error &&
                        setErrs(data.updateCustomer.error);
                    }
                  })
                  .catch((err) => setErrs(t("unknownError")));
              }}
              validateMessages={{ required: t("client:requiredInput") }}
            >
              <Form.Item
                name="username"
                rules={[{ required: true }]}
                label={t("username")}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="email"
                rules={[{ required: true }]}
                label={t("email")}
              >
                <Input disabled />
              </Form.Item>
              <Form.Item
                name="name"
                rules={[{ required: true }]}
                label={t("name")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="documentId"
                rules={[{ required: true }]}
                label={t("documentId")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="phone"
                rules={[{ required: true }]}
                label={t("phone")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="location"
                rules={[{ required: true }]}
                label={t("location")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="city"
                rules={[{ required: true }]}
                label={t("city")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="province"
                rules={[{ required: true }]}
                label={t("province")}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name="country"
                rules={[{ required: true }]}
                label={t("country")}
              >
                <Select optionFilterProp="children" showSearch>
                  {Object.entries(Countries.countries).map(([key, value]) => (
                    <Option key={key} value={key}>
                      {value[language] ?? value.es}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Errors
                errors={{
                  nonFieldErrors: errs
                    ? [{ message: errs || "", code: "error" }]
                    : undefined,
                }}
              />
              <Button
                htmlType="submit"
                type="primary"
                //disabled={loading}
                //loading={loading}
              >
                {t("save")}
              </Button>
            </Form>
          </Card>
        </Col>
        {updating && <LoadingFullScreen tip={t("savingChanges")} />}
      </Row>
    </>
  );
};

export default PersonalData;
