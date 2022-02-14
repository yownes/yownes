import React from "react";
import { TouchableOpacity } from "react-native";
import type { AddressList_accountAddressList } from "@yownes/api";
import { useGetAddresses } from "@yownes/api";

import { Box, Button, Text } from "../atoms";
import { Address, Placeholder, Slider } from "../molecules";
import ShippingImage from "../images/Shipping";
import { useNavigation } from "../../navigation/Root";

interface DirectionsProps {
  title?: string;
  onSelect: (address: AddressList_accountAddressList) => void;
}

const Directions = ({ title, onSelect }: DirectionsProps) => {
  const { data } = useGetAddresses();
  const navigation = useNavigation();
  return (
    <Box>
      <Text variant="header3" marginBottom="l">
        {title || "Dirección de envío"}
      </Text>
      {data?.accountAddressList && data.accountAddressList.length > 0 ? (
        <Slider>
          {data.accountAddressList.map((address) => (
            <TouchableOpacity
              key={address?.id}
              onPress={() => {
                if (address) {
                  onSelect(address);
                }
              }}
            >
              {address && <Address address={address} />}
            </TouchableOpacity>
          ))}
        </Slider>
      ) : (
        <Placeholder
          View={<ShippingImage />}
          text="Aún no tienes ninguna dirección añadida, crea una para poder comprar"
        />
      )}
      <Button
        onPress={() =>
          navigation.navigate("App", {
            screen: "Perfil",
            params: {
              screen: "AddDirection",
              params: {},
            },
          })
        }
        marginTop="l"
        label="Añadir nueva"
      />
    </Box>
  );
};

export default Directions;
