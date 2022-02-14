import React, { useCallback } from "react";
import { TouchableOpacity, ScrollView } from "react-native";
import { useLogout } from "@yownes/api";
import { useAuth } from "@yownes/core";

import { Box, Button, Card, Text } from "../../components/atoms";
import type { ProfileProps } from "../../navigation/Profile";
import { FavouriteOutlined, Shipment } from "../../components/icons";
import Directions from "../../components/organisms/Directions";
import Payments from "../../components/organisms/Payments";

const Profile = ({ navigation }: ProfileProps) => {
  const { customer, logout: authLogout } = useAuth();
  const [logout] = useLogout();

  const handleLogout = useCallback(() => {
    logout().then(({ data }) => {
      if (data?.accountLogout?.status) {
        authLogout();
      }
    });
  }, [logout, authLogout]);

  return (
    <ScrollView>
      <Box padding="m">
        <Card padding="l" justifyContent="center" alignItems="center">
          <Text variant="header">{customer?.firstName}</Text>
          <Text paddingVertical="l">{customer?.email}</Text>
          <Box
            flexDirection="row"
            justifyContent="space-evenly"
            style={{ width: "100%" }}
          >
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Favourites");
              }}
            >
              <Box alignItems="center">
                <FavouriteOutlined color="dark" />
                <Text>Favoritos</Text>
              </Box>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                navigation.navigate("Orders");
              }}
            >
              <Box alignItems="center">
                <Shipment color="dark" />
                <Text>Pedidos</Text>
              </Box>
            </TouchableOpacity>
          </Box>
        </Card>
        <Card padding="l" marginVertical="m">
          <Directions
            onSelect={(address) => {
              navigation.navigate("AddDirection", { address });
            }}
          />
        </Card>
        <Card padding="l">
          <Payments
            onSelect={(paymentMethod) => {
              navigation.navigate("PaymentMethod", {
                pm: paymentMethod,
              });
            }}
          />
        </Card>
        <Button
          label="Desconectarse"
          marginVertical="l"
          onPress={handleLogout}
          backgroundColor="transparent"
          color="dark"
        />
      </Box>
    </ScrollView>
  );
};

export default Profile;
