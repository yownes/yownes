import React, { useState } from "react";
import { Button, Modal, Popconfirm } from "antd";
import { useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { APPS, MY_ACCOUNT } from "../../api/queries";
import type { Apps, AppsVariables } from "../../api/types/Apps";
import type { MyAccount } from "../../api/types/MyAccount";
import { Loading } from "../atoms";
import { ProfileDangerZone } from "../organisms";

function handleWarning(user?: MyAccount, apps?: Apps) {
  if (!user) {
    return "";
  }
  if (user?.me?.subscription) {
    if (apps?.apps && apps?.apps?.edges.length > 0) {
      return "warnings.accountSubsApps";
    } else {
      return "warnings.accountSubsNoApps";
    }
  } else {
    if (apps?.apps && apps?.apps?.edges.length > 0) {
      return "warnings.accountNoSubsApps";
    } else {
      return "warnings.accountNoSubsNoApps";
    }
  }
}

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
          <Trans i18nKey={handleWarning(data, appsData)} ns="client">
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
