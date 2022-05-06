import React, { useState } from "react";
import { Form, Button, notification, Typography, Col } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import { SEND_PASSWORD_RESET_EMAIL } from "../../api/mutations";
import {
  SendPasswordResetEmail,
  SendPasswordResetEmailVariables,
} from "../../api/types/SendPasswordResetEmail";
import { Errors as IErrors } from "../../lib/auth";

import { TextField } from "../../components/atoms";
import { Errors } from "../../components/molecules";
import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

const ForgottenPassword = () => {
  const { t } = useTranslation(["auth", "translation"]);
  const [formReset] = Form.useForm();
  const [errs, setErrs] = useState<IErrors>();
  const [sendPasswordResetEmail, { loading: sending }] = useMutation<
    SendPasswordResetEmail,
    SendPasswordResetEmailVariables
  >(SEND_PASSWORD_RESET_EMAIL);
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("forgotPassword")}</h1>
        <div className={styles.description}>
          <Text type="secondary">{t("forgotPasswordDescription")}</Text>
        </div>
        <Form
          form={formReset}
          onFinish={(values) => {
            sendPasswordResetEmail({
              variables: { email: "values.email" },
              update(cache, { data: resetemail }) {
                if (resetemail?.sendPasswordResetEmail?.success) {
                  notification.destroy();
                  formReset.resetFields();
                  notification.success({
                    message: t("forgotNotification.message"),
                    description: t("forgotNotification.description"),
                    duration: 0,
                  });
                } else {
                  setErrs(resetemail?.sendPasswordResetEmail?.errors);
                }
              },
            });
          }}
        >
          <TextField
            autofocus
            label={t("translation:email")}
            name="email"
            onFocus={() => setErrs(undefined)}
            rules={[{ required: true, message: t("required.email") }]}
            type="email"
          />
          {errs && (
            <div className={styles.errors}>
              <Errors errors={errs} fields={["email"]} />
            </div>
          )}
          <div className={styles.buttons}>
            <Button block className="button-default-default" type="ghost">
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
