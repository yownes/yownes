import React, { useCallback, useEffect } from "react";
import { Button, Card, Col, Input, Form, Typography } from "antd";
import { ApolloCache, FetchResult, useMutation } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Redirect } from "react-router-dom";

import { CREATE_APP } from "../../api/mutations";
import { CreateApp, CreateAppVariables } from "../../api/types/CreateApp";
import { colors } from "../../lib/colors";

import { baseApp } from "./App";
import { Errors } from "../../components/molecules";

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

  const update = useCallback(function (
    cache: ApolloCache<CreateApp>,
    { data }: FetchResult<CreateApp, Record<string, any>, Record<string, any>>
  ) {
    if (data?.createApp?.ok) {
      cache.modify({
        fields: {
          apps(existing, { toReference }) {
            return {
              edges: [
                ...existing.edges,
                {
                  __typename: "StoreAppTypeEdge",
                  node: toReference({ ...data.createApp?.storeApp }),
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
  if (data?.createApp?.ok) {
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
          <Form.Item
            name="name"
            label={t("appName")}
            rules={[{ required: true, message: t("required.app") }]}
          >
            <Input autoFocus />
          </Form.Item>
          <Form.Item
            name="apiLink"
            label={t("storeLocation")}
            rules={[{ required: true, message: t("required.store") }]}
          >
            <Input disabled={Boolean(storeInfo?.link)} type="url" />
          </Form.Item>
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
          >
            {loading ? t("checking") : t("check")}
          </Button>
        </Form>
      </Card>
    </Col>
  );
};

export default NewApp;
