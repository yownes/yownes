import React, { useEffect } from "react";
import { Button, Card, Result } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link, useParams } from "react-router-dom";

import { VERIFY_ACCOUNT } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import type {
  VerifyAccount,
  VerifyAccountVariables,
} from "../../api/types/VerifyAccount";
import { LoadingFullScreen } from "../../components/atoms";
import { Errors } from "../../components/molecules";

interface ValidateParamTypes extends Record<string, string> {
  token: string;
}

const Validate = () => {
  const location = useParams<ValidateParamTypes>();
  const { t } = useTranslation(["auth"]);
  const [verifyAccount, { data, loading }] = useMutation<
    VerifyAccount,
    VerifyAccountVariables
  >(VERIFY_ACCOUNT, {
    refetchQueries: [{ query: MY_ACCOUNT }],
  });
  useEffect(() => {
    verifyAccount({ variables: { token: location.token ?? "" } });
  }, [location.token, verifyAccount]);
  if (loading) {
    return <LoadingFullScreen tip={t("verifying")} />;
  }
  return (
    <Card>
      {data?.verifyAccount?.success && (
        <Result
          status="success"
          title={t("successfulValidation")}
          extra={
            <Link to="/profile">
              <Button type="primary">{t("translation:goDashboard")}</Button>
            </Link>
          }
        />
      )}
      {data?.verifyAccount?.errors && (
        <Result
          status="error"
          title={t("failedValidation")}
          subTitle={<Errors errors={data?.verifyAccount?.errors} />}
          extra={
            <Link to="/profile">
              <Button type="primary">{t("translation:goDashboard")}</Button>
            </Link>
          }
        />
      )}
    </Card>
  );
};

export default Validate;
