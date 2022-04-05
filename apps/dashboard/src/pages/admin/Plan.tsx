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
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { UPDATE_PLAN } from "../../api/mutations";
import { PLAN, PLANS } from "../../api/queries";
import { Plan as IPlan, PlanVariables } from "../../api/types/Plan";
import { Plans as IPlans } from "../../api/types/Plans";
import { UpdatePlan, UpdatePlanVariables } from "../../api/types/UpdatePlan";
import { colors } from "../../lib/colors";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalice } from "../../lib/normalice";

import { Loading, LoadingFullScreen } from "../../components/atoms";
import { PricesInfo } from "../../components/molecules";

import styles from "./Plan.module.css";

const { Group } = Radio;
const RButton = Radio.Button;
const { Option } = Select;
const { Title } = Typography;

interface PlanProps {
  id: string;
}

interface FormProps {
  active: boolean;
  apps: number;
  builds: number;
  description: string;
  features: string[];
  name: string;
  type: "particular" | "business";
}

const Plan = () => {
  const [formPlan] = Form.useForm<FormProps>();
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<PlanProps>();
  const { data: plansData, loading: loadingPlans } = useQuery<IPlans>(PLANS);
  const { data: planData, loading: loadingPlan } = useQuery<
    IPlan,
    PlanVariables
  >(PLAN, {
    variables: { id },
  });
  const [updatePlan, { loading: updating }] = useMutation<
    UpdatePlan,
    UpdatePlanVariables
  >(UPDATE_PLAN);

  if (loadingPlans || loadingPlan) return <Loading />;

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:planInfo")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form
                form={formPlan}
                initialValues={{
                  active: planData?.product?.active,
                  apps:
                    JSON.parse(normalice(planData?.product?.metadata!!))
                      .allowed_apps || 1,
                  builds:
                    JSON.parse(normalice(planData?.product?.metadata!!))
                      .allowed_builds || 1,
                  description: planData?.product?.description,
                  features: connectionToNodes(planData?.product?.features).map(
                    (f) => f.id
                  ),
                  name: planData?.product?.name,
                  type:
                    JSON.parse(normalice(planData?.product?.metadata!!))
                      .plan_type || "particular",
                }}
                onFinish={(values: FormProps) => {
                  const dataPlan = { ...planData?.product };
                  updatePlan({
                    variables: { id: id, plan: { ...values } },
                    update(cache, { data }) {
                      if (data?.updatePlan?.ok) {
                        cache.modify({
                          id: cache.identify({ ...dataPlan }),
                          fields: {
                            active() {
                              return values.active;
                            },
                            metadata() {
                              // eslint-disable-next-line no-useless-escape
                              return `{\"allowed_apps\": \"${values.apps}\", \"allowed_builds\": \"${values.builds}\", \"plan_type\": \"${values.type}\" }`;
                            },
                            description() {
                              return values.description;
                            },
                            features(existing, { toReference }) {
                              const edges = values.features.map((feature) => ({
                                __typename: "FeaturesTypeEdge",
                                node: toReference({
                                  __typename: "FeaturesType",
                                  id: feature,
                                }),
                              }));
                              return {
                                edges,
                              };
                            },
                            name() {
                              return values.name;
                            },
                            prices(existing) {
                              return existing;
                            },
                          },
                        });
                        message.success(t("admin:updatePlanSuccessful"), 4);
                      } else {
                        message.error(
                          t(
                            `admin:errors.${data?.updatePlan?.error}`,
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
                      label={t("name")}
                      name="name"
                      rules={[{ required: true }]}
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
                        {connectionToNodes(plansData?.features)?.map((feat) => (
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
                    <Popconfirm
                      title={t("client:saveChangesConfirm")}
                      onConfirm={() => formPlan.submit()}
                    >
                      <Button type="primary">{t("client:saveChanges")}</Button>
                    </Popconfirm>
                  </Col>
                </Row>
              </Form>
            </Col>
          </Row>
        </Card>
      </Col>
      <Col span={24}>
        <PricesInfo product={planData?.product} />
      </Col>
      {updating && <LoadingFullScreen tip={t("admin:updatingPlan")} />}
    </Row>
  );
};

export default Plan;
