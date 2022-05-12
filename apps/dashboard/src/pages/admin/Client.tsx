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
import type { MenuProps } from "antd";
import { EllipsisOutlined } from "@ant-design/icons";
import { useQuery, useMutation } from "@apollo/client";
import type { TFunction } from "i18next";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { DELETE_APP, RESTORE_APP } from "../../api/mutations";
import { CLIENT } from "../../api/queries";
import type {
  Client as IClient,
  ClientVariables,
  Client_user_apps_edges_node,
} from "../../api/types/Client";
import type { DeleteApp, DeleteAppVariables } from "../../api/types/DeleteApp";
import type {
  RestoreApp,
  RestoreAppVariables,
} from "../../api/types/RestoreApp";
import type { Filter } from "../../lib/filterColumns";
import { getColumnFilterProps } from "../../lib/filterColumns";
import { Loading, LoadingFullScreen } from "../../components/atoms";
import {
  AppsTable,
  BanClient,
  BuildsTable,
  DeleteClient,
  ProfileInfo,
  RestoreClient,
  VerifiedState,
  VerifyClient,
} from "../../components/molecules";
import { getBuildsForCustomer } from "../../components/molecules/BuildsTable";
import {
  ClientSubscriptionData,
  CustomerData,
  InvoicesData,
  PaymentMethod,
} from "../../components/organisms";

const { Title } = Typography;

interface ClientProps extends Record<string, string> {
  id: string;
}

type MenuItemProps = MenuProps["items"];

function getDeleteFilters(t: TFunction) {
  const filters: Filter[] = [];
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
    variables: { id: id ?? "" },
  });
  const [deleteApp, { loading: deleting }] = useMutation<
    DeleteApp,
    DeleteAppVariables
  >(DELETE_APP);
  const [restoreApp, { loading: restoring }] = useMutation<
    RestoreApp,
    RestoreAppVariables
  >(RESTORE_APP);

  if (loading) {
    return <Loading />;
  }

  const items: MenuItemProps = [
    {
      key: "ban",
      label: <BanClient data={data} menuVisible={setIsOverlayVisible} />,
    },
    data?.user?.isActive
      ? {
          key: "delete",
          label: (
            <DeleteClient
              data={data}
              id={id ?? ""}
              menuVisible={setIsOverlayVisible}
            />
          ),
        }
      : null,
    !data?.user?.isActive
      ? {
          key: "restore",
          label: (
            <RestoreClient id={id ?? ""} menuVisible={setIsOverlayVisible} />
          ),
        }
      : null,
    data?.user
      ? {
          key: "verify",
          label: <VerifyClient data={data} menuVisible={setIsOverlayVisible} />,
        }
      : null,
  ];

  const profieActions = (
    <Dropdown
      overlay={<Menu items={items} />}
      trigger={["click"]}
      visible={isOverlayVisible}
      onVisibleChange={setIsOverlayVisible}
    >
      <Button
        className="button-default-default"
        shape="circle"
        icon={<EllipsisOutlined style={{ color: "#232323" }} />}
      />
    </Dropdown>
  );

  return (
    <Col
      xs={{ span: 22, offset: 1 }}
      sm={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 16, offset: 4 }}
    >
      <Row gutter={[24, 24]}>
        <Col span={24}>
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
        <Col />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <CustomerData customer={data?.user} staff />
        </Col>
        <Col />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <ClientSubscriptionData client={data?.user} />
        </Col>
        <Col />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <InvoicesData userId={data?.user ? data.user.id! : ""} />
        </Col>
        <Col />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <Card>
            <Row gutter={10}>
              <Col span={24}>
                <Title level={2} style={{ paddingBottom: 24 }}>
                  {t("paymentMethod")}
                </Title>
                <PaymentMethod
                  customer={data?.user?.customer}
                  staff
                  userId={data?.user ? data.user.id! : ""}
                />
              </Col>
            </Row>
          </Card>
        </Col>
        <Col />
      </Row>
      <Row gutter={[24, 24]}>
        <Col span={24}>
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
                          cancelButtonProps={{
                            className: "button-default-default",
                          }}
                          onConfirm={() =>
                            restoreApp({
                              variables: {
                                id: record.id,
                              },
                              update(cache, { data: restore }) {
                                if (restore?.restoreApp?.ok) {
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
                                      `admin:errors.${restore?.restoreApp?.error}`,
                                      t("error")
                                    ),
                                    4
                                  );
                                }
                              },
                            })
                          }
                          title={t("admin:warningRestoreApp")}
                        >
                          <Button className="link-button" type="link">
                            {t("admin:restoreApp")}
                          </Button>
                        </Popconfirm>
                      );
                    }
                    return (
                      <Popconfirm
                        cancelButtonProps={{
                          className: "button-default-default",
                        }}
                        onConfirm={() => {
                          deleteApp({
                            variables: {
                              id: record.id,
                            },
                            update(cache, { data: del }) {
                              if (del?.deleteApp?.ok) {
                                const appId = cache.identify({ ...record });
                                cache.evict({
                                  id: appId,
                                });
                                cache.gc();
                                message.success(
                                  t("admin:deleteAppSuccessful"),
                                  4
                                );
                              } else {
                                message.error(
                                  t(`admin:errors.${del?.deleteApp?.error}`),
                                  4
                                );
                              }
                            },
                          });
                        }}
                        title={t("admin:warnings.app")}
                      >
                        <Button className="link-button" danger type="link">
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
        <Col span={24}>
          <Card>
            <Title level={2}>{t("admin:builds")}</Title>
            <BuildsTable dataSource={getBuildsForCustomer(data?.user)} />
          </Card>
        </Col>
      </Row>
      {deleting && <LoadingFullScreen tip={t("admin:deleting")} />}
      {restoring && <LoadingFullScreen tip={t("admin:restoring")} />}
    </Col>
  );
};

export default Client;
