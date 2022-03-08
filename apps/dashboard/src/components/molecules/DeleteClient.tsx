import React, { useState } from "react";
import { Button, message, Modal, Space, Typography } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { DELETE_CLIENT, UNSUBSCRIBE } from "../../api/mutations";
import { CLIENT } from "../../api/queries";
import { Client as IClient, ClientVariables } from "../../api/types/Client";
import {
  DeleteClient as IDeleteClient,
  DeleteClientVariables,
} from "../../api/types/DeleteClient";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { Errors as IErrors } from "../../lib/auth";

import { Errors } from "./";
import { Loading, LoadingFullScreen } from "../atoms";

const { Text } = Typography;

interface DeleteClientProps {
  id: string;
  menuVisible?: (visible: boolean) => void;
}

const DeleteClient = ({ id, menuVisible }: DeleteClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const { data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteClient, { loading: deleting }] = useMutation<
    IDeleteClient,
    DeleteClientVariables
  >(DELETE_CLIENT);
  const [unsubscribe, { loading: unsubscribing }] = useMutation<
    Unsubscribe,
    UnsubscribeVariables
  >(UNSUBSCRIBE);

  if (!data?.user) return <Loading />;

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
        <Space direction="vertical" size="large" style={{ display: "flex" }}>
          <Trans
            i18nKey={
              data.user.subscription
                ? data.user.apps && data.user.apps?.edges.length > 0
                  ? "warnings.deleteSubsApps"
                  : "warnings.deleteSubsNoApps"
                : data.user.apps && data.user.apps?.edges.length > 0
                ? "warnings.deleteNoSubsApps"
                : "warnings.deleteNoSubsNoApps"
            }
            ns="admin"
          >
            <strong></strong>
          </Trans>
          <Errors errors={errors} fields={["password"]} />
          <Button
            danger
            type="primary"
            onClick={(values) => {
              if (data?.user) {
                if (data.user.subscription) {
                  unsubscribe({
                    variables: { userId: data.user.id, atPeriodEnd: false },
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
                    }).then(({ data }) => {
                      if (data?.deleteClient?.ok) {
                        setShowModal(false);
                        message.success(t("admin:deleteClientSuccessful"), 4);
                      } else {
                        setErrors({
                          nonFieldErrors: [
                            {
                              code: "delete_client_error",
                              message: t(
                                `errors.${data?.deleteClient?.error}`,
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
                      message.success(t("admin:deleteClientSuccessful"), 4);
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
        </Space>
        {(deleting || unsubscribing) && (
          <LoadingFullScreen tip={t("admin:deletingClient")} />
        )}
      </Modal>
    </>
  );
};

export default DeleteClient;
