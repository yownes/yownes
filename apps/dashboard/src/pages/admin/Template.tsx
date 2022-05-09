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
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { UPDATE_TEMPLATE } from "../../api/mutations";
import { TEMPLATE } from "../../api/queries";
import type {
  Template as ITemplate,
  TemplateVariables,
} from "../../api/types/Template";
import type {
  UpdateTemplate,
  UpdateTemplateVariables,
} from "../../api/types/UpdateTemplate";
import { Loading, LoadingFullScreen, TextField } from "../../components/atoms";
import { ImageUpload } from "../../components/molecules";

import styles from "./Template.module.css";

const { Text, Title } = Typography;

interface TemplateProps extends Record<string, string> {
  id: string;
}

const Template = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<TemplateProps>();
  const { data, loading } = useQuery<ITemplate, TemplateVariables>(TEMPLATE, {
    variables: { id: id ?? "" },
  });
  const [updateTemplate, { loading: updating }] = useMutation<
    UpdateTemplate,
    UpdateTemplateVariables
  >(UPDATE_TEMPLATE);

  if (loading) {
    return <Loading />;
  }

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
                {t("admin:templateInfo")}
              </Title>
            </Col>
          </Row>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Form
                form={form}
                initialValues={{
                  isActive: data?.template?.isActive,
                  previewImg: data?.template?.previewImg,
                  name: data?.template?.name,
                  url: data?.template?.url,
                  snack: data?.template?.snack,
                }}
                onFinish={(values) => {
                  const dataTemplate = { ...data?.template };
                  updateTemplate({
                    variables: { id: id ?? "", template: { ...values } },
                    update(cache, { data: update }) {
                      if (update?.updateTemplate?.ok) {
                        cache.modify({
                          id: cache.identify({ ...dataTemplate }),
                          fields: {
                            isActive() {
                              return values.isActive;
                            },
                            name() {
                              return values.name;
                            },
                            previewImg() {
                              return values.previewImg;
                            },
                            url() {
                              return values.url;
                            },
                            snack() {
                              return values.snack;
                            },
                          },
                        });
                        message.success(t("admin:updateTemplateSuccessful"), 4);
                      } else {
                        message.error(
                          t(
                            `admin:errors.${update?.updateTemplate?.error}`,
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
                          defaultValue={data?.template?.name}
                          name="name"
                          rules={[{ required: true }]}
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <TextField
                          label={t("admin:templateUrl")}
                          defaultValue={data?.template?.url ?? ""}
                          name="url"
                        />
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <TextField
                          label={t("admin:snack")}
                          defaultValue={data?.template?.name}
                          name="snack"
                        />
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
        {updating && <LoadingFullScreen tip={t("admin:updatingTemplate")} />}
      </Col>
    </Row>
  );
};

export default Template;
