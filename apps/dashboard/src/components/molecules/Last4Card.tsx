import React from "react";
import { CreditCardOutlined } from "@ant-design/icons";

import { normalize } from "../../lib/normalize";
import { MastercardIcon, VisaIcon } from "../atoms";

interface Last4CardProps {
  data: string;
}

interface ICard {
  brand: string;
  last4: string;
}

function handleBrand(brand: string) {
  if (brand === "mastercard") {
    return <MastercardIcon />;
  } else if (brand === "visa") {
    return <VisaIcon />;
  } else {
    return <CreditCardOutlined style={{ color: "#808080", marginBottom: 2 }} />;
  }
}

const Last4Card = ({ data }: Last4CardProps) => {
  if (!data) {
    return null;
  }
  const card: ICard = JSON.parse(normalize(data));
  return (
    <span style={{ marginRight: 10 }}>
      {handleBrand(card.brand)}
      <span style={{ marginLeft: 5, marginRight: 3 }}>{" **** "}</span>
      {card.last4}
    </span>
  );
};

export default Last4Card;
