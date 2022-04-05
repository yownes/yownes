import React from "react";
import {
  Button,
  Card,
  Col,
  Form,
  Input,
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
import {
  Template as ITemplate,
  TemplateVariables,
} from "../../api/types/Template";
import {
  UpdateTemplate,
  UpdateTemplateVariables,
} from "../../api/types/UpdateTemplate";

import { Loading, LoadingFullScreen } from "../../components/atoms";
import { ImageUpload } from "../../components/molecules";

import styles from "./Template.module.css";

const { Title } = Typography;

interface TemplateProps {
  id: string;
}

const Template = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<TemplateProps>();
  const { data, loading } = useQuery<ITemplate, TemplateVariables>(TEMPLATE, {
    variables: { id },
  });
  const [updateTemplate, { loading: updating }] = useMutation<
    UpdateTemplate,
    UpdateTemplateVariables
  >(UPDATE_TEMPLATE);

  if (loading) return <Loading />;

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
                    variables: { id: id, template: { ...values } },
                    update(cache, { data }) {
                      if (data?.updateTemplate?.ok) {
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
                            `admin:errors.${data?.updateTemplate?.error}`,
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
                  <Col lg={15} span={24}>
                    <Form.Item
                      name="name"
                      rules={[{ required: true }]}
                      label={t("admin:templateName")}
                    >
                      <Input placeholder={t("admin:templateName")} />
                    </Form.Item>
                    <Form.Item name="url" label={t("admin:templateUrl")}>
                      <Input placeholder={t("admin:templateUrl")} />
                    </Form.Item>
                    <Form.Item name="snack" label={t("admin:snack")}>
                      <Input placeholder={t("admin:snack")} />
                    </Form.Item>
                    <Form.Item
                      name="isActive"
                      label={t("admin:activeTemplate")}
                      valuePropName="checked"
                    >
                      <Switch />
                    </Form.Item>
                  </Col>
                  <Col lg={9} span={24}>
                    <Row justify="start">
                      <Form.Item name="previewImg" label={t("preview")}>
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
                    </Row>
                  </Col>
                </Row>
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Popconfirm
                      title={t("client:saveChangesConfirm")}
                      onConfirm={() => form.submit()}
                    >
                      <Button type="primary">{t("client:saveChanges")}</Button>
                    </Popconfirm>
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
