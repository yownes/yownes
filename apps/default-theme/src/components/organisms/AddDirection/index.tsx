import React, { useCallback, useEffect, useState } from "react";
import { ScrollView } from "react-native";
import Toast from "react-native-root-toast";
import { useForm } from "react-hook-form";
import type {
  AddAddress_accountAddAddress,
  AccountAddressInput,
} from "@yownes/api";
import { useAddAddress, useDeleteAddress, useEditAddress } from "@yownes/api";

import { useNavigation } from "../../../navigation/Root";
import { Box, Button, Card, Switch, Text } from "../../atoms";
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
  const [addAddress, { loading: addLoading }] = useAddAddress({ onSuccess });
  const [editAddress, { loading: editLoading }] = useEditAddress({ onSuccess });
  const [deleteAddress, { loading: deleteLoading }] = useDeleteAddress({
    onSuccess,
  });
  const { control, handleSubmit, watch } = useForm<AccountAddressInput>({
    defaultValues: address || initialState,
  });
  const onSubmit = useCallback(
    (data: AccountAddressInput) => {
      if (address) {
        editAddress({
          variables: {
            id: address.id,
            address: {
              address1: data.address1,
              address2: data.address2,
              city: data.city,
              countryId: data.countryId,
              firstName: data.firstName,
              lastName: data.lastName,
              zipcode: data.zipcode,
              zoneId: data.zoneId,
            },
          },
        }).then(({ errors }) => {
          if (!errors) {
            Toast.show("¡Dirección actualizada!", {
              backgroundColor: "#fff",
              duration: Toast.durations.SHORT,
              opacity: 1,
              position: -80,
              textColor: "#000",
            });
          }
        });
      } else {
        addAddress({
          variables: {
            address: data,
          },
        }).then(({ errors }) => {
          if (!errors) {
            Toast.show("¡Dirección añadida!", {
              backgroundColor: "#fff",
              duration: Toast.durations.SHORT,
              opacity: 1,
              position: -80,
              textColor: "#000",
            });
          }
        });
      }
    },
    [addAddress, address, editAddress]
  );
  useEffect(() => {
    navigation.setOptions({
      title: address ? "Editar dirección" : "Añadir dirección",
    });
  }, [address, navigation]);
  const countryId = watch("countryId");
  return (
    <SelectProvider>
      <ScrollView>
        <Box padding="m" flex={1}>
          <Card paddingHorizontal="l" paddingVertical="m">
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
              separator={<Box paddingTop="m" />}
            />
            <Box margin="m" flexDirection="row" justifyContent="space-between">
              <Box flex={2}>
                <Text>Establecer como dirección de entrega predeterminada</Text>
              </Box>
              <Box flex={1} alignItems="flex-end">
                <Switch value={isDefault} onChange={setIsDefault} />
              </Box>
            </Box>
            <Button
              label={address ? "Guardar dirección" : "Crear dirección"}
              color={addLoading || editLoading ? "greyscale3" : "white"}
              marginVertical="m"
              isLoading={addLoading || editLoading}
              disabled={addLoading || editLoading}
              onPress={handleSubmit(onSubmit)}
            />
            {address?.id && (
              <Box flex={1} justifyContent="flex-end">
                <Confirm
                  title="¿Realmente deseas eliminar esta dirección?"
                  onConfirm={() => {
                    deleteAddress({
                      variables: {
                        id: address.id,
                      },
                    }).then(({ errors }) => {
                      if (!errors) {
                        Toast.show("¡Dirección eliminada!", {
                          backgroundColor: "#fff",
                          duration: Toast.durations.SHORT,
                          opacity: 1,
                          position: -80,
                          textColor: "#000",
                        });
                      }
                    });
                  }}
                >
                  <Button
                    label="Eliminar"
                    backgroundColor="transparent"
                    color="danger"
                    isLoading={deleteLoading}
                    disabled={deleteLoading}
                  />
                </Confirm>
              </Box>
            )}
          </Card>
        </Box>
      </ScrollView>
    </SelectProvider>
  );
};

export default AddDirection;
