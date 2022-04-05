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
  Radio,
  Row,
  Select,
  Switch,
  Tag,
  Typography,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { CREATE_PLAN } from "../../api/mutations";
import { PLANS } from "../../api/queries";
import { CreatePlan, CreatePlanVariables } from "../../api/types/CreatePlan";
import { Plans } from "../../api/types/Plans";
import { colors } from "../../lib/colors";
import connectionToNodes from "../../lib/connectionToNodes";

import { Loading, LoadingFullScreen } from "../../components/atoms";

import styles from "./NewPlan.module.css";

const { Group } = Radio;
const RButton = Radio.Button;
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
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:newPlanInfo")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form
                form={form}
                initialValues={{
                  active: false,
                  apps: 1,
                  builds: 1,
                  description: "",
                  features: [],
                  name: "",
                  type: "particular",
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
                          builds: 1,
                          description: "",
                          features: [],
                          name: "",
                          type: "particular",
                        });
                        message.success(t("admin:createPlanSuccessful"), 4);
                        history.push("/planes");
                      } else {
                        message.error(
                          t(
                            `admin:errors.${data?.createPlan?.error}`,
                            t("error")
                          ),
                          4
                        );
                      }
                    },
                  });
                }}
                validateMessages={{ required: t("client:requiredInput") }}
              >
                <Row gutter={[16, 16]}>
                  <Col span={12}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true }]}
                      label={t("name")}
                    >
                      <Input placeholder={t("name")} />
                    </Form.Item>
                    <Form.Item
                      label={t("admin:nApps")}
                      name="apps"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        className={styles.inputNumber}
                        placeholder={t("admin:nApps")}
                      />
                    </Form.Item>
                    <Form.Item
                      label={t("admin:nBuilds")}
                      name="builds"
                      rules={[{ required: true }]}
                    >
                      <InputNumber
                        className={styles.inputNumber}
                        placeholder={t("admin:nBuilds")}
                      />
                    </Form.Item>
                    <Form.Item name="features" label={t("admin:features")}>
                      <Select
                        allowClear
                        mode="multiple"
                        placeholder={t("admin:features")}
                        showArrow
                        tagRender={(props) => (
                          <Tag
                            onMouseDown={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                            }}
                            closable={true}
                            onClose={props.onClose}
                            color={colors.tagGreen}
                            style={{ margin: "2px 4px" }}
                          >
                            {props.label}
                          </Tag>
                        )}
                      >
                        {connectionToNodes(plans?.features)?.map((feat) => (
                          <Option key={feat.id} value={feat.id}>
                            {feat.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                    <Form.Item label={t("admin:planType")} name="type">
                      <Group>
                        <RButton value="particular">
                          {t("admin:particular")}
                        </RButton>
                        <RButton value="business">
                          {t("admin:business")}
                        </RButton>
                      </Group>
                    </Form.Item>
                    <Form.Item
                      label={t("admin:activePlan")}
                      name="active"
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item
                      label={t("description")}
                      name="description"
                      rules={[{ required: true }]}
                    >
                      <Input.TextArea
                        placeholder={t("description")}
                        rows={12}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Text type="secondary">{t("admin:warningNewPlan")}</Text>
                  </Col>
                  <Col span={24}>
                    <Popconfirm
                      title={t("admin:warningCreateNewPlan")}
                      onConfirm={() => form.submit()}
                    >
                      <Button type="primary">{t("admin:createPlan")}</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
      {creating && <LoadingFullScreen tip={t("admin:creatingPlan")} />}
    </Row>
  );
};

export default NewPlan;
