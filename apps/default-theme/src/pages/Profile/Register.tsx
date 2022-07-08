import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { useRegister } from "@yownes/api";
import { useAuth } from "@yownes/core";

import { Box, Button, Text } from "../../components/atoms";
import { FormFields, InputWithErrors } from "../../components/molecules";
import type { RegisterProps } from "../../navigation/Profile";
import RegisterImage from "../../components/images/Register";

interface RegisterState {
  mail: string;
  firstName: string;
  lastName: string;
  password: string;
  confirmPassword: string;
}

const intialState: RegisterState = {
  mail: "",
  password: "",
  firstName: "",
  lastName: "",
  confirmPassword: "",
};

const Register = ({ navigation }: RegisterProps) => {
  const Auth = useAuth();
  const { control, handleSubmit } = useForm<RegisterState>({
    defaultValues: intialState,
  });
  const [register, { error, loading }] = useRegister();
  function onSubmit(state: RegisterState) {
    register({
      variables: {
        customer: {
          email: state.mail,
          firstName: state.firstName,
          lastName: state.lastName,
          password: state.password,
        },
      },
    }).then(({ data }) => {
      if (data?.accountRegister?.id) {
        Auth.login(data.accountRegister);
        navigation.navigate("Profile");
      }
    });
  }
  return (
    <ScrollView>
      <Box padding="xl" paddingTop="s">
        <Box>
          <RegisterImage />
          <Text variant="header3" paddingBottom="xl">
            Registro
          </Text>
          {error && <Text color="danger">{error.message}</Text>}
          <FormFields
            control={control}
            fields={[
              {
                key: "firstName",
                required: true,
                name: "Nombre",
              },
              {
                key: "lastName",
                required: true,
                name: "Apellidos",
              },
              {
                key: "mail",
                required: true,
                name: "Email",
                keyboardType: "email-address",
              },
              {
                key: "password",
                required: true,
                name: "Contraseña",
                keyboardType: "password",
              },
              {
                key: "confirmPassword",
                required: true,
                name: "Apellidos",
                keyboardType: "password",
              },
            ]}
          />
          <Button
            disabled={loading}
            isLoading={loading}
            marginTop="l"
            label="Registrarme"
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            marginTop="l"
            backgroundColor="background"
            color="dark"
            disabled={loading}
            label="Iniciar Sesión"
            onPress={() => {
              navigation.navigate("Login");
            }}
          />
        </Box>
      </Box>
    </ScrollView>
  );
};

export default Register;
