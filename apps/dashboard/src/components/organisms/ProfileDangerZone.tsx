import React, { useState } from "react";
import { Button, Form, Input, Space } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { DELETE_ACCOUNT, UNSUBSCRIBE } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import {
  DeleteAccount,
  DeleteAccountVariables,
} from "../../api/types/DeleteAccount";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { Errors as IErrors, useAuth } from "../../lib/auth";

import { LoadingFullScreen } from "../atoms";
import { Errors } from "../molecules";

interface ProfileDangerZoneProps {
  confirmPassword: boolean;
}

const ProfileDangerZone = ({ confirmPassword }: ProfileDangerZoneProps) => {
  const [errors, setErrors] = useState<IErrors>();
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [deleteAccount, { loading: deleting }] = useMutation<
    DeleteAccount,
    DeleteAccountVariables
  >(DELETE_ACCOUNT);
  const [unsubscribe, { loading: unsubscribing }] = useMutation<
    Unsubscribe,
    UnsubscribeVariables
  >(UNSUBSCRIBE);
  const { t } = useTranslation("client");
  const { logout } = useAuth();
  if (!confirmPassword) {
    return null;
  }
  return (
    <>
      <Space direction="vertical" style={{ display: "flex" }}>
        <Errors errors={errors} fields={["password"]} />
        <Form
          onFinish={(values) => {
            if (data?.me?.id) {
              unsubscribe({
                variables: { userId: data?.me?.id, atPeriodEnd: true },
                update(cache, { data: unsubs }) {
                  if (unsubs?.dropOut?.ok && data.me) {
                    cache.modify({
                      id: cache.identify({
                        ...data?.me,
                      }),
                      fields: {
                        accountStatus: () => AccountAccountStatus.REGISTERED,
                        subscription: () => null,
                      },
                    });
                  }
                },
              }).then((unsubs) => {
                deleteAccount({
                  variables: { password: values.password },
                }).then(({ data }) => {
                  if (data?.deleteAccount?.success) {
                    logout?.();
                  } else {
                    setErrors(data?.deleteAccount?.errors);
                  }
                });
                if (
                  unsubs.data?.dropOut?.error &&
                  unsubs.data?.dropOut?.error !== "104"
                ) {
                  setErrors({
                    nonFieldErrors: [
                      {
                        code: "unsubscribe_error",
                        message: t(
                          `errors.${unsubs.data?.dropOut?.error}`,
                          t("error")
                        ),
                      },
                    ],
                  });
                }
              });
            }
          }}
        >
          <Form.Item
            name="password"
            label={t("confirmPassword")}
            rules={[{ required: true, message: t("confirmPasswordToDelete") }]}
          >
            <Input.Password autoFocus onFocus={() => setErrors(undefined)} />
          </Form.Item>
          <Button loading={deleting} htmlType="submit" type="primary" danger>
            {t("confirmDeleteAccount")}
          </Button>
        </Form>
      </Space>
      {(deleting || unsubscribing) && (
        <LoadingFullScreen tip={t("deletingAccount")} />
      )}
    </>
  );
};

export default ProfileDangerZone;
