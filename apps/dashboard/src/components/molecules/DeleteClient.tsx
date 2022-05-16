import React, { useState } from "react";
import { Button, Col, message, Modal, Row, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { DELETE_CLIENT, UNSUBSCRIBE } from "../../api/mutations";
import type { Client as IClient } from "../../api/types/Client";
import type {
  DeleteClient as IDeleteClient,
  DeleteClientVariables,
} from "../../api/types/DeleteClient";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type {
  Unsubscribe,
  UnsubscribeVariables,
} from "../../api/types/Unsubscribe";
import type { Errors as IErrors } from "../../lib/auth";
import { Loading, LoadingFullScreen } from "../atoms";

import { Errors } from ".";

const { Text } = Typography;

interface DeleteClientProps {
  data: IClient | undefined;
  id: string;
  menuVisible?: (visible: boolean) => void;
}

function handleWarning(client: IClient) {
  if (!client.user) {
    return "";
  }
  if (client.user.subscription) {
    if (client.user.apps && client.user.apps?.edges.length > 0) {
      return "warnings.deleteSubsApps";
    } else {
      return "warnings.deleteSubsNoApps";
    }
  } else {
    if (client.user.apps && client.user.apps?.edges.length > 0) {
      return "warnings.deleteNoSubsApps";
    } else {
      return "warnings.deleteNoSubsNoApps";
    }
  }
}

const DeleteClient = ({ data, id, menuVisible }: DeleteClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const [deleteClient, { loading: deleting }] = useMutation<
    IDeleteClient,
    DeleteClientVariables
  >(DELETE_CLIENT);
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
          menuVisible && menuVisible(false);
          setShowModal(true);
        }}
        style={{ display: "flex", flex: 1 }}
        type="danger"
      >
        {t("admin:deleteClient")}
      </Text>
      <Modal
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        title={t("admin:deleteClientConfirm")}
        visible={showModal}
      >
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Trans i18nKey={handleWarning(data)} ns="admin">
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
                  danger
                  type="primary"
                  onClick={(values) => {
                    if (data?.user) {
                      if (data.user.subscription) {
                        unsubscribe({
                          variables: {
                            userId: data.user.id,
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
                        }).then((unsubs) => {
                          deleteClient({
                            variables: { active: false, userId: id },
                            update(cache, { data: del }) {
                              if (del?.deleteClient?.ok && data.user) {
                                cache.modify({
                                  id: cache.identify({
                                    ...data?.user,
                                  }),
                                  fields: {
                                    isActive: () => false,
                                  },
                                });
                              }
                            },
                          }).then(({ data: del }) => {
                            if (del?.deleteClient?.ok) {
                              setShowModal(false);
                              message.success(
                                t("admin:deleteClientSuccessful"),
                                4
                              );
                            } else {
                              setErrors({
                                nonFieldErrors: [
                                  {
                                    code: "delete_client_error",
                                    message: t(
                                      `errors.${del?.deleteClient?.error}`,
                                      t("error")
                                    ),
                                  },
                                ],
                              });
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
                      } else {
                        deleteClient({
                          variables: { active: false, userId: id },
                          update(cache, { data: del }) {
                            if (del?.deleteClient?.ok && data.user) {
                              cache.modify({
                                id: cache.identify({
                                  ...data?.user,
                                }),
                                fields: {
                                  isActive: () => false,
                                },
                              });
                            }
                          },
                        }).then(({ data: del }) => {
                          if (del?.deleteClient?.ok) {
                            setShowModal(false);
                            message.success(
                              t("admin:deleteClientSuccessful"),
                              4
                            );
                          } else {
                            setErrors({
                              nonFieldErrors: [
                                {
                                  code: "delete_client_error",
                                  message: t(
                                    `errors.${del?.deleteClient?.error}`,
                                    t("error")
                                  ),
                                },
                              ],
                            });
                          }
                        });
                      }
                    }
                  }}
                >
                  {t("admin:confirmDeleteClient")}
                </Button>
              </Col>
            </Row>
          </Col>
          {(deleting || unsubscribing) && (
            <LoadingFullScreen tip={t("admin:deletingClient")} />
          )}
        </Row>
      </Modal>
    </>
  );
};

export default DeleteClient;
