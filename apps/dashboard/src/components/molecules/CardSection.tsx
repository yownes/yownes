import React from "react";
import { Card } from "antd";
import { CardElement } from "@stripe/react-stripe-js";
import {
  StripeCardElementChangeEvent,
  StripeCardElementOptions,
} from "@stripe/stripe-js";

interface CardSectionProps {
  onChange: (e: StripeCardElementChangeEvent) => void;
}

const CARD_ELEMENT_OPTIONS: StripeCardElementOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
  hidePostalCode: true,
};

const CardSection = ({ onChange }: CardSectionProps) => {
  return (
    <label>
      <Card>
        <CardElement onChange={onChange} options={CARD_ELEMENT_OPTIONS} />
      </Card>
    </label>
  );
};

export default CardSection;
