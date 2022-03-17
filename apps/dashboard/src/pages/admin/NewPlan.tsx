import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
  InputNumber,
  message,
  Popconfirm,
  Row,
  Select,
  Switch,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { CREATE_PLAN } from "../../api/mutations";
import { PLANS } from "../../api/queries";
import { CreatePlan, CreatePlanVariables } from "../../api/types/CreatePlan";
import { Plans } from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";

import { Loading, LoadingFullScreen } from "../../components/atoms";

const { Option } = Select;
const { Text, Title } = Typography;

const NewPlan = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const { data: plans, loading } = useQuery<Plans>(PLANS);
  const [createPlan, { loading: creating }] = useMutation<
    CreatePlan,
    CreatePlanVariables
  >(CREATE_PLAN);

  if (loading) return <Loading />;

  return (
    <div style={{ minWidth: 300 }}>
      <Card>
        <Title level={2}>{t("admin:newPlanInfo")}</Title>
        <Form
          form={form}
          initialValues={{
            active: false,
            apps: 1,
            description: "",
            features: [],
            name: "",
          }}
          onFinish={(values) => {
            createPlan({
              variables: { plan: { ...values } },
              update(cache, { data }) {
                if (data?.createPlan?.ok) {
                  cache.modify({
                    fields: {
                      products(existing, { toReference }) {
                        return {
                          edges: [
                            ...existing.edges,
                            {
                              __typename: "StripeProductType",
                              node: toReference({
                                ...data.createPlan?.plan,
                              }),
                            },
                          ],
                        };
                      },
                    },
                  });
                  form.setFieldsValue({
                    active: false,
                    apps: 1,
                    description: "",
                    features: [],
                    name: "",
                  });
                  message.success(t("admin:createPlanSuccessful"), 4);
                  history.push("/planes");
                } else {
                  message.error(
                    t(`admin:errors.${data?.createPlan?.error}`, t("error")),
                    4
                  );
                }
              },
            });
          }}
          validateMessages={{ required: t("client:requiredInput") }}
        >
          <Row gutter={[15, 15]}>
            <Col span={24}>
              <Form.Item
                name="name"
                rules={[{ required: true }]}
                label={t("name")}
              >
                <Input placeholder={t("name")} />
              </Form.Item>
              <Form.Item
                name="description"
                rules={[{ required: true }]}
                label={t("description")}
              >
                <Input.TextArea placeholder={t("description")} />
              </Form.Item>
              <Form.Item
                name="apps"
                rules={[{ required: true }]}
                label={t("admin:nApps")}
              >
                <InputNumber placeholder={t("admin:nApps")} />
              </Form.Item>
              <Form.Item name="features" label={t("admin:features")}>
                <Select
                  allowClear
                  mode="multiple"
                  placeholder={t("admin:features")}
                >
                  {connectionToNodes(plans?.features)?.map((feat) => (
                    <Option key={feat.id} value={feat.id}>
                      {feat.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
              <Form.Item
                name="active"
                label={t("isActive")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
              <div style={{ marginBottom: 24 }}>
                <Text type="secondary">{t("admin:warningNewPlan")}</Text>
              </div>
            </Col>
          </Row>
          <Row gutter={[15, 15]}>
            <Popconfirm
              title={t("admin:warningCreateNewPlan")}
              onConfirm={() => form.submit()}
            >
              <Button type="primary">{t("create")}</Button>
            </Popconfirm>
          </Row>
        </Form>
      </Card>
      {creating && <LoadingFullScreen tip={t("admin:creatingPlan")} />}
    </div>
  );
};

export default NewPlan;
