import React, { useState } from "react";
import { Button, Modal, Popconfirm } from "antd";
import { useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { APPS, MY_ACCOUNT } from "../../api/queries";
import type { Apps, AppsVariables } from "../../api/types/Apps";
import type { MyAccount } from "../../api/types/MyAccount";
import { Loading } from "../atoms";
import { ProfileDangerZone } from "../organisms";

const DeleteAccount = () => {
  const { t } = useTranslation(["translation", "client"]);
  const [confirmPassword, setConfirmPassword] = useState(false);
  const { data, loading } = useQuery<MyAccount>(MY_ACCOUNT);
  const { data: appsData, loading: loadingApps } = useQuery<
    Apps,
    AppsVariables
  >(APPS, {
    variables: { is_active: true },
  });

  if (loading || loadingApps) {
    return <Loading />;
  }

  return (
    <div style={{ paddingTop: 20 }}>
      <Popconfirm
        cancelButtonProps={{ className: "button-default-default" }}
        cancelText={t("cancel")}
        okText={t("delete")}
        title={
          <Trans
            i18nKey={
              data?.me?.subscription
                ? appsData?.apps && appsData?.apps?.edges.length > 0
                  ? "warnings.accountSubsApps"
                  : "warnings.accountSubsNoApps"
                : appsData?.apps && appsData?.apps?.edges.length > 0
                ? "warnings.accountNoSubsApps"
                : "warnings.accountNoSubsNoApps"
            }
            ns="client"
          >
            <strong />
            <p />
          </Trans>
        }
        onConfirm={() => {
          setConfirmPassword(true);
        }}
      >
        <Button type="primary" danger>
          {t("client:deleteAccount")}
        </Button>
      </Popconfirm>
      <Modal
        destroyOnClose
        footer={null}
        onCancel={() => {
          setConfirmPassword(false);
        }}
        title={t("client:deleteAccountTitle")}
        visible={confirmPassword}
      >
        <ProfileDangerZone
          confirmPassword={confirmPassword}
          onCancel={() => setConfirmPassword(false)}
        />
      </Modal>
    </div>
  );
};

export default DeleteAccount;
