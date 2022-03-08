import React from "react";
import { Button, Card, Result } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const NotFound = () => {
  const { t } = useTranslation(["translation", "client"]);
  return (
    <Card>
      <Result
        status="404"
        title={t("404title")}
        subTitle={t("404subTitle")}
        extra={
          <Link to="/profile">
            <Button type="primary">{t("client:goProfile")}</Button>
          </Link>
        }
      />
    </Card>
  );
};

export default NotFound;
