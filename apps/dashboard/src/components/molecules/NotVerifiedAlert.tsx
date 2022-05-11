import React from "react";
import { message } from "antd";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { RESEND_ACTIVATION_EMAIL } from "../../api/mutations";
import type {
  ResendActivationEmail,
  ResendActivationEmailVariables,
} from "../../api/types/ResendActivationEmail";
import { LoadingFullScreen } from "../atoms";

import { AlertWithConfirm } from ".";

interface NotVerifiedAlertProps {
  email: string;
}

message.config({ maxCount: 1 });

const NotVerifiedAlert = ({ email }: NotVerifiedAlertProps) => {
  const { t } = useTranslation("client");
  const [resendActivationEmail, { data, loading }] = useMutation<
    ResendActivationEmail,
    ResendActivationEmailVariables
  >(RESEND_ACTIVATION_EMAIL);

  return (
    <>
      <AlertWithConfirm
        big
        buttonText={t("client:validate.resendEmail")}
        confirmText={
          <Trans i18nKey={"validate.resendEmailWarning"} ns="client">
            <strong />
            <p />
            <p />
          </Trans>
        }
        description={[t("client:validate.description")]}
        message={[t("client:validate.message")]}
        onConfirm={() => {
          resendActivationEmail({
            variables: {
              email,
            },
            update(cache, { data: resend }) {
              if (resend?.resendActivationEmail?.success) {
                message.success(t("client:validate.resendEmailSuccessful"), 4);
              } else {
                message.error(
                  t(
                    `client:errors.${resend?.resendActivationEmail?.errors}`,
                    t("error")
                  ),
                  4
                );
              }
            },
          });
        }}
      />
      {loading && <LoadingFullScreen tip={t("client:validate.resending")} />}
    </>
  );
};

export default NotVerifiedAlert;
