import React, { useCallback, useEffect } from "react";
import { Button, Card, Col, Form, message, Typography } from "antd";
import type { ApolloCache, FetchResult } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";

import { CREATE_APP } from "../../api/mutations";
import { MY_ACCOUNT } from "../../api/queries";
import type { CreateApp, CreateAppVariables } from "../../api/types/CreateApp";
import { AccountAccountStatus } from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import { colors } from "../../lib/colors";
import { Loading, TextField } from "../../components/atoms";
import { Errors } from "../../components/molecules";

import { baseApp } from "./App";

const { Title } = Typography;

const NewApp = () => {
  const storeInfo:
    | { link: string; name: string; color: { color: string; text: string } }
    | undefined = (window as any).__YOWNES_STORE_INFO__;
  const { t } = useTranslation("client");
  const [create, { data, loading }] = useMutation<
    CreateApp,
    CreateAppVariables
  >(CREATE_APP);
  const { data: accountData, loading: loadingAccount } =
    useQuery<MyAccount>(MY_ACCOUNT);

  const update = useCallback(function (
    cache: ApolloCache<CreateApp>,
    {
      data: app,
    }: FetchResult<CreateApp, Record<string, any>, Record<string, any>>
  ) {
    if (app?.createApp?.ok) {
      cache.modify({
        fields: {
          apps(existing, { toReference }) {
            return {
              edges: [
                ...existing.edges,
                {
                  __typename: "StoreAppTypeEdge",
                  node: toReference({ ...app.createApp?.storeApp }),
                },
              ],
            };
          },
        },
      });
    }
  },
  []);

  useEffect(() => {
    if (storeInfo) {
      create({
        variables: {
          data: {
            apiLink: storeInfo.link,
            name: storeInfo.name,
            color: baseApp.color,
          },
        },
        update,
      });
    }
  }, [storeInfo, create, update]);

  if (loadingAccount) {
    return <Loading />;
  }

  if (accountData?.me?.accountStatus === AccountAccountStatus.BANNED) {
    return <Redirect to="/profile" />;
  }

  if (data?.createApp?.ok) {
    message.success(t("addNewAppSuccessful"), 4);
    return <Redirect to={`/app/${data.createApp.storeApp?.id}`} />;
  }

  return (
    <Col
      xs={{ span: 22, offset: 1 }}
      sm={{ span: 20, offset: 2 }}
      md={{ span: 18, offset: 3 }}
      lg={{ span: 16, offset: 4 }}
    >
      <Card>
        <Title level={2}>{t("addApp")}</Title>
        <Form
          initialValues={{
            name: storeInfo?.name,
            apiLink: storeInfo?.link,
          }}
          onFinish={(values) => {
            create({
              variables: {
                data: {
                  apiLink: values.apiLink,
                  name: values.name,
                  color: baseApp.color,
                },
              },
              update,
            });
          }}
          style={{ paddingTop: 24 }}
        >
          <TextField
            autofocus
            label={t("appName")}
            name="name"
            rules={[{ required: true, message: t("required.app") }]}
          />
          <TextField
            disabled={Boolean(storeInfo?.link)}
            label={t("storeLocation")}
            name="apiLink"
            rules={[{ required: true, message: t("required.store") }]}
            type="url"
          />
          {storeInfo?.link && !data?.createApp?.ok && (
            <div>{t("checkLocation")}</div>
          )}
          {!storeInfo?.link && (
            <div style={{ color: colors.secondary }}>
              <div style={{ paddingBottom: 16 }}>
                {t("installInstructions.descName")}
              </div>
              <div style={{ paddingBottom: 16 }}>
                {t("installInstructions.descURL")}
              </div>
            </div>
          )}
          {data?.createApp?.error && (
            <div style={{ paddingBottom: 16 }}>
              <Errors
                errors={{
                  nonFieldErrors: [
                    {
                      message: t(`errors.${data?.createApp?.error}`),
                      code: "error",
                    },
                  ],
                }}
              />
            </div>
          )}
          <Button
            type="primary"
            htmlType="submit"
            disabled={loading}
            loading={loading}
            style={{ marginTop: 8 }}
          >
            {loading ? t("checking") : t("check")}
          </Button>
        </Form>
      </Card>
    </Col>
  );
};

export default NewApp;
