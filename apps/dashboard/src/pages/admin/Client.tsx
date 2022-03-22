import React, { useState } from "react";
import {
  Button,
  Card,
  Col,
  Dropdown,
  Menu,
  message,
  Popconfirm,
  Row,
  Space,
  Typography,
} from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import { TFunction } from "i18next";
import { Trans, useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import {
  BAN_USER,
  CHANGE_VERIFIED,
  DELETE_APP,
  RESTORE_APP,
  UNSUBSCRIBE,
} from "../../api/mutations";
import { CLIENT } from "../../api/queries";
import { BanUser, BanUserVariables } from "../../api/types/BanUser";
import {
  ChangeVerified,
  ChangeVerifiedVariables,
} from "../../api/types/ChangeVerified";
import {
  Client as IClient,
  ClientVariables,
  Client_user_apps_edges_node,
} from "../../api/types/Client";
import { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import { RestoreApp, RestoreAppVariables } from "../../api/types/RestoreApp";
import { Unsubscribe, UnsubscribeVariables } from "../../api/types/Unsubscribe";
import { Filter, getColumnFilterProps } from "../../lib/filterColumns";

import { Loading, LoadingFullScreen } from "../../components/atoms";
import {
  ProfileInfo,
  AppsTable,
  BuildsTable,
  DeleteClient,
  RestoreClient,
  VerifiedState,
} from "../../components/molecules";
import { getBuildsForCustomer } from "../../components/molecules/BuildsTable";
import {
  ClientSubscriptionData,
  PaymentMethod,
} from "../../components/organisms";

const { Text, Title } = Typography;

interface ClientProps {
  id: string;
}

function getDeleteFilters(t: TFunction) {
  let filters: Filter[] = [];
  filters.push({
    text: (
      <Space>
        <VerifiedState verified={true} />
        {t("admin:active")}
      </Space>
    ),
    value: true,
  });
  filters.push({
    text: (
      <Space>
        <VerifiedState verified={false} />
        {t("admin:inactive")}
      </Space>
    ),
    value: false,
  });
  return filters;
}

const Client = () => {
  const { t } = useTranslation(["translation", "admin"]);
  const { id } = useParams<ClientProps>();
  const [isOverlayVisible, setIsOverlayVisible] = useState(false);
  const { data, loading } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [banUser, { loading: banning }] = useMutation<
    BanUser,
    BanUserVariables
  >(BAN_USER);
  const [changeVerified, { loading: verifiying }] = useMutation<
    ChangeVerified,
    ChangeVerifiedVariables
  >(CHANGE_VERIFIED);
  const [deleteApp, { loading: deleting }] = useMutation<
    DeleteApp,
    DeleteAppVariables
  >(DELETE_APP);
  const [restoreApp, { loading: restoring }] = useMutation<
    RestoreApp,
    RestoreAppVariables
  >(RESTORE_APP);
  const [unsubscribe, { loading: unsubscribing }] = useMutation<
    Unsubscribe,
    UnsubscribeVariables
  >(UNSUBSCRIBE);

  if (loading) return <Loading />;

  const menu = (
    <Menu>
      <Menu.Item key="ban">
        <Popconfirm
          cancelText={t("cancel")}
          okText={
            data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:unban")
              : t("admin:ban")
          }
          title={
            <Trans
              i18nKey={
                data?.user?.accountStatus === AccountAccountStatus.BANNED
                  ? "warnings.unban"
                  : data?.user?.subscription
                  ? data?.user?.apps && data?.user?.apps.edges.length > 0
                    ? "warnings.banSubsApps"
                    : "warnings.banSubsNoApps"
                  : data?.user?.apps && data?.user?.apps.edges.length > 0
                  ? "warnings.banNoSubsApps"
                  : "warnings.banNoSubsNoApps"
              }
              ns="admin"
            >
              <strong></strong>
              <p></p>
            </Trans>
          }
          onConfirm={() => {
            setIsOverlayVisible(false);
            if (data?.user) {
              if (data.user.subscription) {
                unsubscribe({
                  variables: { userId: data?.user?.id, atPeriodEnd: false },
                  update(cache, { data: unsubs }) {
                    if (unsubs?.dropOut?.ok && data.user) {
                      cache.modify({
                        id: cache.identify({
                          ...data?.user,
                        }),
                        fields: {
                          accountStatus: () => AccountAccountStatus.REGISTERED,
                          subscription: () => null,
                        },
                      });
                    }
                  },
                }).then(() => {
                  banUser({
                    variables: {
                      userId: data.user!!.id,
                      ban:
                        data?.user?.accountStatus !==
                        AccountAccountStatus.BANNED,
                    },
                    update(cache, { data: banData }) {
                      if (banData?.banUser?.ok) {
                        cache.modify({
                          id: cache.identify({ ...data.user }),
                          fields: {
                            accountStatus(prev: AccountAccountStatus) {
                              return prev === AccountAccountStatus.BANNED
                                ? AccountAccountStatus.REGISTERED
                                : AccountAccountStatus.BANNED;
                            },
                          },
                        });
                        data?.user?.accountStatus ===
                        AccountAccountStatus.BANNED
                          ? message.success(
                              t("admin:unbanAccountSuccessful"),
                              4
                            )
                          : message.success(t("admin:banAccountSuccessful"), 4);
                      } else {
                        message.error(banData?.banUser?.error, 4);
                      }
                    },
                  });
                });
              } else {
                banUser({
                  variables: {
                    userId: data.user!!.id,
                    ban:
                      data?.user?.accountStatus !== AccountAccountStatus.BANNED,
                  },
                  update(cache, { data: banData }) {
                    if (banData?.banUser?.ok) {
                      cache.modify({
                        id: cache.identify({ ...data.user }),
                        fields: {
                          accountStatus(prev: AccountAccountStatus) {
                            return prev === AccountAccountStatus.BANNED
                              ? AccountAccountStatus.REGISTERED
                              : AccountAccountStatus.BANNED;
                          },
                        },
                      });
                      data?.user?.accountStatus === AccountAccountStatus.BANNED
                        ? message.success(t("admin:unbanAccountSuccessful"), 4)
                        : message.success(t("admin:banAccountSuccessful"), 4);
                    } else {
                      message.error(banData?.banUser?.error, 4);
                    }
                  },
                });
              }
            }
          }}
        >
          <Text type="danger" style={{ display: "flex", flex: 1 }}>
            {data?.user?.accountStatus === AccountAccountStatus.BANNED
              ? t("admin:unbanAccount")
              : t("admin:banAccount")}
          </Text>
        </Popconfirm>
      </Menu.Item>
      {data?.user && (
        <Menu.Item key="verify">
          <Popconfirm
            cancelText={t("cancel")}
            okText={
              data?.user?.verified ? t("admin:unverify") : t("admin:verify")
            }
            title={
              <Trans
                i18nKey={
                  data.user.verified ? "warnings.unverify" : "warnings.verify"
                }
                ns="admin"
              >
                <strong></strong>
                <p></p>
              </Trans>
            }
            placement="left"
            onConfirm={() => {
              setIsOverlayVisible(false);
              changeVerified({
                variables: { userId: id, verify: !data.user?.verified },
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
                    data.user?.verified
                      ? message.success(t("admin:unverifyAccountSuccessful"), 4)
                      : message.success(t("admin:verifyAccountSuccessful"), 4);
                  } else {
                    message.error(res.data?.changeVerified?.error, 4);
                  }
                })
                .catch((err) => message.error(t("unknownError"), 4));
            }}
          >
            <Text type="danger" style={{ display: "flex", flex: 1 }}>
              {data?.user?.verified
                ? t("admin:unverifyAccount")
                : t("admin:verifyAccount")}
            </Text>
          </Popconfirm>
        </Menu.Item>
      )}
      {data?.user?.isActive && (
        <Menu.Item key="delete">
          <DeleteClient id={id} menuVisible={setIsOverlayVisible} />
        </Menu.Item>
      )}
      {!data?.user?.isActive && (
        <Menu.Item key="delete">
          <RestoreClient id={id} menuVisible={setIsOverlayVisible} />
        </Menu.Item>
      )}
    </Menu>
  );
  const profieActions = (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      visible={isOverlayVisible}
      onVisibleChange={setIsOverlayVisible}
    >
      <Button shape="circle" icon={<EllipsisOutlined></EllipsisOutlined>} />
    </Dropdown>
  );

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <Row gutter={10}>
              <Col span={24}>
                <ProfileInfo
                  profile={data?.user}
                  extra={profieActions}
                  verified
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <ClientSubscriptionData client={data?.user} />
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24} style={{ minWidth: 550 }}>
          <Card>
            <Row gutter={10}>
              <Col span={24}>
                <Title level={2}>{t("paymentMethod")}</Title>
                <PaymentMethod
                  customer={data?.user?.customer}
                  staff
                  userId={data?.user?.id!!}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col></Col>
      </Row>
      <Row gutter={[24, 24]}>
        <Col xl={12} lg={24} md={24} sm={24} style={{ minWidth: 550 }}>
          <Card>
            <Title level={2}>{t("admin:apps")}</Title>
            <AppsTable
              dataSource={data?.user?.apps}
              columns={[
                {
                  title: t("admin:actions"),
                  key: "actions",
                  render: (_, record) => {
                    if (!record.isActive) {
                      return (
                        <Popconfirm
                          title={t("admin:warningRestoreApp")}
                          onConfirm={() =>
                            restoreApp({
                              variables: {
                                id: record.id,
                              },
                              update(cache, { data }) {
                                if (data?.restoreApp?.ok) {
                                  cache.modify({
                                    id: cache.identify({ ...record }),
                                    fields: {
                                      isActive() {
                                        return true;
                                      },
                                    },
                                  });
                                  message.success(
                                    t("admin:restoreAppSuccessful"),
                                    4
                                  );
                                } else {
                                  message.error(
                                    t(
                                      `admin:errors.${data?.restoreApp?.error}`,
                                      t("error")
                                    ),
                                    4
                                  );
                                }
                              },
                            })
                          }
                        >
                          <Button type="link">{t("admin:restoreApp")}</Button>
                        </Popconfirm>
                      );
                    }
                    return (
                      <Popconfirm
                        title={t("admin:warnings.app")}
                        onConfirm={() => {
                          deleteApp({
                            variables: {
                              id: record.id,
                            },
                            update(cache, { data }) {
                              if (data?.deleteApp?.ok) {
                                const id = cache.identify({ ...record });
                                cache.evict({
                                  id,
                                });
                                cache.gc();
                                message.success(
                                  t("admin:deleteAppSuccessful"),
                                  4
                                );
                              } else {
                                message.error(
                                  t(`admin:errors.${data?.deleteApp?.error}`),
                                  4
                                );
                              }
                            },
                          });
                        }}
                      >
                        <Button danger type="link">
                          {t("admin:deleteApp")}
                        </Button>
                      </Popconfirm>
                    );
                  },
                  defaultFilteredValue: ["true"],
                  ...getColumnFilterProps<Client_user_apps_edges_node>(
                    ["isActive"],
                    getDeleteFilters(t)
                  ),
                },
              ]}
            />
          </Card>
        </Col>
        <Col xl={12} lg={24} md={24} sm={24} style={{ minWidth: 550 }}>
          <Card>
            <Title level={2}>{t("admin:builds")}</Title>
            <BuildsTable dataSource={getBuildsForCustomer(data?.user)} />
          </Card>
        </Col>
      </Row>
      {banning &&
        (data?.user?.accountStatus === AccountAccountStatus.BANNED ? (
          <LoadingFullScreen tip={t("admin:unbanning")} />
        ) : (
          <LoadingFullScreen tip={t("admin:banning")} />
        ))}
      {deleting && <LoadingFullScreen tip={t("admin:deleting")} />}
      {restoring && <LoadingFullScreen tip={t("admin:restoring")} />}
      {unsubscribing && <LoadingFullScreen tip={t("admin:unsubscribing")} />}
      {verifiying &&
        (data?.user?.verified ? (
          <LoadingFullScreen tip={t("admin:unverifying")} />
        ) : (
          <LoadingFullScreen tip={t("admin:verifying")} />
        ))}
    </>
  );
};

export default Client;
