import React from "react";
import { message, Popconfirm, Typography } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import { Trans, useTranslation } from "react-i18next";

import { DELETE_CLIENT } from "../../api/mutations";
import { CLIENT } from "../../api/queries";
import { Client as IClient, ClientVariables } from "../../api/types/Client";
import {
  DeleteClient as IDeleteClient,
  DeleteClientVariables,
} from "../../api/types/DeleteClient";

import { Loading, LoadingFullScreen } from "../atoms";

const { Text } = Typography;

interface RestoreClientProps {
  id: string;
  menuVisible?: (visible: boolean) => void;
}

const RestoreClient = ({ id, menuVisible }: RestoreClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const { data } = useQuery<IClient, ClientVariables>(CLIENT, {
    variables: { id },
  });
  const [deleteClient, { loading: restoring }] = useMutation<
    IDeleteClient,
    DeleteClientVariables
  >(DELETE_CLIENT);

  if (!data?.user) return <Loading />;

  return (
    <>
      <Popconfirm
        cancelText={t("cancel")}
        okText={t("admin:restore")}
        title={
          <Trans i18nKey={"warnings.restoreClient"} ns="admin">
            <strong></strong>
            <p></p>
          </Trans>
        }
        placement="left"
        onConfirm={() => {
          deleteClient({
            variables: { active: true, userId: id },
            update(cache, { data: del }) {
              if (del?.deleteClient?.ok && data.user) {
                cache.modify({
                  id: cache.identify({
                    ...data?.user,
                  }),
                  fields: {
                    isActive: () => true,
                  },
                });
                menuVisible && menuVisible(false);
                message.success(t("admin:restoreClientSuccessful"), 4);
              } else {
                menuVisible && menuVisible(false);
                message.error(
                  t(`admin:errors.${del?.deleteClient?.error}`, t("error")),
                  4
                );
              }
            },
          });
        }}
      >
        <Text style={{ display: "flex", flex: 1 }} type="danger">
          {t("admin:restoreClient")}
        </Text>
      </Popconfirm>
      {restoring && <LoadingFullScreen tip={t("admin:restoringClient")} />}
    </>
  );
};

export default RestoreClient;
