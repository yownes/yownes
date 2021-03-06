import React, { useState } from "react";
import { Button, Card, Col, Result, Row, Steps } from "antd";
import { useQuery } from "@apollo/client";
import { useTranslation } from "react-i18next";
import { Link, Redirect } from "react-router-dom";

import { MY_ACCOUNT } from "../../api/queries";
import {
  AccountAccountStatus,
  SubscriptionStatus,
} from "../../api/types/globalTypes";
import type { MyAccount } from "../../api/types/MyAccount";
import type { Plans_products_edges_node_prices_edges_node } from "../../api/types/Plans";
import { Loading } from "../../components/atoms";
import { CheckoutForm } from "../../components/molecules";
import { CustomerData, RateTable } from "../../components/organisms";

export interface CheckoutLocationState
  extends Plans_products_edges_node_prices_edges_node {
  name: string;
}

const { Step } = Steps;

const Checkout = () => {
  const { data } = useQuery<MyAccount>(MY_ACCOUNT);
  const [current, setCurrent] = useState(0);
  const [plan, setPlan] = useState<CheckoutLocationState>();
  const [status, setStatus] = useState<SubscriptionStatus>();
  const { t } = useTranslation(["translation", "client"]);

  if (!data?.me?.accountStatus) {
    return <Loading />;
  }
  if (!plan && current !== 0) {
    setCurrent(0);
  }
  if (
    data.me.accountStatus === AccountAccountStatus.BANNED ||
    (data.me.accountStatus !== AccountAccountStatus.REGISTERED &&
      !(
        data?.me?.subscription?.status === SubscriptionStatus.ACTIVE &&
        data.me.subscription.cancelAtPeriodEnd
      ))
  ) {
    if (current === 0) {
      return <Redirect to="/profile" />;
    }
    if (current === 4) {
      return <Redirect to="/profile" />;
    }
  }
  return (
    <Col span={24}>
      <Row gutter={[24, 24]}>
        <Col
          xs={{ span: 22, offset: 1 }}
          sm={{ span: 20, offset: 2 }}
          md={{ span: 18, offset: 3 }}
          lg={{ span: 16, offset: 4 }}
        >
          <Card>
            <Steps current={current} onChange={(c) => setCurrent(c)}>
              <Step
                disabled={current > 2}
                key={0}
                title={t("client:subscriptionSteps.plan")}
              />
              <Step
                disabled={current !== 1 && current !== 2}
                key={1}
                title={t("client:subscriptionSteps.customer")}
              />
              <Step
                disabled={current !== 2}
                key={2}
                title={t("client:subscriptionSteps.pay")}
              />
              <Step
                disabled={current !== 3}
                key={3}
                title={t("client:subscriptionSteps.end")}
              />
            </Steps>
          </Card>
        </Col>
        <Col span={24}>
          {current === 0 && (
            <RateTable
              onPlanSelected={(p: CheckoutLocationState) => {
                setPlan(p);
                setCurrent(1);
              }}
            />
          )}
          {current === 1 && (
            <CustomerData customer={data.me} onFinish={() => setCurrent(2)} />
          )}
          {current === 2 && (
            <CheckoutForm
              plan={plan!}
              onSubscribed={(s) => {
                setStatus(s);
                setCurrent(3);
              }}
            />
          )}
          {current === 3 && (
            <Col
              xs={{ span: 22, offset: 1 }}
              sm={{ span: 20, offset: 2 }}
              md={{ span: 18, offset: 3 }}
              lg={{ span: 16, offset: 4 }}
              style={{ padding: "0px 4px" }}
            >
              <Card>
                <Result
                  status={
                    status === SubscriptionStatus.ACTIVE ? "success" : "warning"
                  }
                  title={
                    status === SubscriptionStatus.ACTIVE
                      ? t("client:subscribeSuccessful")
                      : t("client:subscribeFail")
                  }
                  subTitle={
                    status === SubscriptionStatus.ACTIVE
                      ? t("client:subscribeDescriptionSuccessful")
                      : t("client:subscribeDescriptionFail")
                  }
                  extra={
                    <Link
                      to={
                        status === SubscriptionStatus.ACTIVE
                          ? "/profile"
                          : "/profile/edit"
                      }
                    >
                      <Button type="primary" onClick={() => setCurrent(4)}>
                        {status === SubscriptionStatus.ACTIVE
                          ? t("goDashboard")
                          : t("goProfile")}
                      </Button>
                    </Link>
                  }
                />
              </Card>
            </Col>
          )}
        </Col>
      </Row>
    </Col>
  );
};

export default Checkout;
