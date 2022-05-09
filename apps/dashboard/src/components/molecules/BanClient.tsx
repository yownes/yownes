import React, { useState } from "react";
import { Button, Col, message, Modal, Row, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { BAN_USER, UNSUBSCRIBE } from "../../api/mutations";
import type { BanUser, BanUserVariables } from "../../api/types/BanUser";
import type { Client as IClient } from "../../api/types/Client";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type {
  Unsubscribe,
  UnsubscribeVariables,
} from "../../api/types/Unsubscribe";
import type { Errors as IErrors } from "../../lib/auth";
import { Loading, LoadingFullScreen } from "../atoms";

import { Errors } from ".";

const { Text } = Typography;

interface BanClientProps {
  data: IClient | undefined;
  menuVisible?: (visible: boolean) => void;
}

const BanClient = ({ data, menuVisible }: BanClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const [banUser, { loading: banning }] = useMutation<
    BanUser,
    BanUserVariables
  >(BAN_USER);
  const [unsubscribe, { loading: unsubscribing }] = useMutation<
    Unsubscribe,
    UnsubscribeVariables
  >(UNSUBSCRIBE);

  if (!data?.user) {
    return <Loading />;
  }

  return (
    <>
      <Text
        onClick={() => {
          setErrors(undefined);
          menuVisible && menuVisible(false);
          setShowModal(true);
        }}
        style={{ display: "flex", flex: 1 }}
        type="danger"
      >
        {data?.user?.accountStatus === AccountAccountStatus.BANNED
          ? t("admin:unbanAccount")
          : t("admin:banAccount")}
      </Text>
      <Modal
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        title={
          data?.user?.accountStatus === AccountAccountStatus.BANNED
            ? t("admin:warnings.unbanSubsTitle")
            : t("admin:warnings.banSubsTitle")
        }
        visible={showModal}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Trans
              i18nKey={
                data?.user?.accountStatus === AccountAccountStatus.BANNED
                  ? "warnings.unban"
                  : data?.user?.subscription
                  ? data?.user?.apps && data?.user?.apps.edges.length > 0
                    ? "warnings.banSubsApps"
                    : "warnings.banSubsNoApps"
                  : data?.user?.apps && data?.user?.apps.edges.length > 0
                  ? "warnings.banNoSubsApps"
                  : "warnings.banNoSubsNoApps"
              }
              ns="admin"
            >
              <p />
            </Trans>
          </Col>
          {errors && (
            <Col span={24}>
              <Errors errors={errors} />
            </Col>
          )}
          <Col span={24}>
            <Row gutter={[8, 24]} justify="end">
              <Col>
                <Button
                  className="button-default-default"
                  onClick={() => setShowModal(false)}
                >
                  {t("cancel")}
                </Button>
              </Col>
              <Col>
                <Button
                  type="primary"
                  onClick={(values) => {
                    if (data?.user) {
                      if (data.user.subscription) {
                        unsubscribe({
                          variables: {
                            userId: data?.user?.id,
                            atPeriodEnd: false,
                          },
                          update(cache, { data: unsubs }) {
                            if (unsubs?.dropOut?.ok && data.user) {
                              cache.modify({
                                id: cache.identify({
                                  ...data?.user,
                                }),
                                fields: {
                                  accountStatus: () =>
                                    AccountAccountStatus.REGISTERED,
                                  subscription: () => null,
                                },
                              });
                            }
                          },
                        }).then(() => {
                          banUser({
                            variables: {
                              userId: data.user!.id,
                              ban:
                                data?.user?.accountStatus !==
                                AccountAccountStatus.BANNED,
                            },
                            update(cache, { data: banData }) {
                              if (banData?.banUser?.ok) {
                                cache.modify({
                                  id: cache.identify({ ...data.user }),
                                  fields: {
                                    accountStatus(prev: AccountAccountStatus) {
                                      return prev ===
                                        AccountAccountStatus.BANNED
                                        ? AccountAccountStatus.REGISTERED
                                        : AccountAccountStatus.BANNED;
                                    },
                                  },
                                });
                                setShowModal(false);
                                data?.user?.accountStatus ===
                                AccountAccountStatus.BANNED
                                  ? message.success(
                                      t("admin:unbanAccountSuccessful"),
                                      4
                                    )
                                  : message.success(
                                      t("admin:banAccountSuccessful"),
                                      4
                                    );
                              } else {
                                setErrors({
                                  nonFieldErrors: [
                                    {
                                      code:
                                        data?.user?.accountStatus ===
                                        AccountAccountStatus.BANNED
                                          ? "unban_client_error"
                                          : "ban_client_error",
                                      message: t(
                                        `errors.${banData?.banUser?.error}`,
                                        t("error")
                                      ),
                                    },
                                  ],
                                });
                              }
                            },
                          });
                        });
                      } else {
                        banUser({
                          variables: {
                            userId: data.user!.id,
                            ban:
                              data?.user?.accountStatus !==
                              AccountAccountStatus.BANNED,
                          },
                          update(cache, { data: banData }) {
                            if (banData?.banUser?.ok) {
                              cache.modify({
                                id: cache.identify({ ...data.user }),
                                fields: {
                                  accountStatus(prev: AccountAccountStatus) {
                                    return prev === AccountAccountStatus.BANNED
                                      ? AccountAccountStatus.REGISTERED
                                      : AccountAccountStatus.BANNED;
                                  },
                                },
                              });
                              setShowModal(false);
                              data?.user?.accountStatus ===
                              AccountAccountStatus.BANNED
                                ? message.success(
                                    t("admin:unbanAccountSuccessful"),
                                    4
                                  )
                                : message.success(
                                    t("admin:banAccountSuccessful"),
                                    4
                                  );
                            } else {
                              setErrors({
                                nonFieldErrors: [
                                  {
                                    code:
                                      data?.user?.accountStatus ===
                                      AccountAccountStatus.BANNED
                                        ? "unban_client_error"
                                        : "ban_client_error",
                                    message: t(
                                      `errors.${banData?.banUser?.error}`,
                                      t("error")
                                    ),
                                  },
                                ],
                              });
                            }
                          },
                        });
                      }
                    }
                  }}
                >
                  {data?.user?.accountStatus === AccountAccountStatus.BANNED
                    ? t("admin:unban")
                    : t("admin:ban")}
                </Button>
              </Col>
            </Row>
          </Col>
          {(banning || unsubscribing) &&
            (data?.user?.accountStatus === AccountAccountStatus.BANNED ? (
              <LoadingFullScreen tip={t("admin:unbanning")} />
            ) : (
              <LoadingFullScreen tip={t("admin:banning")} />
            ))}
        </Row>
      </Modal>
    </>
  );
};

export default BanClient;
