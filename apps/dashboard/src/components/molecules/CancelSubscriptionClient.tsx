import React, { useEffect, useState } from "react";
import { Button, Checkbox, Col, message, Modal, Row, Typography } from "antd";
import { useMutation } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { RESUBSCRIBE, UNSUBSCRIBE } from "../../api/mutations";
import { UPCOMING_INVOICE } from "../../api/queries";
import type { Client_user } from "../../api/types/Client";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import type {
  Resubscribe,
  ResubscribeVariables,
} from "../../api/types/Resubscribe";
import type {
  Unsubscribe,
  UnsubscribeVariables,
} from "../../api/types/Unsubscribe";
import type { Errors as IErrors } from "../../lib/auth";
import { dateTime } from "../../lib/parseDate";
import { LoadingFullScreen } from "../atoms";

import styles from "./CancelSubscriptionClient.module.css";

import { Errors } from ".";

message.config({ maxCount: 1 });
const { Text } = Typography;

interface CancelSubscriptionClientProps {
  data: Client_user | null | undefined;
  menuVisible?: (visible: boolean) => void;
}

const CancelSubscriptionClient = ({
  data,
  menuVisible,
}: CancelSubscriptionClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [errors, setErrors] = useState<IErrors>();
  const [finalizeNow, setFinalizeNow] = useState(true);
  const [isResubscribed, setIsResubscribed] = useState(false);
  const [isUnsubscribed, setIsUnsubscribed] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const REFETCH_UPCOMING = {
    refetchQueries: [
      {
        query: UPCOMING_INVOICE,
        variables: {
          cId: data?.id ?? "",
          sId: data?.subscription?.id ?? "",
        },
      },
    ],
  };

  const [unsubscribe, { loading: unsubscribing, data: unsubscribeData }] =
    useMutation<Unsubscribe, UnsubscribeVariables>(
      UNSUBSCRIBE,
      REFETCH_UPCOMING
    );
  const [resubscribe, { loading: resubscribing, data: resubscribeData }] =
    useMutation<Resubscribe, ResubscribeVariables>(
      RESUBSCRIBE,
      REFETCH_UPCOMING
    );

  useEffect(() => {
    if (resubscribeData?.takeUp?.ok) {
      if (isResubscribed) {
        message.success(t("admin:resubscribeClientSuccessful"), 4);
        setIsResubscribed(false);
      }
    }
  }, [isResubscribed, resubscribeData, t]);
  useEffect(() => {
    if (unsubscribeData?.dropOut?.ok) {
      if (isUnsubscribed) {
        message.success(t("admin:unsubscribeClientSuccessful"), 4);
        setIsUnsubscribed(false);
      }
    }
  }, [isUnsubscribed, t, unsubscribeData]);

  if (!data) {
    return (
      <Text disabled style={{ display: "flex", flex: 1 }} type="danger">
        {t("admin:cancelClientSubscription")}
      </Text>
    );
  }

  const active =
    data?.subscription?.status === SubscriptionStatus.ACTIVE &&
    data.subscription.cancelAtPeriodEnd === false;
  const cancelAtEnd =
    data?.subscription?.status === SubscriptionStatus.ACTIVE &&
    data.subscription.cancelAtPeriodEnd;
  const incomplete =
    data?.subscription?.status === SubscriptionStatus.INCOMPLETE;
  const pastDue = data?.subscription?.status === SubscriptionStatus.PAST_DUE;
  const disabled = !(active || incomplete || pastDue || cancelAtEnd);

  return (
    <>
      <Text
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setErrors(undefined);
            menuVisible && menuVisible(false);
            setShowModal(true);
          }
        }}
        style={{ display: "flex", flex: 1 }}
        type="danger"
      >
        {cancelAtEnd
          ? t("admin:reSubscribeClient")
          : t("admin:cancelClientSubscription")}
      </Text>
      <Modal
        destroyOnClose
        footer={null}
        onCancel={() => {
          setShowModal(false);
        }}
        title={
          cancelAtEnd
            ? t("admin:warnings.unCancelSubscriptionTitle")
            : t("admin:warnings.cancelSubscriptionTitle")
        }
        visible={showModal}
      >
        <Row gutter={[24, 24]}>
          {cancelAtEnd ? (
            <Col span={24}>
              <Trans i18nKey={"warnings.unCancelSubscription"} ns="admin">
                <span />
              </Trans>
            </Col>
          ) : (
            <Col span={24}>
              <Trans
                i18nKey={
                  incomplete
                    ? "warnings.cancelSubscriptionIncompleteNow"
                    : pastDue
                    ? data.apps && data.apps.edges.length > 0
                      ? "warnings.cancelSubscriptionPastDueNowApps"
                      : "warnings.cancelSubscriptionPastDueNowNoApps"
                    : data?.apps && data.apps.edges.length > 0
                    ? "warnings.cancelSubscription"
                    : "warnings.cancelSubscriptionNoApps"
                }
                ns="admin"
                values={{
                  date: dateTime(
                    new Date(data?.subscription?.currentPeriodEnd)
                  ),
                }}
              >
                <p />
                <p />
              </Trans>
              {active && (
                <p className={styles.finalize}>
                  <Checkbox
                    defaultChecked={finalizeNow}
                    onChange={(e) => setFinalizeNow(e.target.checked)}
                  >
                    {t("admin:finalizeNow")}
                  </Checkbox>
                </p>
              )}
            </Col>
          )}
          {errors && (
            <Col span={24}>
              <Errors errors={errors} />
            </Col>
          )}
          <Col span={24}>
            <Row gutter={[8, 0]} justify="end">
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
                    if (active || incomplete || pastDue) {
                      if (data?.id) {
                        unsubscribe({
                          variables: {
                            userId: data?.id,
                            atPeriodEnd: !finalizeNow,
                          },
                          update(cache, { data: result }) {
                            if (result?.dropOut?.ok) {
                              if (!finalizeNow) {
                                cache.modify({
                                  id: cache.identify({
                                    ...data,
                                  }),
                                  fields: {
                                    accountStatus: () =>
                                      result.dropOut?.accountStatus ||
                                      AccountAccountStatus.REGISTERED,
                                  },
                                });
                              } else {
                                cache.modify({
                                  id: cache.identify({
                                    ...data,
                                  }),
                                  fields: {
                                    accountStatus: () =>
                                      result.dropOut?.accountStatus ||
                                      AccountAccountStatus.REGISTERED,
                                    subscription: () => null,
                                  },
                                });
                              }
                              setShowModal(false);
                              setIsUnsubscribed(true);
                            }
                            if (result?.dropOut?.error) {
                              setErrors({
                                nonFieldErrors: [
                                  {
                                    code: cancelAtEnd
                                      ? "resubscribe_client_error"
                                      : "unsubscribe_client_error",
                                    message: t(
                                      `errors.${result.dropOut.error}`,
                                      t("error")
                                    ),
                                  },
                                ],
                              });
                            }
                          },
                        }).catch((err) => {
                          setErrors({
                            nonFieldErrors: [
                              {
                                code: cancelAtEnd
                                  ? "resubscribe_client_error"
                                  : "unsubscribe_client_error",
                                message: t(`errors.${err}`, t("error")),
                              },
                            ],
                          });
                        });
                      }
                    }
                    if (cancelAtEnd) {
                      resubscribe({
                        variables: { userId: data.id },
                        update(cache, { data: result }) {
                          if (result?.takeUp?.ok) {
                            setShowModal(false);
                            setIsResubscribed(true);
                          }
                          if (result?.takeUp?.error) {
                            setErrors({
                              nonFieldErrors: [
                                {
                                  code: "resubscribe_client_error",
                                  message: t(
                                    `errors.${result.takeUp.error}`,
                                    t("error")
                                  ),
                                },
                              ],
                            });
                          }
                        },
                      }).catch((err) => {
                        setErrors({
                          nonFieldErrors: [
                            {
                              code: "resubscribe_client_error",
                              message: t(`errors.${err}`, t("error")),
                            },
                          ],
                        });
                      });
                    }
                  }}
                >
                  {cancelAtEnd
                    ? t("admin:reSubscribeClient")
                    : t("admin:cancelClientSubscription")}
                </Button>
              </Col>
            </Row>
          </Col>
          {resubscribing && (
            <LoadingFullScreen tip={t("admin:resubscribingClient")} />
          )}
          {unsubscribing && (
            <LoadingFullScreen tip={t("admin:unsubscribingClient")} />
          )}
        </Row>
      </Modal>
    </>
  );
};

export default CancelSubscriptionClient;
