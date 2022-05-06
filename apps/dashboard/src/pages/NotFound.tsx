import React from "react";
import { Button, Card, Result } from "antd";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { useQuery } from "@apollo/client";

import { MY_ACCOUNT } from "../api/queries";
import { MyAccount } from "../api/types/MyAccount";

const NotFound = () => {
  const { t } = useTranslation();
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  return (
    <Card>
      <Result
        status="404"
        title={t("404title")}
        subTitle={t("404subTitle")}
        extra={
          <Link to="/profile">
            <Button type="primary">
              {data?.me?.isStaff ? t("goProfile") : t("goDashboard")}
            </Button>
          </Link>
        }
      />
    </Card>
  );
};

export default NotFound;
