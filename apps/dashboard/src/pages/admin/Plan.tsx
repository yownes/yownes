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
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { UPDATE_PLAN } from "../../api/mutations";
import { PLAN, PLANS } from "../../api/queries";
import { Plan as IPlan, PlanVariables } from "../../api/types/Plan";
import { Plans as IPlans } from "../../api/types/Plans";
import { UpdatePlan, UpdatePlanVariables } from "../../api/types/UpdatePlan";
import connectionToNodes from "../../lib/connectionToNodes";

import { Loading, LoadingFullScreen } from "../../components/atoms";
import { PricesInfo } from "../../components/molecules";

const { Option } = Select;
const { Title } = Typography;

interface PlanProps {
  id: string;
}

interface FormProps {
  active: boolean;
  apps: number;
  description: string;
  features: string[];
  name: string;
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
    <div style={{ minWidth: 550 }}>
      <Card>
        <Title level={3}>{t("admin:planInfo")}</Title>
        <Form
          form={formPlan}
          initialValues={{
            active: planData?.product?.active,
            apps: JSON.parse(planData?.product?.metadata).allowed_apps || 1,
            description: planData?.product?.description,
            features: connectionToNodes(planData?.product?.features).map(
              (f) => f.id
            ),
            name: planData?.product?.name,
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
                        return `{\"allowed_apps\": \"${values.apps}\" }`;
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
                    t(`admin:errors.${data?.updatePlan?.error}`, t("error")),
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
                  {connectionToNodes(plansData?.features)?.map((feat) => (
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
            </Col>
          </Row>
          <Popconfirm
            title={t("client:saveChangesConfirm")}
            onConfirm={() => formPlan.submit()}
          >
            <Button type="primary">{t("client:saveChanges")}</Button>
          </Popconfirm>
        </Form>
        <div style={{ marginBottom: 20, marginTop: 30, minWidth: 500 }}>
          <PricesInfo product={planData?.product} />
        </div>
      </Card>
      {updating && <LoadingFullScreen tip={t("admin:updatingPlan")} />}
    </div>
  );
};

export default Plan;
