import React, { useState } from "react";
import { Button, Col, message, Modal, Row, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";

import { CHANGE_VERIFIED } from "../../api/mutations";
import type {
  ChangeVerified,
  ChangeVerifiedVariables,
} from "../../api/types/ChangeVerified";
import type { Client as IClient } from "../../api/types/Client";
import type { Errors as IErrors } from "../../lib/auth";
import { Loading, LoadingFullScreen } from "../atoms";

import { Errors } from ".";

const { Text } = Typography;

interface VerifyClientProps {
  data: IClient | undefined;
  menuVisible?: (visible: boolean) => void;
}

const VerifyClient = ({ data, menuVisible }: VerifyClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState<IErrors>();
  const [changeVerified, { loading: verifiying }] = useMutation<
    ChangeVerified,
    ChangeVerifiedVariables
  >(CHANGE_VERIFIED);

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
        {data?.user?.verified
          ? t("admin:unverifyAccount")
          : t("admin:verifyAccount")}
      </Text>
      <Modal
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        title={
          data?.user?.verified
            ? t("admin:warnings.unverify")
            : t("admin:warnings.verify")
        }
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
                    changeVerified({
                      variables: {
                        userId: data.user?.id ?? "",
                        verify: !data.user?.verified,
                      },
                      update(cache, { data: changeVerifiedData }) {
                        if (changeVerifiedData?.changeVerified?.ok) {
                          cache.modify({
                            id: cache.identify({ ...data.user }),
                            fields: {
                              verified: () => !data.user?.verified,
                            },
                          });
                        }
                      },
                    })
                      .then((res) => {
                        if (res.data?.changeVerified?.ok) {
                          setShowModal(false);
                          data.user?.verified
                            ? message.success(
                                t("admin:unverifyAccountSuccessful"),
                                4
                              )
                            : message.success(
                                t("admin:verifyAccountSuccessful"),
                                4
                              );
                        } else {
                          setErrors({
                            nonFieldErrors: [
                              {
                                code: data?.user?.verified
                                  ? "unverify_client_error"
                                  : "verify_client_error",
                                message: t(
                                  `errors.${res.data?.changeVerified?.error}`,
                                  t("error")
                                ),
                              },
                            ],
                          });
                        }
                      })
                      .catch(() =>
                        setErrors({
                          nonFieldErrors: [
                            {
                              code: data?.user?.verified
                                ? "unverify_client_error"
                                : "verify_client_error",
                              message: t("unknownError"),
                            },
                          ],
                        })
                      );
                  }}
                >
                  {data?.user?.verified
                    ? t("admin:unverify")
                    : t("admin:verify")}
                </Button>
              </Col>
            </Row>
          </Col>
          {verifiying &&
            (data?.user?.verified ? (
              <LoadingFullScreen tip={t("admin:unverifying")} />
            ) : (
              <LoadingFullScreen tip={t("admin:verifying")} />
            ))}
        </Row>
      </Modal>
    </>
  );
};

export default VerifyClient;
