import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {
  Button,
  Col,
  Divider,
  message,
  Popconfirm,
  Row,
  Space,
  Tooltip,
  Typography,
} from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import filter from "lodash/filter";
import find from "lodash/find";
import { Trans, useTranslation } from "react-i18next";

import { GENERATE_APP, UPDATE_APP } from "../../api/mutations";
import { APPS, LIMIT, MY_ACCOUNT } from "../../api/queries";
import { App_app, App_app_builds_edges_node } from "../../api/types/App";
import { Apps, AppsVariables } from "../../api/types/Apps";
import { GenerateApp, GenerateAppVariables } from "../../api/types/GenerateApp";
import { LimitBuilds } from "../../api/types/LimitBuilds";
import {
  AccountAccountStatus,
  BuildBuildStatus,
  StoreAppInput,
} from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
import { getAppBuildState } from "../../lib/appBuildState";
import connectionToNodes from "../../lib/connectionToNodes";
import { longDate } from "../../lib/parseDate";

import { BuildState, ImageUpload } from "./";
import { Loading, LoadingFullScreen } from "../atoms";

import styles from "./AppInfo.module.css";

message.config({ maxCount: 1 });
const { Paragraph, Text, Title } = Typography;

interface AppInfoProps {
  id?: string;
  data: StoreAppInput;
  app?: App_app;
  onChange: (app: StoreAppInput) => void;
  hasChanged: boolean;
}

function addYearToDate(date: Date, num: number) {
  const newDate = new Date(
    new Date(date).setFullYear(new Date(date).getFullYear() + num)
  );
  return newDate;
}
function getRenewalBuild(builds: App_app_builds_edges_node[]) {
  return find(
    builds,
    (build) =>
      addYearToDate(new Date(build.date), -1) <= new Date() &&
      new Date(build.date) >= addYearToDate(new Date(), -1)
  );
}
function getRenewalDate(date: Date) {
  let renewal = false;
  let n = 0;
  let renewalDate = new Date();

  while (!renewal) {
    renewalDate = addYearToDate(date, n++);
    renewal = date <= new Date() && new Date() <= renewalDate;
  }
  return renewalDate;
}
function countCurrentBuilds(
  builds: App_app_builds_edges_node[],
  date: Date | undefined
) {
  let currentBuilds = date
    ? filter(
        builds,
        (build) => addYearToDate(date, -1) <= build.date && build.date <= date
      )
    : [];
  return currentBuilds.length;
}

