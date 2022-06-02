import React, { useEffect, useState } from "react";
import { Col, Form, message, Row, Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

import type { App_app } from "../../api/types/App";
import type { StoreAppInput } from "../../api/types/globalTypes";
import { BuildBuildStatus } from "../../api/types/globalTypes";
import { getAppBuildState } from "../../lib/appBuildState";
import { colors } from "../../lib/colors";
import { longDate } from "../../lib/parseDate";
import { TextField } from "../atoms";

import styles from "./AppInfo.module.css";

import { BuildState, ImageUpload } from ".";

message.config({ maxCount: 1 });
const { Text, Title } = Typography;

interface Build {
  limit: number;
  remaining: number;
  renewal: Date | undefined;
}

interface AppInfoProps {
  app?: App_app;
  build: Build;
  data: StoreAppInput;
  id?: string;
  onChange: (app: StoreAppInput) => void;
}

const AppInfo = ({ app, build, data, id, onChange }: AppInfoProps) => {
  const { t } = useTranslation(["translation", "client"]);
  const [appBuildStatus, setAppBuildStatus] = useState<BuildBuildStatus>(
    BuildBuildStatus.WAITING
  );

  useEffect(() => {
    setAppBuildStatus(getAppBuildState(app));
  }, [app]);

  return (
    <>
      <Row gutter={[24, 24]}>
        <Col span={24}>
          <div className={styles.titleContainer}>
            <Title level={2}>{t("client:appBasicData")}</Title>
            <Tooltip
              placement="left"
              title={
                <>
                  <span>
                    {t("client:warnings.buildsLimit", { num: build.limit })}
                  </span>
                  <br />
                  <span>
                    {t("client:warnings.buildsRemaining", {
                      num: build.remaining,
                    })}
                  </span>
                  <br />
                  {build.renewal ? (
                    <span>
                      {t("client:warnings.buildsRenewal", {
                        num: longDate(build.renewal),
                      })}
                    </span>
                  ) : (
                    <span>{t("client:warnings.buildsNoRenewal")}</span>
                  )}
                  <br />
                  <span>ID: {id}</span>
                </>
              }
            >
              <InfoCircleOutlined
                style={{
                  color: colors.green,
                  fontSize: 16,
                }}
              />
            </Tooltip>
          </div>
        </Col>
        <Col span={6}>
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
        </Col>
        <Col span={18}>
          <div className={styles.infoContainer}>
            <div>
              <div className={styles.infoStatusContainer}>
                <Text className={styles.infoTitle}>{t("state")}</Text>
              </div>
              <div>
                <BuildState state={appBuildStatus} />
              </div>
            </div>
            <div>
              <div className={styles.infoLinksContainer}>
                <Text className={styles.infoTitle}>
                  {t("client:linksToStores")}
                </Text>
              </div>
              <div>
                {app?.storeLinks?.ios ? (
                  <a
                    className={styles.storeLink}
                    href={app.storeLinks.ios}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    iOS
                  </a>
                ) : (
                  <Text className={styles.storeNoLink} disabled>
                    iOS
                  </Text>
                )}
                {app?.storeLinks?.android ? (
                  <a
                    className={styles.storeLink}
                    href={app.storeLinks.android}
                    rel="noopener noreferrer"
                    target="_blank"
                  >
                    Android
                  </a>
                ) : (
                  <Text className={styles.storeNoLink} disabled>
                    Android
                  </Text>
                )}
              </div>
            </div>
          </div>
        </Col>
        <Col span={24}>
          <Form
            initialValues={{
              name: app?.name,
              link: app?.apiLink ?? "",
            }}
            validateMessages={{ required: t("client:requiredInput") }}
          >
            <Row gutter={[24, 24]}>
              <Col span={24} md={12}>
                <TextField
                  defaultValue={app?.name}
                  label={t("client:appName")}
                  name="name"
                  onChange={(value) =>
                    onChange({
                      ...data,
                      name: value.target.value,
                    })
                  }
                  rules={[{ required: true }]}
                  wrapperClassName={styles.input}
                />
              </Col>
              <Col span={24} md={12}>
                <TextField
                  defaultValue={app?.apiLink ?? ""}
                  label={t("client:storeLink")}
                  name="link"
                  onChange={(value) =>
                    onChange({
                      ...data,
                      apiLink: value.target.value,
                    })
                  }
                  rules={[{ required: true }]}
                  wrapperClassName={styles.input}
                />
              </Col>
              <Col span={24}>
                <TextField
                  defaultValue={app?.description ?? ""}
                  label={t("client:storeDescription")}
                  name="description"
                  onChange={(value) =>
                    onChange({
                      ...data,
                      description: value.target.value,
                    })
                  }
                  rows={3}
                  type="textarea"
                  wrapperClassName={styles.input}
                />
              </Col>
            </Row>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default AppInfo;
