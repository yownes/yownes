import React, { useCallback, useState } from "react";
import { RefreshControl, ScrollView, Alert } from "react-native";
import { useAddDiscount, useGetCart, NetworkStatus } from "@yownes/api";
import { useAuth } from "@yownes/core";

import {
  Box,
  Button,
  Card,
  Input,
  Loading,
  Text,
} from "../../components/atoms";
import type { CartProps } from "../../navigation/Cart";

import Summary from "./Components/Summary";
import Row from "./Components/Row";
import CartPlaceholder from "./Components/CartPlaceholder";

const Cart = ({ navigation }: CartProps) => {
  const { loading, data, refetch, networkStatus } = useGetCart();
  const [code, setCode] = useState<string>();
  const [addDiscount, { data: dataDiscount, loading: dataLoading }] =
    useAddDiscount();
  const { isAuthenticated } = useAuth();
  const isEmpty = (data?.cart?.products?.length ?? 0) === 0;

  const toCheckout = useCallback(() => {
    if (isAuthenticated) {
      navigation.navigate("Checkout");
    } else {
      Alert.alert(
        "Iniciar sesión",
        "Para proceder con el pago es necesario que primero inicies sesión o te registres",
        [
          { text: "Cancelar", style: "cancel" },
          {
            text: "Iniciar sesión",
            style: "default",
            onPress: () => {
              navigation.navigate("Perfil", {
                screen: "Login",
              });
            },
          },
        ]
      );
    }
  }, [navigation, isAuthenticated]);

  if (loading && networkStatus !== NetworkStatus.refetch) {
    return <Loading />;
  }
  return isEmpty ? (
    <CartPlaceholder loading={loading} onRefresh={refetch} />
  ) : (
    <Box flex={1} justifyContent="space-between">
      <ScrollView
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={refetch} />
        }
      >
        <Box padding="m">
          {data?.cart?.products?.map((prod) => (
            <Box paddingBottom="m" key={prod?.key}>
              {prod && <Row product={prod} />}
            </Box>
          ))}
          <Summary cart={data?.cart ?? undefined} />
          <Card marginTop="m" padding="m">
            <Input
              placeholder="Código promocional"
              value={code}
              onChangeText={setCode}
            />
            {dataDiscount?.addDiscount?.errors?.map((err) => (
              <Text key={err} marginTop="m" variant="smallAlert">
                {err}
              </Text>
            ))}
            <Button
              label="Aplicar código promocional"
              backgroundColor="greyscale5"
              color={dataLoading ? "greyscale3" : "dark"}
              marginTop="m"
              isLoading={dataLoading}
              disabled={dataLoading}
              onPress={() => {
                if (code) {
                  addDiscount({ variables: { code } });
                }
              }}
            />
          </Card>
        </Box>
      </ScrollView>
      <Box
        backgroundColor="white"
        shadowColor="black"
        shadowOpacity={0.2}
        shadowOffset={{ width: 0, height: 5 }}
        shadowRadius={15}
        elevation={5}
      >
        <Button
          onPress={toCheckout}
          marginHorizontal="l"
          marginVertical="m"
          label={`Confirmar compra (${data?.cart?.total?.value})`}
        />
      </Box>
    </Box>
  );
};

export default Cart;