const AppInfo = ({ app, id, data, onChange, hasChanged }: AppInfoProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const [appLimitExceded, setAppLimitExceded] = useState(false);
  const [buildLimitExceded, setBuildLimitExceded] = useState(false);
  const [allowedApps, setAllowedApps] = useState(1);
  const [allowUpdates, setAllowUpdates] = useState(false);
  const [allowChanges, setAllowUChanges] = useState(false);
  const [appBuildStatus, setAppBuildStatus] = useState<BuildBuildStatus>(
    BuildBuildStatus.WAITING
  );
  const { data: appsData, loading: loadingApps } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });
  const { data: accountData, loading: loadingAccount } = useQuery<MyAccount>(
    MY_ACCOUNT
  );
  const { data: limitData, loading: loadingLimit } = useQuery<LimitBuilds>(
    LIMIT
  );
  const [updateApp, { data: dataUpdate, loading: updating }] = useMutation<
    UpdateApp,
    UpdateAppVariables
  >(UPDATE_APP);
  const [
    generateApp,
    { data: dataGenerate, loading: generating },
  ] = useMutation<GenerateApp, GenerateAppVariables>(GENERATE_APP);
  useEffect(() => {
    if (dataUpdate?.updateApp?.ok) {
      message.success(t("client:saveChangesSuccessful"), 4);
    }
  }, [dataUpdate, t]);
  useEffect(() => {
    if (dataGenerate?.generateApp?.ok) {
      message.success(
        app?.builds.edges.length === 0
          ? t("client:publishAppSuccessful")
          : t("client:updateAppSuccessful"),
        4
      );
    }
  }, [app, dataGenerate, t]);
  useEffect(() => {
    setAppBuildStatus(getAppBuildState(app));
  }, [app]);
  useEffect(() => {
    if (accountData?.me?.subscription?.plan?.product?.metadata) {
      setAllowedApps(
        parseInt(
          JSON.parse(accountData?.me?.subscription?.plan?.product?.metadata)
            .allowed_apps
        )
      );
    }
  }, [accountData]);
  const buildsLimit = limitData?.configs?.edges[0]?.node?.limit || 0;
  const builds = connectionToNodes(app?.builds);
  const renewalBuild = getRenewalBuild(builds);
  const renewalDate = renewalBuild
    ? getRenewalDate(new Date(renewalBuild?.date))
    : undefined;
  const currentBuilds = countCurrentBuilds(
    connectionToNodes(app?.builds),
    renewalDate
  );
  const remainingBuilds = buildsLimit - currentBuilds;

  if (loadingAccount || loadingApps || loadingLimit) return <Loading />;

  return (
    <>
      <Tooltip
        placement="left"
        title={
          <>
            <span>
              {t("client:warnings.buildsLimit", { num: buildsLimit })}
            </span>
            <br />
            <span>
              {t("client:warnings.buildsRemaining", {
                num: remainingBuilds,
              })}
            </span>
            <br />
            {renewalDate ? (
              <span>
                {t("client:warnings.buildsRenewal", {
                  num: longDate(renewalDate),
                })}
              </span>
            ) : (
              <span>{t("client:warnings.buildsNoRenewal")}</span>
            )}
          </>
        }
      >
        <InfoCircleOutlined className={styles.info__icon} />
      </Tooltip>
      <Row align="middle" justify="start" gutter={[20, 20]}>
        <Col lg={{ span: 4 }} md={{ span: 8 }} xs={{ span: 8 }}>
          <ImageUpload
            value={data.logo}
            onDeleteClicked={() => {
              onChange({
                ...data,
                logo: null,
              });
            }}
            onChange={(value) => {
              onChange({
                ...data,
                logo: value,
              });
            }}
          />
          <Text className={styles.info__appId}>ID: {id}</Text>
        </Col>
        <Col lg={{ span: 10 }} md={{ span: 16 }} xs={{ span: 16 }}>
          <Title className={styles.info__appName} level={3}>
            <Paragraph
              editable={{
                onChange(value) {
                  onChange({
                    ...data,
                    name:
                      value === "" || value === t("client:noName") ? "" : value,
                  });
                },
              }}
              type={data.name ? undefined : "danger"}
            >
              {data.name ? data.name : t("client:noName")}
            </Paragraph>
          </Title>
          <Title level={5} className={styles.info__appiLink}>
            <Paragraph
              code
              editable={{
                onChange(value) {
                  onChange({
                    ...data,
                    apiLink:
                      value === "" || value === t("client:noLink") ? "" : value,
                  });
                },
              }}
              type={data.apiLink ? undefined : "danger"}
            >
              {data.apiLink ? data.apiLink : t("client:noLink")}
            </Paragraph>
          </Title>
        </Col>
        <Col lg={{ span: 5 }} md={{ span: 8 }} xs={{ span: 8 }}>
          <Space direction="vertical" size="middle">
            <Row>
              <BuildState state={appBuildStatus} />
            </Row>
            <Row>
              <Col>
                {app?.storeLinks?.ios ? (
                  <a
                    href={app.storeLinks.ios}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    iOS
                  </a>
                ) : (
                  <Text disabled>iOS</Text>
                )}
              </Col>
              <Col>
                <Divider className={styles.divider} type="vertical" />
              </Col>
              <Col>
                {app?.storeLinks?.android ? (
                  <a
                    href={app.storeLinks.android}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Android
                  </a>
                ) : (
                  <Text disabled>Android</Text>
                )}
              </Col>
            </Row>
          </Space>
        </Col>
        <Col lg={{ span: 5 }} md={{ span: 16 }} xs={{ span: 16 }}>
          <Space
            direction="vertical"
            size="middle"
            className={styles.infoStores__buttons}
          >
            <Row align="middle" justify="start">
              <Popconfirm
                cancelText={t("cancel")}
                disabled={
                  !accountData?.me?.subscription ||
                  accountData?.me?.accountStatus ===
                    AccountAccountStatus.BANNED ||
                  (appsData?.apps?.edges.length ?? 0) > allowedApps ||
                  remainingBuilds <= 0 ||
                  (appBuildStatus !== BuildBuildStatus.STALLED &&
                    appBuildStatus !== BuildBuildStatus.PUBLISHED)
                }
                okText={
                  app?.builds.edges.length === 0 ? t("publish") : t("update")
                }
                title={
                  <Trans
                    i18nKey={
                      app?.builds.edges.length === 0
                        ? "warnings.publish"
                        : "warnings.update"
                    }
                    ns="client"
                  >
                    <strong></strong>
                    <p></p>
                    <p></p>
                    <p>{{ num: remainingBuilds }}</p>
                  </Trans>
                }
                onConfirm={() => {
                  app?.id
                    ? generateApp({
                        variables: { appId: app?.id },
                        update(cache, { data }) {
                          if (data?.generateApp?.ok) {
                            cache.modify({
                              id: cache.identify({
                                ...app,
                              }),
                              fields: {
                                builds(existing, { toReference }) {
                                  return {
                                    edges: [
                                      ...existing.edges,
                                      {
                                        __typename: "BuildTypeEdge",
                                        node: toReference({
                                          ...data.generateApp?.build,
                                        }),
                                      },
                                    ],
                                  };
                                },
                              },
                            });
                          } else {
                            message.error(
                              t(
                                `client:errors.${data?.generateApp?.error}`,
                                t("error")
                              ),
                              4
                            );
                          }
                        },
                      })
                    : message.error(t("error"));
                }}
              >
                <Tooltip
                  title={
                    accountData?.me?.accountStatus ===
                    AccountAccountStatus.BANNED
                      ? t("client:bannedAccount")
                      : !accountData?.me?.subscription
                      ? t("client:notSubscribedAccount")
                      : appLimitExceded &&
                        (appsData?.apps?.edges.length ?? 0) > allowedApps
                      ? t("client:appsLimitExceded", {
                          limit: allowedApps,
                        })
                      : buildLimitExceded && remainingBuilds <= 0
                      ? t("client:buildsLimitExceded", {
                          limit: buildsLimit,
                        })
                      : allowUpdates &&
                        appBuildStatus !== BuildBuildStatus.STALLED &&
                        appBuildStatus !== BuildBuildStatus.PUBLISHED
                      ? t("client:updateInProgress")
                      : ""
                  }
                  visible={
                    (appLimitExceded &&
                      (appsData?.apps?.edges.length ?? 0) > allowedApps) ||
                    (buildLimitExceded && remainingBuilds <= 0) ||
                    (allowUpdates &&
                      appBuildStatus !== BuildBuildStatus.STALLED &&
                      appBuildStatus !== BuildBuildStatus.PUBLISHED) ||
                    (accountData?.me?.accountStatus ===
                      AccountAccountStatus.BANNED &&
                      (buildLimitExceded || allowUpdates)) ||
                    (!accountData?.me?.subscription &&
                      (buildLimitExceded || allowUpdates))
                  }
                >
                  <div
                    className={styles.info__buttonContainer}
                    onMouseEnter={() => {
                      setAllowUpdates(true);
                      setAppLimitExceded(true);
                      setBuildLimitExceded(true);
                    }}
                    onMouseLeave={() => {
                      setAllowUpdates(false);
                      setAppLimitExceded(false);
                      setBuildLimitExceded(false);
                    }}
                  >
                    <Button
                      className={styles.info__button}
                      danger={
                        (appsData?.apps?.edges.length ?? 0) > allowedApps ||
                        remainingBuilds <= 0 ||
                        accountData?.me?.accountStatus ===
                          AccountAccountStatus.BANNED ||
                        !accountData?.me?.subscription
                      }
                      disabled={
                        accountData?.me?.subscription !== null &&
                        accountData?.me?.subscription &&
                        accountData?.me?.accountStatus !==
                          AccountAccountStatus.BANNED &&
                        appBuildStatus !== BuildBuildStatus.STALLED &&
                        appBuildStatus !== BuildBuildStatus.PUBLISHED &&
                        remainingBuilds > 0
                      }
                      loading={generating}
                      type={
                        (appsData?.apps?.edges.length ?? 0) > allowedApps ||
                        remainingBuilds <= 0 ||
                        accountData?.me?.accountStatus ===
                          AccountAccountStatus.BANNED ||
                        !accountData?.me?.subscription
                          ? "default"
                          : "primary"
                      }
                    >
                      {app?.builds.edges.length === 0
                        ? t("client:publishApp")
                        : t("client:updateApp")}
                    </Button>
                  </div>
                </Tooltip>
              </Popconfirm>
            </Row>
            <Row>
              <Popconfirm
                cancelText={t("cancel")}
                disabled={!hasChanged || updating}
                okText={t("save")}
                title={
                  <Trans
                    i18nKey={
                      appBuildStatus === BuildBuildStatus.QUEUED
                        ? "warnings.saveApply"
                        : app?.builds.edges.length === 0
                        ? "warnings.saveNotApplyFirst"
                        : "warnings.saveNotApplyNoFirst"
                    }
                    ns="client"
                  >
                    <strong></strong>
                    <p></p>
                  </Trans>
                }
                onConfirm={() => {
                  if (!data.apiLink || !data.name) {
                    message.error(t("client:saveChangesError"), 4);
                  } else {
                    const dataApp = { ...data };
                    // Don't send the image if it's not a Blob
                    // If string, means the logo is the server URL
                    if (typeof dataApp.logo === "string") {
                      delete dataApp.logo;
                    }
                    updateApp({
                      variables: {
                        id: id!!,
                        data: dataApp,
                      },
                      update(cache, { data }) {
                        if (data?.updateApp?.ok) {
                          cache.modify({
                            id: cache.identify({ ...app }),
                            fields: {
                              name() {
                                return dataApp.name;
                              },
                              apiLink() {
                                return dataApp.apiLink;
                              },
                              color(old) {
                                return { ...old, ...dataApp.color };
                              },
                              logo() {
                                return dataApp.logo;
                              },
                              template(old, { toReference }) {
                                return toReference({
                                  __typename: "TemplateType",
                                  id: dataApp.template,
                                });
                              },
                            },
                          });
                        } else {
                          message.error(
                            t(
                              `client:errors.${data?.updateApp?.error}`,
                              t("error")
                            ),
                            4
                          );
                        }
                      },
                    });
                  }
                }}
              >
                <Tooltip
                  title={t("client:noChanges")}
                  visible={!hasChanged && allowChanges}
                >
                  <div
                    className={styles.info__buttonContainer}
                    onMouseEnter={() => {
                      setAllowUChanges(true);
                    }}
                    onMouseLeave={() => {
                      setAllowUChanges(false);
                    }}
                  >
                    <Button
                      className={styles.info__button}
                      disabled={!hasChanged || updating}
                      loading={updating}
                      type="ghost"
                    >
                      {t("client:saveChanges")}
                    </Button>
                  </div>
                </Tooltip>
              </Popconfirm>
            </Row>
          </Space>
        </Col>
      </Row>
      {generating && (
        <LoadingFullScreen
          tip={
            app?.builds.edges.length === 0
              ? t("client:publishingApp")
              : t("client:updatingApp")
          }
        />
      )}
      {updating && <LoadingFullScreen tip={t("client:savingChanges")} />}
    </>
  );
};

export default AppInfo;
