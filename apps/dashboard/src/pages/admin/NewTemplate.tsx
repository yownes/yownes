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
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { CREATE_TEMPLATE } from "../../api/mutations";
import {
  CreateTemplate,
  CreateTemplateVariables,
} from "../../api/types/CreateTemplate";

import { LoadingFullScreen, TextField } from "../../components/atoms";
import { ImageUpload } from "../../components/molecules";

import styles from "./NewTemplate.module.css";

const { Text, Title } = Typography;

const NewTemplate = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const [createTemplate, { loading: creating }] = useMutation<
    CreateTemplate,
    CreateTemplateVariables
  >(CREATE_TEMPLATE);

  return (
    <Row gutter={[24, 24]}>
      <Col
        xs={{ span: 22, offset: 1 }}
        sm={{ span: 20, offset: 2 }}
        md={{ span: 18, offset: 3 }}
        lg={{ span: 16, offset: 4 }}
      >
        <Card>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Title className={styles.title} level={2}>
                {t("admin:newTemplateInfo")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form
                form={form}
                initialValues={{
                  isActive: false,
                  previewImg: "",
                  name: "",
                  url: "",
                  snack: "",
                }}
                onFinish={(values) => {
                  createTemplate({
                    variables: { template: { ...values } },
                    update(cache, { data }) {
                      if (data?.createTemplate?.ok) {
                        cache.modify({
                          fields: {
                            templates(existing, { toReference }) {
                              return {
                                edges: [
                                  ...existing.edges,
                                  {
                                    __typename: "TemplateType",
                                    node: toReference({
                                      ...data.createTemplate?.template,
                                    }),
                                  },
                                ],
                              };
                            },
                          },
                        });
                        form.setFieldsValue({
                          isActive: false,
                          previewImg: "",
                          name: "",
                          url: "",
                          snack: "",
                        });
                        message.success(t("admin:createTemplateSuccessful"), 4);
                        history.push("/templates");
                      } else {
                        message.error(
                          t(
                            `admin:errors.${data?.createTemplate?.error}`,
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
                  <Col lg={15} span={24}>
                    <Row>
                      <Col span={24}>
                        <TextField
                          label={t("admin:templateName")}
                          name="name"
                          rules={[{ required: true }]}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <TextField label={t("admin:templateUrl")} name="url" />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <TextField label={t("admin:snack")} name="snack" />
                      </Col>
                    </Row>
                  </Col>
                  <Col lg={9} span={24}>
                    <Row>
                      <Col span={24}>
                        <Row>
                          <Col span={24}>
                            <Row justify="center">
                              <Col>
                                <Form.Item name="previewImg">
                                  <ImageUpload
                                    alt={t("admin:template")}
                                    confirmMessage={t("admin:warningTemplate")}
                                    onDeleteClicked={() => {
                                      form.setFieldsValue({ previewImg: null });
                                    }}
                                    size="large"
                                    uploadMessage={t("admin:uploadTemplate")}
                                  />
                                </Form.Item>
                              </Col>
                            </Row>
                          </Col>
                          <Col span={24}>
                            <Row justify="center">
                              <Col>
                                <Text
                                  className={styles.previewText}
                                  type="secondary"
                                >
                                  {t("preview")}
                                </Text>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Row>
                      <Col span={24}>
                        <div className={styles.activeContainer}>
                          <span>{t("admin:activeTemplate")}</span>
                          <Form.Item
                            className={styles.active}
                            name="isActive"
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
                          onConfirm={() => form.submit()}
                          title={t("admin:warningCreateTemplate")}
                        >
                          <Button type="primary">
                            {t("admin:createTemplate")}
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
        {creating && <LoadingFullScreen tip={t("admin:creatingTemplate")} />}
      </Col>
    </Row>
  );
};

export default NewTemplate;
