import React from "react";
import { Form, Input, Button, notification, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SEND_PASSWORD_RESET_EMAIL } from "../../api/mutations";
import {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
} from "../../api/types/SendPasswordResetEmail";

import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

const ForgottenPassword = () => {
  const { t } = useTranslation(["auth", "translation"]);
  const [formReset] = Form.useForm();
  const [sendPasswordResetEmail, { loading: sending }] = useMutation<
    SendPasswordResetEmail,
    SendPasswordResetEmailVariables
  >(SEND_PASSWORD_RESET_EMAIL);
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("forgotPassword")}</h1>
        <p>
          <Text type="secondary">{t("forgotPasswordDescription")}</Text>
        </p>
        <Form
          form={formReset}
          onFinish={(values) => {
            sendPasswordResetEmail({
              variables: { email: values.email },
              update(cache, { data: resetemail }) {
                if (resetemail?.sendPasswordResetEmail?.success) {
                  notification.destroy();
                  formReset.resetFields();
                  notification.success({
                    message: t("forgotNotification.message"),
                    description: t("forgotNotification.description"),
                    duration: 0,
                  });
                }
              },
            });
          }}
        >
          <Form.Item
            name="email"
            rules={[
              { required: true, message: t("required.email") },
              { type: "email", message: t("required.validEmail") },
            ]}
          >
            <Input placeholder={t("translation:email")} />
          </Form.Item>
          <div className={styles.buttons}>
            <Button block type="ghost">
              <Link to={`/auth/login`} style={{ display: "block" }}>
                {t("login")}
              </Link>
            </Button>
            <Button
              block
              type="primary"
              loading={sending}
              disabled={sending}
              htmlType="submit"
            >
              {t("sendMail")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default ForgottenPassword;
