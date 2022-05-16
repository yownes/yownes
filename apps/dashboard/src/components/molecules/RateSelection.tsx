import React from "react";
import { Button, Col, Row, Typography } from "antd";
import { useTranslation } from "react-i18next";

import { currencySymbol } from "../../lib/currencySymbol";
import type { CheckoutLocationState } from "../../pages/client/Checkout";

import styles from "./RateSelection.module.css";

const { Text, Title } = Typography;

interface RateSelectionProps {
  title: string;
  plan: CheckoutLocationState;
  onPlanSelected: (plan: CheckoutLocationState) => void;
}

const RateSelection = ({ title, plan, onPlanSelected }: RateSelectionProps) => {
  const { t } = useTranslation(["translation", "client"]);

  return (
    <Row gutter={[24, 24]}>
      <Col span={24} style={{ display: "flex", flexDirection: "row" }}>
        <Row align="middle" style={{ flex: 1, flexDirection: "column" }}>
          <Text className={styles.name}>{title}</Text>
          {plan.unitAmount ? (
            <Text className={styles.price}>
              {(plan.unitAmount / 100).toFixed(2).replace(/\./g, ",")}
              {currencySymbol(plan.currency ?? "")}
            </Text>
          ) : (
            <Text className={styles.noPrice}>
              {t("client:notAvailablePlan")}
            </Text>
          )}

          <Text className={styles.tax}>{t("priceWithTaxes")}</Text>
          <Button
            className={`${styles.button} ${
              plan.active ? "button-default-primary" : undefined
            }`}
            disabled={!plan.active}
            onClick={() => onPlanSelected(plan)}
          >
            {t("select")}
          </Button>
        </Row>
      </Col>
    </Row>
  );
};

export default RateSelection;
