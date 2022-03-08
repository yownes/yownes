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
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router";

import { CREATE_TEMPLATE } from "../../api/mutations";
import {
  CreateTemplate,
  CreateTemplateVariables,
} from "../../api/types/CreateTemplate";

import { LoadingFullScreen } from "../../components/atoms";
import { ImageUpload } from "../../components/molecules";

const { Title } = Typography;

const NewTemplate = () => {
  const [form] = Form.useForm();
  const history = useHistory();
  const { t } = useTranslation(["translation", "admin"]);
  const [createTemplate, { loading: creating }] = useMutation<
    CreateTemplate,
    CreateTemplateVariables
  >(CREATE_TEMPLATE);

  return (
    <div style={{ minWidth: 300 }}>
      <Card>
        <Title level={3}>{t("admin:newTemplateInfo")}</Title>
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
          <Row gutter={[15, 15]}>
            <Col md={16} span={24}>
              <Form.Item
                name="name"
                rules={[{ required: true }]}
                label={t("name")}
              >
                <Input placeholder={t("name")} />
              </Form.Item>
              <Form.Item name="url" label={t("admin:templateUrl")}>
                <Input placeholder={t("admin:templateUrl")} />
              </Form.Item>
              <Form.Item name="snack" label={t("admin:snack")}>
                <Input placeholder={t("admin:snack")} />
              </Form.Item>
              <Form.Item
                name="isActive"
                label={t("isActive")}
                valuePropName="checked"
              >
                <Switch />
              </Form.Item>
            </Col>
            <Col md={8} span={24}>
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
          <Row gutter={[15, 15]}>
            <Popconfirm
              title={t("admin:warningCreateTemplate")}
              onConfirm={() => form.submit()}
            >
              <Button type="primary">{t("create")}</Button>
            </Popconfirm>
          </Row>
        </Form>
      </Card>
      {creating && <LoadingFullScreen tip={t("admin:creatingTemplate")} />}
    </div>
  );
};

export default NewTemplate;
