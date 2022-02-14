import React from "react";

import AddPaymentMethodComponent from "../../components/organisms/AddPaymentMethod";
import type { AddPaymentMethodProps } from "../../navigation/Profile";

const AddPaymentMethod = ({ navigation }: AddPaymentMethodProps) => {
  return (
    <AddPaymentMethodComponent
      onSuccess={() => {
        navigation.goBack();
      }}
    />
  );
};

export default AddPaymentMethod;
