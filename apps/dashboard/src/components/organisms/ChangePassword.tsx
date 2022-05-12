import React from "react";
import { Button, Col, Form, Row, Typography, message } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { PASSWORD_CHANGE } from "../../api/mutations";
import type {
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
  const [passwordChange, { data, loading, reset }] = useMutation<
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

  return (
    <Row gutter={[24, 24]}>
      <Col span={24}>
        <Title level={2} style={{ paddingBottom: 24 }}>
          {t("changePassword")}
        </Title>
        <Form
          form={form}
          onChange={() => reset()}
          onFinish={(values) => {
            passwordChange({
              variables: {
                ...values,
              },
            }).then(({ data: change }) => {
              if (
                change?.passwordChange?.success &&
                change?.passwordChange?.token &&
                change?.passwordChange?.refreshToken
              ) {
                setNewToken?.(
                  change.passwordChange.token,
                  change.passwordChange.refreshToken
                );
              }
            });
          }}
        >
          <Row gutter={[24, 0]}>
            <Col span={24}>
              <TextField
                label={t("oldPassword")}
                name="oldPassword"
                rules={[{ required: true, message: t("required.oldPassword") }]}
                type="password"
              />
            </Col>
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
          <Row gutter={[24, 24]}>
            {data?.passwordChange?.errors && (
              <Col span={24}>
                <Errors
                  errors={data?.passwordChange?.errors}
                  fields={["oldPassword", "newPassword", "newPassword2"]}
                />
              </Col>
            )}
            <Col span={24}>
              <Button
                htmlType="submit"
                type="primary"
                disabled={loading}
                loading={loading}
              >
                {t("changePassword")}
              </Button>
            </Col>
          </Row>
        </Form>
        {loading && <LoadingFullScreen tip={t("changing")} />}
      </Col>
    </Row>
  );
};

export default ChangePassword;
