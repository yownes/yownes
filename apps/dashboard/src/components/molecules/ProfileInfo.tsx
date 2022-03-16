import React, { ReactNode } from "react";
import { Tag, Typography } from "antd";
import { useQuery } from "@apollo/client";
import addHours from "date-fns/addHours";
import { useTranslation } from "react-i18next";
import { useHistory } from "react-router-dom";

import { AccountBasicData } from "../../api/types/AccountBasicData";
import { SubscriptionStatus } from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { MY_ACCOUNT } from "../../api/queries";
import { dateTime, differenceTime, longDate } from "../../lib/parseDate";

import {
  Descriptions,
  SubscriptionState,
  TitleWithAction,
  UserState,
  VerifiedState,
} from "./";
import { description } from "./Descriptions";
import { Loading } from "../atoms";

import styles from "./ProfileInfo.module.css";

const { Text } = Typography;

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  extra?: ReactNode;
  verified?: boolean;
}

const ProfileInfo = ({ profile, extra, verified }: ProfileInfoProps) => {
  const history = useHistory();
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const { t } = useTranslation();

  if (!data?.me) {
    return <Loading />;
  }

  const subscriptionInfo = profile && profile.subscription && (
    <>
      <span>{profile?.subscription?.plan?.product?.name} </span>
      <span>
        ({profile?.subscription?.plan?.amount}
        {profile.subscription.plan?.currency === "eur"
          ? " €"
          : profile.subscription.plan?.currency}
        {"/"}
        {t(`${profile.subscription.plan?.interval}`.toLocaleLowerCase())})
      </span>
      {profile.subscription.status === SubscriptionStatus.ACTIVE &&
        (profile.subscription.cancelAtPeriodEnd ? (
          <span>, {t("canceledAtPeriodEnd")}</span>
        ) : (
          <>
            <span>, {t("currentPeriodEnd").toLocaleLowerCase()} </span>
            <span>
              {longDate(new Date(profile.subscription.currentPeriodEnd))}
            </span>
          </>
        ))}
      {profile.subscription.status === SubscriptionStatus.INCOMPLETE && (
        <span>
          ,{" "}
          {t("incomplete", {
            time: differenceTime(
              addHours(new Date(profile.subscription.created), 23),
              new Date()
            ),
          })}
        </span>
      )}
      {profile.subscription.status ===
        SubscriptionStatus.INCOMPLETE_EXPIRED && (
        <span>, {t("incompleteExpired")}</span>
      )}
      {profile.subscription.status === SubscriptionStatus.PAST_DUE && (
        <span>, {t("pastDue")}</span>
      )}
      {profile.subscription.status === SubscriptionStatus.CANCELED && (
        <span>, {t("canceled")}</span>
      )}
    </>
  );

  const info: description[] = [];
  profile?.username &&
    !data?.me.isStaff &&
    info.push({ title: t("username"), description: profile.username });
  profile?.accountStatus &&
    info.push({
      title: t("accountStatus.title"),
      description: <UserState state={profile.accountStatus} />,
    });
  profile?.email &&
    info.push({ title: t("email"), description: profile.email });
  profile?.id &&
    data?.me.isStaff &&
    info.push({ title: t("id"), description: <Tag>{profile?.id}</Tag> });
  profile?.dateJoined &&
    data?.me.isStaff &&
    info.push({
      title: t("registrationDate"),
      description: longDate(new Date(profile.dateJoined)),
    });
  verified &&
    data?.me.isStaff &&
    info.push({
      title: t("verifiedStatus"),
      description: <VerifiedState verified={profile?.verified} />,
    });
  data?.me.isStaff &&
    info.push({
      title: t("isActive"),
      description: <VerifiedState verified={profile?.isActive} />,
    });
  !data?.me.isStaff &&
    info.push({
      title: t("subscription"),
      description: profile?.subscription ? (
        profile.subscription.cancelAtPeriodEnd ||
        profile.subscription.cancelAt ? (
          <>
            <SubscriptionState
              state={profile.subscription.status}
              tooltip={subscriptionInfo}
            />
            {". "}
            {t("cancelAt", {
              date: dateTime(new Date(profile.subscription.cancelAt)),
            })}
          </>
        ) : (
          <SubscriptionState
            state={profile.subscription.status}
            tooltip={subscriptionInfo}
          />
        )
      ) : (
        <Text>{t("noSubscription")}</Text>
      ),
    });

  return (
    <>
      <TitleWithAction
        title={
          data.me.isStaff && profile ? profile?.username : t("profileInfo")
        }
        action={
          !data.me.isStaff
            ? {
                action: () => history.push("/profile/edit"),
                label: t("editProfile"),
                buttonClassName: "button-default-primary",
              }
            : undefined
        }
        extra={data.me.isStaff && extra}
      />
      <Descriptions items={info} />
    </>
  );
};

export default ProfileInfo;
