/* eslint-disable max-len */
import React from "react";
import { Button, Form, Typography } from "antd";
import { useTranslation } from "react-i18next";
import { Link, Redirect, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { TextField } from "../../components/atoms";
import { Errors } from "../../components/molecules";
import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

const Login = () => {
  const location = useLocation();
  const { t } = useTranslation(["auth", "translation"]);
  const from = location.state || { from: { pathname: "/" } };
  const { login, loadingAuth, isAuthenticated, errors, clear } = useAuth();
  if (isAuthenticated) {
    return <Redirect to={from} />;
  }
  return (
    <Auth image="https://images.unsplash.com/photo-1593642634402-b0eb5e2eebc9?ixlib=rb-1.2.1&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("welcome")}</h1>
        <div className={styles.description}>
          <Text type="secondary">{t("welcomeDescription")}</Text>
        </div>
        <Form
          onFinish={(values) => {
            login?.({ password: values.password, email: values.email });
          }}
        >
          <TextField
            autofocus
            label={t("translation:email")}
            name="email"
            rules={[{ required: true, message: t("required.email") }]}
            type="email"
          />
          <TextField
            label={t("password")}
            name="password"
            rules={[{ required: true, message: t("required.password") }]}
            type="password"
          />
          {errors && (
            <div className={styles.errors}>
              <Errors errors={errors} fields={["email", "password"]} />
            </div>
          )}
          <div className={styles.rightAlign}>
            <Link to={"/auth/password"}>{t("forgotPassword")}</Link>
          </div>
          <div className={styles.buttons}>
            <Button
              block
              type="ghost"
              className="button-default-default"
              onClick={() => clear?.()}
            >
              <Link to={"/auth/register"} style={{ display: "block" }}>
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
              {t("login")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Login;
