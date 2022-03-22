import React from "react";
import { Typography } from "antd";
import { CreditCardOutlined } from "@ant-design/icons";

import { normalice } from "../../lib/normalice";

import { MastercardIcon, VisaIcon } from "../atoms";

const { Text } = Typography;

interface Last4CardProps {
  data: string;
}

interface ICard {
  brand: string;
  last4: string;
}

const Last4Card = ({ data }: Last4CardProps) => {
  if (!data) return null;
  const card: ICard = JSON.parse(normalice(data));
  return (
    <span style={{ marginRight: 10 }}>
      {card.brand === "mastercard" ? (
        <MastercardIcon />
      ) : card.brand === "visa" ? (
        <VisaIcon />
      ) : (
        <CreditCardOutlined style={{ color: "#808080", marginBottom: 2 }} />
      )}
      <span style={{ marginLeft: 5, marginRight: 3 }}>{" **** "}</span>
      {card.last4}
    </span>
  );
};

export default Last4Card;
