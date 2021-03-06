/* eslint-disable max-len */
import React, { useState } from "react";
import { Button, Form, Result, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { PASSWORD_RESET } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import type {
  PasswordReset as IPasswordReset,
  PasswordResetVariables,
} from "../../api/types/PasswordReset";
import type { Errors as IErrors } from "../../lib/auth";
import { TextField } from "../../components/atoms";
import { Errors } from "../../components/molecules";
import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

interface PasswordResetParamTypes extends Record<string, string> {
  token: string;
}

const PasswordReset = () => {
  const location = useParams<PasswordResetParamTypes>();
  const { t } = useTranslation(["auth", "client"]);
  const [formNewPassword] = Form.useForm();
  const [errors, setErrors] = useState<IErrors>();
  const [passwordReset, { data, loading }] = useMutation<
    IPasswordReset,
    PasswordResetVariables
  >(PASSWORD_RESET, {
    refetchQueries: [{ query: MY_ACCOUNT }],
  });
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        {!data?.passwordReset?.success && (
          <>
            <h1 className={styles.centerText}>{t("resetPassword")}</h1>
            <div className={styles.description}>
              <Text type="secondary">{t("resetPasswordDescription")}</Text>
            </div>
            <Form
              form={formNewPassword}
              onFinish={() => {
                passwordReset({
                  variables: {
                    token: location.token ?? "",
                    newPassword1: formNewPassword.getFieldValue("newPassword1"),
                    newPassword2: formNewPassword.getFieldValue("newPassword2"),
                  },
                  update(cache, { data: reset }) {
                    if (reset?.passwordReset?.success) {
                      formNewPassword.setFieldsValue({
                        newPassword1: "",
                        newPassword2: "",
                      });
                    } else {
                      setErrors(reset?.passwordReset?.errors);
                    }
                  },
                });
              }}
            >
              <TextField
                autofocus
                label={t("newPassword")}
                name="newPassword1"
                rules={[
                  { required: true, message: t("required.password") },
                  {
                    min: 8,
                    message: t("required.minPassword", { num: 8 }),
                  },
                ]}
                type="password"
              />
              <TextField
                dependencies={["newPassword1"]}
                label={t("confirmNewPassword")}
                name="newPassword2"
                rules={[
                  { required: true, message: t("required.passwordMatch") },
                  ({ getFieldValue }) => ({
                    validator(rule, value) {
                      if (!value || getFieldValue("newPassword1") === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(t("required.passwordMatch"));
                    },
                  }),
                ]}
                type="password"
              />
              {errors && (
                <div className={styles.errors}>
                  <Errors
                    errors={errors}
                    fields={["newPassword1", "newPassword2"]}
                  />
                </div>
              )}
              <div className={styles.buttons}>
                <Button block className="button-default-default" type="ghost">
                  <Link to={"/auth/login"} style={{ display: "block" }}>
                    {t("login")}
                  </Link>
                </Button>
                <Button
                  block
                  type="primary"
                  loading={loading}
                  disabled={loading}
                  htmlType="submit"
                  onClick={() => setErrors(undefined)}
                >
                  {t("recovery")}
                </Button>
              </div>
            </Form>
          </>
        )}
        {data?.passwordReset?.success && (
          <Result
            status="success"
            title={t("successfulResetTitle")}
            subTitle={t("sucessfullResetSubtitle")}
            extra={
              <Link to="/login">
                <Button type="primary">{t("login")}</Button>
              </Link>
            }
          />
        )}
      </div>
    </Auth>
  );
};

export default PasswordReset;
