import React, { useState } from "react";
import { Button, Col, message, Modal, Row, Typography } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { DELETE_CLIENT } from "../../api/mutations";
import { CLIENT } from "../../api/queries";
import { Client as IClient, ClientVariables } from "../../api/types/Client";
import {
  DeleteClient as IDeleteClient,
  DeleteClientVariables,
} from "../../api/types/DeleteClient";
import { Errors as IErrors } from "../../lib/auth";

import { Errors } from ".";
import { Loading, LoadingFullScreen } from "../atoms";

const { Text } = Typography;

interface RestoreClientProps {
  id: string;
  menuVisible?: (visible: boolean) => void;
}

const RestoreClient = ({ id, menuVisible }: RestoreClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const { data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteClient, { loading: restoring }] = useMutation<
    IDeleteClient,
    DeleteClientVariables
  >(DELETE_CLIENT);

  if (!data?.user) return <Loading />;

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
        {t("admin:restoreClient")}
      </Text>
      <Modal
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        title={t("admin:warnings.restoreClient")}
        visible={showModal}
      >
        <Row gutter={[24, 24]}>
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
                    deleteClient({
                      variables: { active: true, userId: id },
                      update(cache, { data: del }) {
                        if (del?.deleteClient?.ok && data.user) {
                          cache.modify({
                            id: cache.identify({
                              ...data?.user,
                            }),
                            fields: {
                              isActive: () => true,
                            },
                          });
                          setShowModal(false);
                          message.success(
                            t("admin:restoreClientSuccessful"),
                            4
                          );
                        } else {
                          setErrors({
                            nonFieldErrors: [
                              {
                                code: "restore_client_error",
                                message: t(
                                  `admin:errors.${del?.deleteClient?.error}`,
                                  t("error")
                                ),
                              },
                            ],
                          });
                        }
                      },
                    });
                  }}
                >
                  {t("admin:restore")}
                </Button>
              </Col>
            </Row>
          </Col>
          {restoring && <LoadingFullScreen tip={t("admin:restoringClient")} />}
        </Row>
      </Modal>
    </>
  );
};

export default RestoreClient;
