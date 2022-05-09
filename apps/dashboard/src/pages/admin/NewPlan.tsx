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
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { CREATE_PLAN } from "../../api/mutations";
import { PLANS } from "../../api/queries";
import type {
  CreatePlan,
  CreatePlanVariables,
} from "../../api/types/CreatePlan";
import type { Plans } from "../../api/types/Plans";
import connectionToNodes from "../../lib/connectionToNodes";
import {
  Loading,
  LoadingFullScreen,
  MultiSelectField,
  SelectField,
  TextField,
} from "../../components/atoms";

import styles from "./NewPlan.module.css";

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

  if (loading) {
    return <Loading />;
  }

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
                <Row gutter={[24, 0]}>
                  <Col span={24} md={12}>
                    <Row>
                      <Col span={24}>
                        <TextField
                          label={t("name")}
                          name="name"
                          rules={[{ required: false }]}
                        />
                      </Col>
                    </Row>
                    <Row gutter={[24, 24]}>
                      <Col span={12}>
                        <TextField
                          defaultValue={1}
                          label={t("admin:nApps")}
                          name="apps"
                          rules={[{ required: true }]}
                          type="number"
                        />
                      </Col>
                      <Col span={12}>
                        <TextField
                          defaultValue={1}
                          label={t("admin:nBuilds")}
                          name="builds"
                          rules={[{ required: true }]}
                          type="number"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <MultiSelectField
                          label={t("admin:features")}
                          name="features"
                          options={connectionToNodes(plans?.features)}
                          wrapperClassName={styles.multiselect}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <SelectField
                          label={t("admin:planType")}
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
                      <Col className={styles.warning} span={24}>
                        <Text type="secondary">
                          {t("admin:warningNewPlan")}
                        </Text>
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
                          onConfirm={() => form.submit()}
                          title={t("admin:warningCreateNewPlan")}
                        >
                          <Button type="primary">
                            {t("admin:createPlan")}
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
      {creating && <LoadingFullScreen tip={t("admin:creatingPlan")} />}
    </Row>
  );
};

export default NewPlan;
