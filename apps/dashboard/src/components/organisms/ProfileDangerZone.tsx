import React, { useState } from "react";
import { Button, Col, Form, Row } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { DELETE_ACCOUNT, UNSUBSCRIBE } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import type {
  DeleteAccount,
  DeleteAccountVariables,
} from "../../api/types/DeleteAccount";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import type {
  Unsubscribe,
  UnsubscribeVariables,
} from "../../api/types/Unsubscribe";
import type { Errors as IErrors } from "../../lib/auth";
import { useAuth } from "../../lib/auth";
import { LoadingFullScreen, TextField } from "../atoms";
import { Errors } from "../molecules";

interface ProfileDangerZoneProps {
  confirmPassword: boolean;
  onCancel: () => void;
}

const ProfileDangerZone = ({
  confirmPassword,
  onCancel,
}: ProfileDangerZoneProps) => {
  const { logout } = useAuth();
  const { t } = useTranslation(["client", "translation"]);
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

  if (!confirmPassword) {
    return null;
  }

  return (
    <>
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
              }).then(({ data: del }) => {
                if (del?.deleteAccount?.success) {
                  logout?.();
                } else {
                  setErrors(del?.deleteAccount?.errors);
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
        <Row gutter={[24, 0]}>
          <Col span={24}>
            <TextField
              autofocus
              label={t("confirmPassword")}
              name="password"
              onFocus={() => setErrors(undefined)}
              rules={[
                { required: true, message: t("confirmPasswordToDelete") },
              ]}
              type="password"
            />
          </Col>
          {errors && (
            <Col span={24} style={{ paddingBottom: 24 }}>
              <Errors errors={errors} />
            </Col>
          )}
          <Col span={24}>
            <Row gutter={[8, 0]} justify="end">
              <Col>
                <Button className="button-default-default" onClick={onCancel}>
                  {t("translation:cancel")}
                </Button>
              </Col>
              <Col>
                <Button
                  loading={deleting}
                  htmlType="submit"
                  type="primary"
                  danger
                >
                  {t("confirmDeleteAccount")}
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      {(deleting || unsubscribing) && (
        <LoadingFullScreen tip={t("deletingAccount")} />
      )}
    </>
  );
};

export default ProfileDangerZone;
