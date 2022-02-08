import React from "react";

import AddPaymentMethodComponent from "../../components/organisms/AddPaymentMethod";
import { AddPaymentMethodProps } from "../../navigation/Profile";

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
