import React from "react";
import { Button, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { PlanInterval } from "../../api/types/globalTypes";

import { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateSelection.module.css";

const { Text, Title } = Typography;

interface RateSelectionProps {
  subtitle?: string;
  title: string;
  plan: CheckoutLocationState;
  onPlanSelected: (plan: CheckoutLocationState) => void;
}

const RateSelection = ({
  subtitle,
  title,
  plan,
  onPlanSelected,
}: RateSelectionProps) => {
  const { t } = useTranslation("translation");
  const interval = JSON.parse(plan.recurring).interval.toUpperCase();
  return (
    <div className={styles.container}>
      <Text>{subtitle}</Text>
      <Title level={3}>{title}</Title>
      <Title level={4}>
        <Text strong>
          {plan.unitAmount
            ? (plan.unitAmount / 100).toFixed(2).replace(/\./g, ",")
            : "-"}
        </Text>
        <Text>
          {" €/"}
          {interval === PlanInterval.DAY
            ? t("day")
            : interval === PlanInterval.WEEK
            ? t("week")
            : interval === PlanInterval.MONTH
            ? t("month")
            : interval === PlanInterval.YEAR
            ? t("year")
            : "-"}
        </Text>
      </Title>
      <Button onClick={() => onPlanSelected(plan)} type="primary">
        {t("select")}
      </Button>
      <Text type="secondary" style={{ display: "block", marginTop: 10 }}>
        {t("priceWithTaxes")}
      </Text>
    </div>
  );
};

export default RateSelection;
