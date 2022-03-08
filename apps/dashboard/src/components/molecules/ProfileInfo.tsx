import React, { ReactNode } from "react";
import { Descriptions, Tag, Typography } from "antd";
import { useQuery } from "@apollo/client";
import addHours from "date-fns/addHours";
import { useTranslation } from "react-i18next";

import { AccountBasicData } from "../../api/types/AccountBasicData";
import { SubscriptionStatus } from "../../api/types/globalTypes";
import { MyAccount } from "../../api/types/MyAccount";
import { MY_ACCOUNT } from "../../api/queries";
import { dateTime, differenceTime, longDate } from "../../lib/parseDate";

import { SubscriptionState, UserState, VerifiedState } from "./";
import { Loading } from "../atoms";

const { Item } = Descriptions;
const { Text, Title } = Typography;

interface ProfileInfoProps {
  profile?: AccountBasicData | null;
  action?: ReactNode;
  verified?: boolean;
}

const ProfileInfo = ({ profile, action, verified }: ProfileInfoProps) => {
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

  return (
    <Descriptions
      bordered
      column={2}
      extra={action}
      title={
        <Title level={3} style={{ marginBottom: 0 }}>
          {data.me.isStaff ? profile?.username : t("profileInfo")}
        </Title>
      }
      labelStyle={{ color: "#232323", fontWeight: 500 }}
      layout="vertical"
      size="small"
      style={{ marginBottom: 8 }}
    >
      {profile?.username && !data?.me.isStaff && (
        <Item label={t("username")}>{profile.username}</Item>
      )}
      {profile?.email && <Item label={t("email")}>{profile.email}</Item>}
      {profile?.id && data?.me.isStaff && (
        <Item label={t("id")}>
          <Tag>{profile?.id}</Tag>
        </Item>
      )}
      {profile?.accountStatus && (
        <Item label={t("accountStatus.title")}>
          <UserState state={profile.accountStatus} />
        </Item>
      )}
      {profile?.dateJoined && data?.me.isStaff && (
        <Item label={t("registrationDate")}>
          {longDate(new Date(profile.dateJoined))}
        </Item>
      )}
      {verified && data?.me.isStaff && (
        <Item label={t("verifiedStatus")}>
          <VerifiedState verified={profile?.verified} />
        </Item>
      )}
      {data?.me.isStaff && (
        <Item label={t("isActive")}>
          <VerifiedState verified={profile?.isActive} />
        </Item>
      )}
      {!data.me.isStaff && (
        <Item label={t("subscription")}>
          {profile?.subscription ? (
            profile.subscription.cancelAtPeriodEnd ||
            profile.subscription.cancelAt ? (
              <>
                <SubscriptionState
                  state={profile.subscription.status}
                  tooltip={subscriptionInfo}
                />
                <Tag>
                  {t("cancelAt", {
                    date: dateTime(new Date(profile.subscription.cancelAt)),
                  })}
                </Tag>
              </>
            ) : (
              <SubscriptionState
                state={profile.subscription.status}
                tooltip={subscriptionInfo}
              />
            )
          ) : (
            <Text>{t("noSubscription")}</Text>
          )}
        </Item>
      )}
    </Descriptions>
  );
};

export default ProfileInfo;
