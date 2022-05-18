/* eslint-disable max-len */
import React from "react";
import { Button, Checkbox, Form, Typography } from "antd";
import { Trans, useTranslation } from "react-i18next";
import { Link, Redirect, useLocation } from "react-router-dom";

import { useAuth } from "../../lib/auth";
import { TextField } from "../../components/atoms";
import { Errors } from "../../components/molecules";
import Auth from "../../components/templates/Auth";

import styles from "./auth.module.css";

const { Text } = Typography;

const Register = () => {
  const location = useLocation();
  const { t } = useTranslation(["auth", "translation"]);
  const to = location.state || { from: { pathname: "/" } };
  const { register, loadingRegister, isAuthenticated, errors, clear } =
    useAuth();
  if (isAuthenticated) {
    return <Redirect to={to} />; // TODO: state new: true para comprobar Profile mensaje bienvenida
  }
  return (
    <Auth image="https://images.unsplash.com/photo-1586244439413-bc2288941dda?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80">
      <div>
        <h1 className={styles.centerText}>{t("createAnAccount")}</h1>
        <div className={styles.description}>
          <Text type="secondary">{t("createAnAccountDescription")}</Text>
        </div>
        <Form
          onFinish={(values) => {
            register?.({
              email: values.email,
              username: values.username,
              password1: values.password,
              password2: values.confirmPassword,
            });
          }}
        >
          <TextField
            autofocus
            label={t("translation:userName")}
            name="username"
            onFocus={() => clear?.()}
            rules={[
              { required: true, message: t("required.username") },
              { min: 2, message: t("required.min", { num: 2 }) },
            ]}
          />
          <TextField
            label={t("translation:email")}
            name="email"
            onFocus={() => clear?.()}
            rules={[{ required: true, message: t("required.email") }]}
            type="email"
          />
          <TextField
            label={t("password")}
            name="password"
            onFocus={() => clear?.()}
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
            label={t("confirmPassword")}
            dependencies={["password"]}
            name="confirmPassword"
            onFocus={() => clear?.()}
            rules={[
              { required: true, message: t("required.passwordMatch") },
              ({ getFieldValue }) => ({
                validator(rule, value) {
                  if (!value || getFieldValue("password") === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(t("required.passwordMatch"));
                },
              }),
            ]}
            type="password"
          />
          <Form.Item
            name="agreement"
            onFocus={() => clear?.()}
            valuePropName="checked"
            rules={[
              {
                validator: (_, value) =>
                  value ? Promise.resolve() : Promise.reject(t("required.tos")),
              },
            ]}
          >
            <Checkbox>
              <Trans i18nKey="acceptTos" ns="auth">
                Acepto los <Link to="/tos">Términos y Condiciones</Link>
              </Trans>
            </Checkbox>
          </Form.Item>
          {errors && (
            <div className={styles.errors}>
              <Errors
                errors={errors}
                fields={["email", "username", "password1", "password2"]}
              />
            </div>
          )}
          <div className={styles.buttons}>
            <Button
              block
              className="button-default-default"
              type="ghost"
              onClick={() => clear?.()}
            >
              <Link to={"/auth/login"}>{t("login")}</Link>
            </Button>
            <Button
              block
              type="primary"
              htmlType="submit"
              disabled={loadingRegister}
              loading={loadingRegister}
            >
              {t("createAccount")}
            </Button>
          </div>
        </Form>
      </div>
    </Auth>
  );
};

export default Register;
