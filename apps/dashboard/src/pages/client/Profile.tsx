import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, message, Popconfirm, Row } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { Link, useHistory } from "react-router-dom";

import { RESUBSCRIBE } from "../../api/mutations";
import { APPS, MY_ACCOUNT, UPCOMING_INVOICE } from "../../api/queries";
import { Apps, AppsVariables } from "../../api/types/Apps";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { Resubscribe, ResubscribeVariables } from "../../api/types/Resubscribe";
import { normalice } from "../../lib/normalice";

import { Loading, LoadingFullScreen, Space } from "../../components/atoms";
import {
  AppTable,
  Placeholder,
  TitleWithAction,
  ProfileInfo,
} from "../../components/molecules";

import "../../index.css";

message.config({ maxCount: 1 });

const Profile = () => {
  const history = useHistory();
  const [allowedApps, setAllowedApps] = useState(1);
  const [isResubscribed, setIsResubscribed] = useState(false);
  const { t } = useTranslation(["translation", "client"]);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const { data: appsData, loading: loadingData } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });
  const [resubscribe, { data: resubscribeData, loading: resubscribing }] =
    useMutation<Resubscribe, ResubscribeVariables>(RESUBSCRIBE, {
      refetchQueries: [
        {
          query: UPCOMING_INVOICE,
          variables: {
            cId: data?.me?.id ?? "",
            sId: data?.me?.subscription?.id ?? "",
          },
        },
      ],
    });
  useEffect(() => {
    if (resubscribeData?.takeUp?.ok) {
      if (isResubscribed) {
        message.success(t("client:resubscribeSuccessful"), 4);
        setIsResubscribed(false);
      }
    }
  }, [isResubscribed, t, resubscribeData]);
  useEffect(() => {
    if (data?.me?.subscription?.plan?.product?.metadata) {
      setAllowedApps(
        parseInt(
          JSON.parse(normalice(data?.me?.subscription?.plan?.product?.metadata))
            .allowed_apps
        )
      );
    }
  }, [data]);

  if (loading || loadingData) return <Loading />;

  return (
    <>
      {!data?.me?.verified && (
        <Row gutter={[20, 20]}>
          <Col span={24}>
            <Alert
              showIcon
              message={t("client:validate.message")}
              description={t("client:validate.description")}
              type="warning"
            />
          </Col>
          <Col></Col>
        </Row>
      )}
      <Row gutter={[20, 20]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <ProfileInfo profile={data?.me} />
            {data?.me?.accountStatus === AccountAccountStatus.REGISTERED && (
              <>
                <Space />
                <Placeholder
                  claim={t("client:subscribeNow")}
                  cta={{ title: t("client:subscribe"), link: "/checkout" }}
                ></Placeholder>
              </>
            )}
            {data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd && (
                <>
                  <Space />
                  <Placeholder claim={t("client:reSubscribeNow")}>
                    {
                      <Popconfirm
                        cancelText={t("cancel")}
                        okText={t("confirm")}
                        title={
                          <Trans
                            i18nKey={"warnings.unCancelSubscription"}
                            ns="client"
                          >
                            <strong></strong>
                            <p></p>
                          </Trans>
                        }
                        placement="left"
                        onConfirm={() => {
                          if (data?.me?.id) {
                            resubscribe({
                              variables: { userId: data.me.id },
                            });
                            setIsResubscribed(true);
                          }
                        }}
                      >
                        <Button type="primary">
                          {t("client:reSubscribe")}
                        </Button>
                      </Popconfirm>
                    }
                  </Placeholder>
                </>
              )}
          </Card>
        </Col>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            {(appsData?.apps?.edges.length ?? 0) > 0 ? (
              <>
                <TitleWithAction
                  title={t("apps")}
                  description={t("client:appLimitInfo", {
                    allowed: allowedApps,
                    napps: appsData?.apps?.edges.length ?? 0,
                  })}
                  action={{
                    action: () => history.push("/app/new"),
                    disabled:
                      (appsData?.apps?.edges.length ?? 0) >= allowedApps,
                    label: t("client:addNewApp"),
                    buttonClassName: "button-default-primary",
                  }}
                  tooltip={{
                    title: data?.me?.subscription
                      ? t("client:appsLimitExceded", {
                          limit: allowedApps,
                        })
                      : t("client:subscribeAppClaim"),
                    visible:
                      (appsData?.apps?.edges.length ?? 0) >= allowedApps ||
                      (!data?.me?.subscription &&
                        (appsData?.apps?.edges.length ?? 0) >= 1),
                  }}
                />
                <AppTable dataSource={appsData?.apps} />
              </>
            ) : (
              <Placeholder
                claim={t("client:addAppClaim")}
                cta={{ title: t("client:addNewApp"), link: "/app/new" }}
              ></Placeholder>
            )}
          </Card>
        </Col>
      </Row>
      {resubscribing && <LoadingFullScreen tip={t("client:resubscribing")} />}
    </>
  );
};

export default Profile;
