import React, { useCallback, useEffect, useState } from "react";
import { Button as NativeButton } from "react-native";
import { useForm } from "react-hook-form";
import type {
  AddAddress_accountAddAddress,
  AccountAddressInput,
} from "@yownes/api";
import { useAddAddress, useDeleteAddress, useEditAddress } from "@yownes/api";

import { useNavigation } from "../../../navigation/Root";
import { Box, Text, Switch, Button } from "../../atoms";
import { Confirm, FormFields, SelectProvider } from "../../molecules";

import ListZones from "./ListZones";
import ListCountries from "./ListCountries";

interface AddDirectionProps {
  address?: AccountAddressInput & { id: string };
  onSuccess?: (address?: AddAddress_accountAddAddress) => void;
}

const initialState: AccountAddressInput = {
  firstName: "",
  lastName: "",
  address1: "",
  address2: "",
  countryId: null,
  zoneId: null,
  city: "",
  zipcode: "",
};

const AddDirection = ({ address, onSuccess }: AddDirectionProps) => {
  const [isDefault, setIsDefault] = useState(true);
  const navigation = useNavigation();
  const [addAddress] = useAddAddress({ onSuccess });
  const [editAddress] = useEditAddress({ onSuccess });
  const [deleteAddress] = useDeleteAddress({ onSuccess });
  const { control, handleSubmit, watch } = useForm<AccountAddressInput>({
    defaultValues: address || initialState,
  });
  const onSubmit = useCallback(
    (data: AccountAddressInput) => {
      if (address) {
        editAddress({ variables: { id: address.id, address: data } });
      } else {
        addAddress({
          variables: {
            address: data,
          },
        });
      }
    },
    [addAddress, address, editAddress]
  );
  useEffect(() => {
    navigation.setOptions({
      title: address ? "Editar Dirección" : "Añadir Dirección",
      headerRight: () => (
        <NativeButton
          onPress={handleSubmit(onSubmit)}
          title={address ? "Editar" : "Añadir"}
        />
      ),
    });
  }, [address, handleSubmit, navigation, onSubmit]);
  const countryId = watch("countryId");
  return (
    <SelectProvider>
      <Box padding="m" flex={1}>
        <FormFields
          control={control}
          fields={[
            { name: "Nombre", key: "firstName", required: true },
            { name: "Apellidos", key: "lastName", required: true },
            { name: "Dirección", key: "address1", required: true },
            { name: "Dirección 2", key: "address2" },
            {
              name: "Dirección 2",
              key: "countryId",
              List: ListCountries,
              required: true,
            },
            {
              name: "País",
              key: "zoneId",
              List: ListZones,
              required: true,
              props: { countryId },
            },
            { name: "Ciudad", key: "city", required: true },
            { name: "Código Postal", key: "zipcode", required: true },
          ]}
        />
        <Box marginTop="m" flexDirection="row" justifyContent="space-between">
          <Box flex={1}>
            <Text>Establecer como dirección de entrega predeterminada</Text>
          </Box>
          <Box flex={1} alignItems="flex-end">
            <Switch value={isDefault} onChange={setIsDefault} />
          </Box>
        </Box>
        {address?.id && (
          <Box flex={1} justifyContent="flex-end">
            <Confirm
              title="¿Realmete deseas eliminar esta dirección?"
              onConfirm={() => {
                deleteAddress({
                  variables: {
                    id: address.id,
                  },
                });
              }}
            >
              <Button
                label="Eliminar"
                backgroundColor="transparent"
                color="danger"
              />
            </Confirm>
          </Box>
        )}
      </Box>
    </SelectProvider>
  );
};

export default AddDirection;
