/* eslint-disable max-len */
import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  message,
  Popconfirm,
  Row,
  Switch,
  Typography,
} from "antd";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { UPDATE_PLAN } from "../../api/mutations";
import { PLAN, PLANS } from "../../api/queries";
import type { Plan as IPlan, PlanVariables } from "../../api/types/Plan";
import type { Plans as IPlans } from "../../api/types/Plans";
import type {
  UpdatePlan,
  UpdatePlanVariables,
} from "../../api/types/UpdatePlan";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import {
  Loading,
  LoadingFullScreen,
  MultiSelectField,
  SelectField,
  TextField,
} from "../../components/atoms";
import { PricesInfo } from "../../components/molecules";

import styles from "./Plan.module.css";

const { Title } = Typography;

interface PlanProps extends Record<string, string> {
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
    variables: { id: id ?? "" },
  });
  const [updatePlan, { loading: updating }] = useMutation<
    UpdatePlan,
    UpdatePlanVariables
  >(UPDATE_PLAN);

  if (loadingPlans || loadingPlan) {
    return <Loading />;
  }

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
                  apps: planData?.product?.metadata
                    ? JSON.parse(normalize(planData.product.metadata))
                        .allowed_apps || 1
                    : 1,
                  builds: planData?.product?.metadata
                    ? JSON.parse(normalize(planData.product.metadata))
                        .allowed_builds || 1
                    : 1,
                  description: planData?.product?.description,
                  features: connectionToNodes(planData?.product?.features).map(
                    (f) => f.id
                  ),
                  name: planData?.product?.name,
                  type: planData?.product
                    ? JSON.parse(normalize(planData.product.metadata!))
                        .plan_type || "particular"
                    : "particular",
                }}
                onFinish={(values: FormProps) => {
                  const dataPlan = { ...planData?.product };
                  updatePlan({
                    variables: { id: id ?? "", plan: { ...values } },
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
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <Row>
                      <Col span={24}>
                        <TextField
                          label={t("name")}
                          defaultValue={planData?.product?.name}
                          name="name"
                          rules={[{ required: true }]}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[24, 0]}>
                      <Col sm={12} span={24}>
                        <TextField
                          label={t("admin:nApps")}
                          defaultValue={
                            planData?.product?.metadata
                              ? JSON.parse(normalize(planData.product.metadata))
                                  .allowed_apps || 1
                              : 1
                          }
                          name="apps"
                          rules={[{ required: true }]}
                          type="number"
                        />
                      </Col>
                      <Col sm={12} span={24}>
                        <TextField
                          label={t("admin:nBuilds")}
                          defaultValue={
                            planData?.product?.metadata
                              ? JSON.parse(normalize(planData.product.metadata))
                                  .allowed_builds || 1
                              : 1
                          }
                          name="builds"
                          rules={[{ required: true }]}
                          type="number"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <MultiSelectField
                          defaultValue={connectionToNodes(
                            planData?.product?.features
                          ).map((f) => f.id)}
                          label={t("admin:features")}
                          name="features"
                          options={connectionToNodes(plansData?.features)}
                          wrapperClassName={styles.multiselect}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <SelectField
                          label={t("admin:planType")}
                          defaultValue={
                            planData?.product
                              ? JSON.parse(
                                  normalize(planData.product.metadata!)
                                ).plan_type || "particular"
                              : "particular"
                          }
                          name="type"
                          options={[
                            { id: "particular", name: t("admin:particular") },
                            { id: "business", name: t("admin:business") },
                          ]}
                          rules={[{ required: true }]}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24} md={12}>
                    <Row>
                      <Col span={24}>
                        <TextField
                          defaultValue={planData?.product?.description ?? ""}
                          label={t("description")}
                          name="description"
                          rows={9}
                          rules={[{ required: true }]}
                          type="textarea"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <div className={styles.activeContainer}>
                          <span>{t("admin:activePlan")}</span>
                          <Form.Item
                            className={styles.active}
                            name="active"
                            valuePropName="checked"
                          >
                            <Switch />
                          </Form.Item>
                        </div>
                      </Col>
                    </Row>
                  </Col>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <Popconfirm
                          cancelButtonProps={{
                            className: "button-default-default",
                          }}
                          onConfirm={() => formPlan.submit()}
                          title={t("client:saveChangesConfirm")}
                        >
                          <Button type="primary">
                            {t("client:saveChanges")}
                          </Button>
                        </Popconfirm>
                      </Col>
                    </Row>
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
