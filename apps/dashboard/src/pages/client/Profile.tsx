import React, { useEffect, useState } from "react";
import {
  Alert,
  Button,
  Card,
  Col,
  message,
  notification,
  Popconfirm,
  Row,
} from "antd";
import { useMutation, useQuery } from "@apollo/client";
import type { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { useHistory, useLocation } from "react-router-dom";

import { RESUBSCRIBE } from "../../api/mutations";
import { APPS, MY_ACCOUNT, UPCOMING_INVOICE } from "../../api/queries";
import type { Apps, AppsVariables } from "../../api/types/Apps";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import type { MyAccount, MyAccount_me } from "../../api/types/MyAccount";
import type {
  Resubscribe,
  ResubscribeVariables,
} from "../../api/types/Resubscribe";
import { normalize } from "../../lib/normalize";
import { Loading, LoadingFullScreen, Space } from "../../components/atoms";
import {
  AppTable,
  Placeholder,
  TitleWithAction,
  ProfileInfo,
  NotVerifiedAlert,
} from "../../components/molecules";

import "../../index.css";

message.config({ maxCount: 1 });
notification.config({ maxCount: 1 });

function handleTooltip(allowedApps: number, t: TFunction, me?: MyAccount_me) {
  if (me?.accountStatus === AccountAccountStatus.BANNED) {
    return t("client:errors.105");
  } else {
    if (me?.subscription) {
      return t("client:appsLimitExceded", {
        limit: allowedApps,
      });
    } else {
      return t("client:subscribeAppClaim");
    }
  }
}

const Profile = () => {
  const history = useHistory();
  const location = useLocation();
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
          JSON.parse(normalize(data?.me?.subscription?.plan?.product?.metadata))
            .allowed_apps,
          10
        )
      );
    }
  }, [data]);
  useEffect(() => {
    if (location.state) {
      notification.success({
        description: t("registerNotification.description"),
        duration: 0,
        message: t("registerNotification.message"),
      });
    }
  }, [location.state, t]);

  if (loading || loadingData) {
    return <Loading />;
  }

  return (
    <Col
      xs={{ span: 22, offset: 1 }}
      sm={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 16, offset: 4 }}
    >
      {!data?.me?.verified && (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <NotVerifiedAlert email={data?.me?.email ?? ""} />
          </Col>
          <Col />
        </Row>
      )}
      {data?.me?.accountStatus === AccountAccountStatus.BANNED && (
        <Row gutter={[24, 24]}>
          <Col span={24}>
            <Alert
              description={t("client:bannedAccountDescription")}
              message={t("client:bannedAccountMessage")}
              showIcon
              type="warning"
            />
          </Col>
          <Col />
        </Row>
      )}
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <ProfileInfo profile={data?.me} />
            {data?.me?.accountStatus === AccountAccountStatus.REGISTERED && (
              <>
                <Space />
                <Placeholder
                  claim={t("client:subscribeNow")}
                  cta={{ title: t("client:subscribe"), link: "/checkout" }}
                />
              </>
            )}
            {data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
              data.me.subscription.cancelAtPeriodEnd && (
                <>
                  <Space />
                  <Placeholder claim={t("client:reSubscribeNow")}>
                    {
                      <Popconfirm
                        cancelButtonProps={{
                          className: "button-default-default",
                        }}
                        cancelText={t("cancel")}
                        okText={t("confirm")}
                        onConfirm={() => {
                          if (data?.me?.id) {
                            resubscribe({
                              variables: { userId: data.me.id },
                            });
                            setIsResubscribed(true);
                          }
                        }}
                        placement="left"
                        title={
                          <Trans
                            i18nKey={"warnings.unCancelSubscription"}
                            ns="client"
                          >
                            <strong />
                            <p />
                          </Trans>
                        }
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
        <Col span={24}>
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
                    action: () =>
                      data?.me?.accountStatus === AccountAccountStatus.BANNED
                        ? undefined
                        : history.push("/app/new"),
                    disabled:
                      data?.me?.accountStatus === AccountAccountStatus.BANNED ||
                      (appsData?.apps?.edges.length ?? 0) >= allowedApps,
                    label: t("client:addNewApp"),
                    buttonClassName: "button-default-primary",
                  }}
                  tooltip={{
                    title: handleTooltip(allowedApps, t, data?.me ?? undefined),
                    visible:
                      data?.me?.accountStatus === AccountAccountStatus.BANNED ||
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
                cta={{
                  title: t("client:addNewApp"),
                  link: "/app/new",
                  disabled:
                    data?.me?.accountStatus === AccountAccountStatus.BANNED
                      ? true
                      : false,
                }}
              />
            )}
          </Card>
        </Col>
      </Row>
      {resubscribing && <LoadingFullScreen tip={t("client:resubscribing")} />}
    </Col>
  );
};

export default Profile;
