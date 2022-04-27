import React, { useEffect } from "react";
import { Button, Col, Form, Row, Typography, message } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { PASSWORD_CHANGE } from "../../api/mutations";
import {
  PasswordChange,
  PasswordChangeVariables,
} from "../../api/types/PasswordChange";
import { useAuth } from "../../lib/auth";

import { LoadingFullScreen, TextField } from "../atoms";
import { Errors } from "../molecules";

const { Title } = Typography;

const ChangePassword = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation("client");
  const { setNewToken } = useAuth();
  const [passwordChange, { data, loading }] = useMutation<
    PasswordChange,
    PasswordChangeVariables
  >(PASSWORD_CHANGE);
  message.config({
    maxCount: 1,
  });
  if (data?.passwordChange?.success) {
    form.resetFields();
    message.success(t("changePasswordSuccessful"), 4);
  }
  useEffect(() => {
    console.log("form", form);
  }, [form]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Title level={2} style={{ paddingBottom: 24 }}>
          {t("changePassword")}
        </Title>
        <Errors
          errors={data?.passwordChange?.errors}
          fields={["oldPassword", "newPassword", "newPassword2"]}
        />
        <Form
          form={form}
          onFinish={(values) => {
            passwordChange({
              variables: {
                ...values,
              },
            }).then(({ data }) => {
              if (
                data?.passwordChange?.success &&
                data?.passwordChange?.token &&
                data?.passwordChange?.refreshToken
              ) {
                setNewToken?.(
                  data.passwordChange.token,
                  data.passwordChange.refreshToken
                );
              }
            });
          }}
          onErrorCapture={(e) => console.log("errorcapture", e)}
          onError={(e) => console.log("error", e)}
        >
          <Row>
            <Col span={24}>
              <TextField
                label={t("oldPassword")}
                name="oldPassword"
                error={form.getFieldError("oldPassword")}
                rules={[{ required: true, message: t("required.oldPassword") }]}
                type="password"
              />
            </Col>
          </Row>
          <Row gutter={[24, 0]}>
            <Col span={24} md={12}>
              <TextField
                label={t("newPassword")}
                name="newPassword1"
                rules={[
                  { required: true, message: t("required.newPassword") },
                  { min: 8, message: t("required.minPassword", { num: 8 }) },
                ]}
                type="password"
              />
            </Col>
            <Col span={24} md={12}>
              <TextField
                label={t("newPassword2")}
                name="newPassword2"
                rules={[
                  { required: true, message: t("required.newPassword2") },
                  { min: 8, message: t("required.minPassword", { num: 8 }) },
                ]}
                type="password"
              />
            </Col>
          </Row>
          <Button
            htmlType="submit"
            type="primary"
            disabled={loading}
            loading={loading}
          >
            {t("changePassword")}
          </Button>
        </Form>
        {loading && <LoadingFullScreen tip={t("changing")} />}
      </Col>
    </Row>
  );
};

export default ChangePassword;
