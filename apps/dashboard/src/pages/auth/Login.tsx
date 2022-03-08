import React from "react";
import { Button, Form, Input, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Link, Redirect, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth";

import { Errors } from "../../components/molecules";
import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

interface LocationState {
  from: {
    pathname: string;
  };
}

const Login = () => {
  const location = useLocation<LocationState>();
  const { t } = useTranslation(["auth", "translation"]);
  let { from } = location.state || { from: { pathname: "/" } };
  const { login, loadingAuth, isAuthenticated, errors, clear } = useAuth();
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("welcome")}</h1>
        <p>
          <Text type="secondary">{t("welcomeDescription")}</Text>
        </p>
        <Errors errors={errors} fields={["email", "password"]} />
        <Form
          onFinish={(values) => {
            login?.({ password: values.password, email: values.email });
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
          <Form.Item
            name="password"
            rules={[{ required: true, message: t("required.password") }]}
          >
            <Input.Password placeholder={t("password")} />
          </Form.Item>
          <p>
            <Link to={`/auth/password`} className={styles.rightAlign}>
              {t("forgotPassword")}
            </Link>
          </p>
          <div className={styles.buttons}>
            <Button block type="ghost" onClick={() => clear?.()}>
              <Link to={`/auth/register`} style={{ display: "block" }}>
                {t("createAccount")}
              </Link>
            </Button>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={loadingAuth}
              loading={loadingAuth}
            >
              {t("connect")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Login;
