import React from "react";

import type { AddDirectionProps } from "../../navigation/Profile";
import { AddDirection as AddDirectionComponent } from "../../components/organisms";

const AddDirection = ({ route, navigation }: AddDirectionProps) => {
  let address;
  if (route?.params?.address?.id) {
    address = {
      ...route.params.address,
      countryId: route.params.address.country?.id,
      zoneId: route.params.address.zone?.id,
      id: route.params.address.id,
    };
  }
  return (
    <AddDirectionComponent
      address={address}
      onSuccess={() => {
        navigation.goBack();
      }}
    />
  );
};

export default AddDirection;
