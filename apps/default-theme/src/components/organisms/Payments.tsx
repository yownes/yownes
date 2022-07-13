import React from "react";
import { TouchableOpacity } from "react-native";
import { SharedElement } from "react-navigation-shared-element";
import type { PaymentMethodFragment } from "@yownes/api";
import { useGetPaymentMethods } from "@yownes/api";

import { Box, Button, Text } from "../atoms";
import { CreditCard, Placeholder, Slider } from "../molecules";
import BillingImage from "../images/Billing";
import { useNavigation } from "../../navigation/Root";

interface PaymentsProps {
  onSelect: (paymentMethod: PaymentMethodFragment) => void;
}

const Payments = ({ onSelect }: PaymentsProps) => {
  const { data } = useGetPaymentMethods();
  const navigation = useNavigation();
  return (
    <Box>
      <Text variant="header3" marginBottom="l">
        Método de pago
      </Text>
      {data?.accountPaymentMethodList &&
      data.accountPaymentMethodList.length > 0 ? (
        <Slider>
          {data?.accountPaymentMethodList.map((method) => (
            <TouchableOpacity
              key={method?.id}
              onPress={() => {
                if (method) {
                  onSelect(method);
                }
              }}
            >
              {method && (
                <SharedElement id={`card.${method.id}`}>
                  <CreditCard data={method} />
                </SharedElement>
              )}
            </TouchableOpacity>
          ))}
        </Slider>
      ) : (
        <Placeholder
          View={<BillingImage />}
          text="Aún no tienes ningún método de pago añadido, crea uno para poder comprar"
        />
      )}
      <Button
        onPress={() =>
          navigation.navigate("App", {
            screen: "Perfil",
            params: {
              screen: "AddPaymentMethod",
            },
          })
        }
        marginTop="l"
        label="Añadir"
      />
    </Box>
  );
};

export default Payments;
