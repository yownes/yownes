import React, { useEffect, useState } from "react";
import { message, Modal, Typography } from "antd";
import { useMutation, useQuery } from "@apollo/client";
import reverse from "lodash/reverse";
import { useTranslation } from "react-i18next";

import { UPDATE_SUBSCRIPTION } from "../../api/mutations";
import { CLIENT, PLANS, UPCOMING_INVOICE } from "../../api/queries";
import { Client_user } from "../../api/types/Client";
import { PlanInterval, SubscriptionStatus } from "../../api/types/globalTypes";
import {
  Plans,
  Plans_products_edges_node,
  Plans_products_edges_node_features_edges_node,
} from "../../api/types/Plans";
import {
  UpdateSubscription,
  UpdateSubscriptionVariables,
} from "../../api/types/UpdateSubscription";
import connectionToNodes from "../../lib/connectionToNodes";
import { normalize } from "../../lib/normalize";

import { LoadingFullScreen } from "../atoms";
import { ChangeSubscription } from "../organisms";

import styles from "./ChangeSubscriptionClient.module.css";

message.config({ maxCount: 1 });
const { Text } = Typography;

interface ChangeSubscriptionClientProps {
  data: Client_user | null | undefined;
  menuVisible?: (visible: boolean) => void;
}

const ChangeSubscriptionClient = ({
  data,
  menuVisible,
}: ChangeSubscriptionClientProps) => {
  const { t } = useTranslation(["translation", "admin"]);
  const [activeApps, setActiveApps] = useState<number>(0);
  const [amount, setAmount] = useState<number | null | undefined>(null);
  const [currency, setCurrency] = useState<string | undefined>(undefined);
  const [features, setFeatures] =
    useState<Plans_products_edges_node_features_edges_node[]>();
  const [interval, setInterval] = useState<PlanInterval>(PlanInterval.MONTH);
  const [isUpdated, setIsUpdated] = useState(false);
  const [modalStep, setModalStep] = useState(false);
  const [plan, setPlan] = useState<Plans_products_edges_node>();
  const [planId, setPlanId] = useState<string>();
  const [priceId, setPriceId] = useState<string | null | undefined>(null);
  const [products, setProducts] = useState<
    Plans_products_edges_node[] | null | undefined
  >(null);
  const [showModal, setShowModal] = useState(false);

  const { data: plansData, loading: loadingPlans } = useQuery<Plans>(PLANS);

  const [
    updateSubscription,
    { loading: updating, data: updateSubscriptionData, reset },
  ] = useMutation<UpdateSubscription, UpdateSubscriptionVariables>(
    UPDATE_SUBSCRIPTION,
    {
      refetchQueries: [
        { query: CLIENT, variables: { id: data?.id } },
        {
          query: UPCOMING_INVOICE,
          variables: {
            cId: data?.id ?? "",
            sId: data?.subscription?.id ?? "",
          },
        },
      ],
    }
  );

  useEffect(() => {
    setProducts(
      reverse(
        connectionToNodes(plansData?.products).filter((prod) => prod.active)
      )
    );
  }, [plansData]);
  useEffect(() => {
    setActiveApps(
      connectionToNodes(data?.apps).filter((app) => app.isActive).length
    );
  }, [data?.apps]);
  useEffect(() => {
    setPlan(products?.find((product) => product.id === planId));
  }, [planId, products]);
  useEffect(() => {
    if (planId) {
      setFeatures(
        connectionToNodes(
          products?.find((prod) => prod.id === planId)?.features
        )
      );
    }
  }, [planId, products]);
  useEffect(() => {
    if (plan?.prices) {
      const price = connectionToNodes(plan.prices)
        .filter((price) => price.active)
        .find(
          (price) =>
            JSON.parse(normalize(price.recurring!!)).interval.toUpperCase() ===
            interval
        );
      setAmount(price?.unitAmount);
      setCurrency(price?.currency);
      setPriceId(price?.stripeId);
    }
  }, [interval, plan]);
  useEffect(() => {
    if (data?.subscription?.plan) {
      const priceInterval = JSON.parse(
        normalize(
          data.subscription.plan.product?.prices.edges.find(
            (price) =>
              price?.node &&
              price?.node.stripeId === data.subscription?.plan?.stripeId
          )?.node?.recurring!!
        )
      ).interval;
      if (priceInterval) {
        setInterval(priceInterval.toUpperCase());
      }
    }
  }, [data]);

  useEffect(() => {
    if (updateSubscriptionData?.updateSubscription?.ok) {
      if (isUpdated) {
        setShowModal(!showModal);
        message.success(t("client:updateSubscriptionSuccessful"), 4);
        setIsUpdated(false);
      }
    }
  }, [isUpdated, updateSubscriptionData?.updateSubscription]);

  if (!data)
    return (
      <Text disabled style={{ display: "flex", flex: 1 }} type="danger">
        {t("admin:cancelClientSubscription")}
      </Text>
    );

  const active =
    data?.subscription?.status === SubscriptionStatus.ACTIVE &&
    data.subscription.cancelAtPeriodEnd === false;
  const incomplete =
    data?.subscription?.status === SubscriptionStatus.INCOMPLETE;
  const pastDue = data?.subscription?.status === SubscriptionStatus.PAST_DUE;
  const disabled = !(active || incomplete || pastDue);

  return (
    <>
      <Text
        disabled={disabled}
        onClick={() => {
          if (!disabled) {
            setPlanId(data.subscription?.plan?.product?.id);
            menuVisible && menuVisible(false);
            setShowModal(true);
          }
        }}
        style={{ display: "flex", flex: 1 }}
        type="danger"
      >
        {t("admin:changeClientSubscription")}
      </Text>
      <Modal
        destroyOnClose
        title={
          modalStep ? t("client:confirmNewPlan") : t("client:selectNewPlan")
        }
        visible={showModal}
        afterClose={reset}
        onCancel={() => {
          setInterval(PlanInterval.MONTH);
          setModalStep(false);
          setShowModal(!showModal);
        }}
        cancelText={modalStep ? t("back") : t("cancel")}
        okText={modalStep ? t("confirm") : t("next")}
        okButtonProps={{
          loading: updating,
          onClick: () => {
            if (modalStep) {
              if (data.subscription?.stripeId && priceId) {
                updateSubscription({
                  variables: {
                    subscriptionId: data.subscription.stripeId,
                    priceId: priceId,
                  },
                });
                setIsUpdated(true);
              } else {
                message.error(t("client:updateSubscriptionError"), 4);
              }
            } else {
              setModalStep(true);
            }
          },
        }}
        cancelButtonProps={{
          className: "button-default-default",
          onClick: () => {
            if (modalStep) {
              reset();
              setModalStep(false);
            } else {
              setShowModal(false);
            }
          },
        }}
      >
        <ChangeSubscription
          activeApps={activeApps}
          amount={amount}
          currency={currency}
          currentProductId={data.subscription?.plan?.product?.id}
          error={
            updateSubscriptionData?.updateSubscription?.error
              ? t(
                  `client:errors.${updateSubscriptionData?.updateSubscription?.error}`,
                  t("error")
                )
              : undefined
          }
          features={features}
          interval={interval}
          loading={loadingPlans}
          onChangeInterval={setInterval}
          onChangePlan={(plan) => setPlanId(plan)}
          plan={plan ?? data.subscription?.plan?.product ?? undefined}
          planId={planId}
          plansFeatures={connectionToNodes(plansData?.features)}
          products={products || []}
          step={modalStep}
        />
      </Modal>
      {updating && <LoadingFullScreen tip={t("client:updatingSubscription")} />}
    </>
  );
};

export default ChangeSubscriptionClient;
