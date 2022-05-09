import React, { useEffect, useState } from "react";
import {
  Button,
  Card,
  Col,
  message,
  Popconfirm,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import filter from "lodash/filter";
import find from "lodash/find";
import { Trans, useTranslation } from "react-i18next";
import { useParams, useHistory, Redirect } from "react-router-dom";

import { DELETE_APP, GENERATE_APP, UPDATE_APP } from "../../api/mutations";
import type { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { APP, APPS, APP_OWNER_ACTIVE, MY_ACCOUNT } from "../../api/queries";
import type {
  App as IApp,
  AppVariables,
  App_app,
  App_app_builds_edges_node,
} from "../../api/types/App";
import type { Apps, AppsVariables } from "../../api/types/Apps";
import type { AppOwnerActive } from "../../api/types/AppOwnerActive";
import type {
  GenerateApp,
  GenerateAppVariables,
} from "../../api/types/GenerateApp";
import type { StoreAppInput } from "../../api/types/globalTypes";
import {
  AccountAccountStatus,
  BuildBuildStatus,
} from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import type { UpdateApp, UpdateAppVariables } from "../../api/types/UpdateApp";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";
import { Loading, LoadingFullScreen } from "../../components/atoms";
import { AppInfo } from "../../components/molecules";
import {
  AppPayment,
  AppPreview,
  ColorPicker,
  TemplateSelector,
} from "../../components/organisms";
import { getAppBuildState } from "../../lib/appBuildState";

import styles from "./App.module.css";

const { Title } = Typography;

interface AppParamTypes extends Record<string, string | undefined> {
  appId?: string;
}

export const baseApp: StoreAppInput = {
  apiLink: "",
  template: "VGVtcGxhdGVUeXBlOjE=",
  name: "",
  color: { color: "#0099cc", text: "white" },
  logo: null,
};

function appsAreEqual(state: StoreAppInput, app?: App_app | null): boolean {
  if (!app) {
    return false;
  }
  return (
    app.apiLink === state.apiLink &&
    app.color?.color === state.color?.color &&
    app.color?.text === state.color?.text &&
    app.name === state.name &&
    app.template?.id === state.template &&
    app.logo === state.logo
  );
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
  const currentBuilds = date
    ? filter(
        builds,
        (build) => addYearToDate(date, -1) <= build.date && build.date <= date
      )
    : [];
  return currentBuilds.length;
}

const App = () => {
  const { t } = useTranslation(["translation", "client"]);
  const history = useHistory();
  const { appId } = useParams<AppParamTypes>();
  const [appLimitExceded, setAppLimitExceded] = useState(false);
  const [buildLimitExceded, setBuildLimitExceded] = useState(false);
  const [allowedApps, setAllowedApps] = useState(1);
  const [allowUpdates, setAllowUpdates] = useState(false);
  const [allowChanges, setAllowUChanges] = useState(false);
  const [appBuildStatus, setAppBuildStatus] = useState<BuildBuildStatus>(
    BuildBuildStatus.WAITING
  );
  const [buildsLimit, setBuildsLimit] = useState(0);
  const [state, setState] = useState<StoreAppInput>(baseApp);
  const [notYourRecurse, setNotYourRecurse] = useState(false);

  const { data: dataOwnerActive, loading: loadingOwnerActive } =
    useQuery<AppOwnerActive>(APP_OWNER_ACTIVE, { variables: { id: appId } });
  const { data: appsData, loading: loadingApps } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });
  const { data: accountData, loading: loadingAccount } =
    useQuery<MyAccount>(MY_ACCOUNT);
  const [getAppById, { data, loading }] = useLazyQuery<IApp, AppVariables>(APP);

  const [deleteApp, { loading: deleting }] = useMutation<
    DeleteApp,
    DeleteAppVariables
  >(DELETE_APP);
  const [generateApp, { data: dataGenerate, loading: generating }] =
    useMutation<GenerateApp, GenerateAppVariables>(GENERATE_APP);
  const [updateApp, { data: dataUpdate, loading: updating }] = useMutation<
    UpdateApp,
    UpdateAppVariables
  >(UPDATE_APP);

  useEffect(() => {
    if (data?.app) {
      setAppBuildStatus(getAppBuildState(data.app));
    }
  }, [data?.app]);
  useEffect(() => {
    if (data?.app) {
      setState({
        apiLink: data.app.apiLink,
        template: data.app.template?.id,
        name: data.app.name,
        color: {
          color: data.app.color?.color ?? baseApp.color?.color,
          text: data.app.color?.text ?? baseApp.color?.text,
        },
        logo: data.app.logo,
      });
    }
  }, [data?.app]);
  useEffect(() => {
    if (appId) {
      if (dataOwnerActive?.appcustomer?.isOwnerAndActive) {
        getAppById({ variables: { id: appId } });
      }
      if (dataOwnerActive?.appcustomer?.isOwnerAndActive === false) {
        setNotYourRecurse(true);
      }
    } else {
      setNotYourRecurse(true);
    }
  }, [appId, dataOwnerActive, getAppById]);
  useEffect(() => {
    if (dataUpdate?.updateApp?.ok) {
      message.success(t("client:saveChangesSuccessful"), 4);
    }
  }, [dataUpdate, t]);
  useEffect(() => {
    if (dataGenerate?.generateApp?.ok) {
      message.success(
        data?.app?.builds.edges.length === 0
          ? t("client:publishAppSuccessful")
          : t("client:updateAppSuccessful"),
        4
      );
    }
  }, [data?.app, dataGenerate, t]);
  useEffect(() => {
    if (accountData?.me?.subscription?.plan?.product?.metadata) {
      setAllowedApps(
        parseInt(
          JSON.parse(
            normalize(accountData?.me?.subscription?.plan?.product?.metadata)
          ).allowed_apps,
          10
        )
      );
      setBuildsLimit(
        parseInt(
          JSON.parse(
            normalize(accountData?.me?.subscription?.plan?.product?.metadata)
          ).allowed_builds,
          10
        )
      );
    }
  }, [accountData]);

  const builds = connectionToNodes(data?.app?.builds);
  const renewalBuild = getRenewalBuild(builds);
  const renewalDate = renewalBuild
    ? getRenewalDate(new Date(renewalBuild?.date))
    : undefined;
  const currentBuilds = countCurrentBuilds(
    connectionToNodes(data?.app?.builds),
    renewalDate
  );
  const remainingBuilds = buildsLimit - currentBuilds;

  if (
    loadingAccount ||
    loadingApps ||
    loadingOwnerActive ||
    !state ||
    loading
  ) {
    return <Loading />;
  }

  if (notYourRecurse) {
    return <Redirect to="/profile" />;
  }

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={16}>
          <Row gutter={[24, 24]}>
            <Col span={24}>
              <Card>
                <AppInfo
                  app={data?.app ?? undefined}
                  build={{
                    limit: buildsLimit,
                    remaining: remainingBuilds,
                    renewal: renewalDate,
                  }}
                  data={state}
                  id={data?.app?.id}
                  onChange={(app) => setState(app)}
                />
              </Card>
            </Col>
            <Col span={24}>
              <Card>
                <>
                  <Row gutter={[24, 24]}>
                    <Col span={24}>
                      <Title level={2}>{t("client:style")}</Title>
                    </Col>
                    <Col span={24}>
                      <TemplateSelector
                        value={state.template!}
                        onChange={(selected) => {
                          setState((val) => ({
                            ...val,
                            template: selected,
                          }));
                        }}
                      />
                    </Col>
                    <Col span={24}>
                      <ColorPicker
                        value={state.color!}
                        onChange={(selected) => {
                          setState((val) => ({
                            ...val,
                            color: selected,
                          }));
                        }}
                      />
                    </Col>
                  </Row>
                </>
              </Card>
            </Col>
            <Col span={24}>
              <Card>{appId ? <AppPayment appId={appId} /> : null}</Card>
            </Col>
          </Row>
        </Col>
        <Col span={8}>
          <Row gutter={[24, 24]}>
            <div className={styles.previewContainer}>
              <Col span={24}>
                <Row className={styles.buttons} justify="space-around">
                  <Col>
                    <Popconfirm
                      cancelButtonProps={{
                        className: "button-default-default",
                      }}
                      cancelText={t("cancel")}
                      disabled={appsAreEqual(state, data?.app) || updating}
                      okText={t("save")}
                      onConfirm={() => {
                        if (!state.apiLink || !state.name) {
                          message.error(t("client:saveChangesError"), 4);
                        } else {
                          const dataApp = { ...state };
                          // Don't send the image if it's not a Blob
                          // If string, means the logo is the server URL
                          if (typeof dataApp.logo === "string") {
                            delete dataApp.logo;
                          }
                          updateApp({
                            variables: {
                              id: data?.app?.id ?? "",
                              data: dataApp,
                            },
                            update(cache, { data: result }) {
                              if (result?.updateApp?.ok) {
                                cache.modify({
                                  id: cache.identify({ ...data?.app }),
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
                                    `client:errors.${result?.updateApp?.error}`,
                                    t("error")
                                  ),
                                  4
                                );
                              }
                            },
                          });
                        }
                      }}
                      title={
                        <Trans
                          i18nKey={
                            appBuildStatus === BuildBuildStatus.QUEUED
                              ? "warnings.saveApply"
                              : data?.app?.builds.edges.length === 0
                              ? "warnings.saveNotApplyFirst"
                              : "warnings.saveNotApplyNoFirst"
                          }
                          ns="client"
                        >
                          <strong />
                          <p />
                        </Trans>
                      }
                    >
                      <Tooltip
                        title={t("client:noChanges")}
                        visible={appsAreEqual(state, data?.app) && allowChanges}
                      >
                        <div
                          onMouseEnter={() => {
                            setAllowUChanges(true);
                          }}
                          onMouseLeave={() => {
                            setAllowUChanges(false);
                          }}
                        >
                          <Button
                            className={
                              !appsAreEqual(state, data?.app)
                                ? "button-default-primary"
                                : undefined
                            }
                            disabled={
                              appsAreEqual(state, data?.app) || updating
                            }
                            loading={updating}
                            type="ghost"
                          >
                            {t("client:saveChanges")}
                          </Button>
                        </div>
                      </Tooltip>
                    </Popconfirm>
                  </Col>
                  <Col>
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
                        data?.app?.builds.edges.length === 0
                          ? t("publish")
                          : t("update")
                      }
                      title={
                        <Trans
                          i18nKey={
                            data?.app?.builds.edges.length === 0
                              ? "warnings.publish"
                              : "warnings.update"
                          }
                          ns="client"
                        >
                          <strong />
                          <p />
                          <p />
                          <p>{{ num: remainingBuilds }}</p>
                        </Trans>
                      }
                      onConfirm={() => {
                        data?.app?.id
                          ? generateApp({
                              variables: { appId: data?.app?.id },
                              update(cache, { data: result }) {
                                if (result?.generateApp?.ok) {
                                  cache.modify({
                                    id: cache.identify({
                                      ...data.app,
                                    }),
                                    fields: {
                                      builds(existing, { toReference }) {
                                        return {
                                          edges: [
                                            ...existing.edges,
                                            {
                                              __typename: "BuildTypeEdge",
                                              node: toReference({
                                                ...result.generateApp?.build,
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
                                      `client:errors.${result?.generateApp?.error}`,
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
                            (appsData?.apps?.edges.length ?? 0) >
                              allowedApps) ||
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
                            danger={
                              (appsData?.apps?.edges.length ?? 0) >
                                allowedApps ||
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
                              (appsData?.apps?.edges.length ?? 0) >
                                allowedApps ||
                              remainingBuilds <= 0 ||
                              accountData?.me?.accountStatus ===
                                AccountAccountStatus.BANNED ||
                              !accountData?.me?.subscription
                                ? "default"
                                : "primary"
                            }
                          >
                            {data?.app?.builds.edges.length === 0
                              ? t("client:publishApp")
                              : t("client:updateApp")}
                          </Button>
                        </div>
                      </Tooltip>
                    </Popconfirm>
                  </Col>
                </Row>
              </Col>
              <Col span={24}>
                <Card>
                  {data?.app?.id ? (
                    <AppPreview id={data?.app?.id} app={state} />
                  ) : null}
                </Card>
              </Col>
            </div>
          </Row>
        </Col>
        <Col span={24}>
          <Popconfirm
            cancelText={t("cancel")}
            okText={t("delete")}
            title={
              <Trans i18nKey="warnings.app" ns="client">
                <strong />
                <p />
              </Trans>
            }
            onConfirm={() => {
              deleteApp({
                variables: { id: appId! },
                update(cache, { data: del }) {
                  if (del?.deleteApp?.ok) {
                    cache.evict({
                      id: cache.identify({
                        __typename: "StoreAppType",
                        id: appId,
                      }),
                    });
                    cache.gc();
                    message.success(t("client:deleteAppSuccessful"), 4);
                    history.replace("/profile");
                  } else {
                    message.error(
                      t(`client:errors.${del?.deleteApp?.error}`) || "Error",
                      4
                    );
                  }
                },
              });
            }}
          >
            <Button
              disabled={deleting}
              loading={deleting}
              type="primary"
              danger
            >
              {t("client:deleteApp")}
            </Button>
          </Popconfirm>
        </Col>
      </Row>
      {deleting && <LoadingFullScreen tip={t("client:deletingApp")} />}
      {generating && (
        <LoadingFullScreen
          tip={
            data?.app?.builds.edges.length === 0
              ? t("client:publishingApp")
              : t("client:updatingApp")
          }
        />
      )}
      {updating && <LoadingFullScreen tip={t("client:savingChanges")} />}
    </>
  );
};

export default App;
