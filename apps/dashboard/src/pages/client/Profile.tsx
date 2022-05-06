import React, { useEffect, useState } from "react";
import { Alert, Button, Card, Col, message, Popconfirm, Row } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { RESUBSCRIBE } from "../../api/mutations";
import { APPS, MY_ACCOUNT, UPCOMING_INVOICE } from "../../api/queries";
import { Apps, AppsVariables } from "../../api/types/Apps";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { Resubscribe, ResubscribeVariables } from "../../api/types/Resubscribe";
import { normalize } from "../../lib/normalize";

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
          JSON.parse(normalize(data?.me?.subscription?.plan?.product?.metadata))
            .allowed_apps
        )
      );
    }
  }, [data]);

  if (loading || loadingData) return <Loading />;

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
                            <strong></strong>
                            <p></p>
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
    </Col>
  );
};

export default Profile;
