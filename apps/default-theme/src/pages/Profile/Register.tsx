import React from "react";
import { useForm, Controller } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { useRegister } from "@yownes/api";

import { Box, Button, Text } from "../../components/atoms";
import { InputWithErrors } from "../../components/molecules";
import { RegisterProps } from "../../navigation/Profile";
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
  const { control, handleSubmit, errors } = useForm<RegisterState>({
    defaultValues: intialState,
  });
  const [register, { error }] = useRegister();
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
          <Box paddingBottom="l">
            <Controller
              control={control}
              name="firstName"
              render={({ onChange, onBlur, value }) => (
                <InputWithErrors
                  error={errors.firstName?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Nombre"
                />
              )}
              rules={{ required: "Este campo es obligatorio" }}
            />
          </Box>
          <Box paddingBottom="l">
            <Controller
              control={control}
              name="lastName"
              render={({ onChange, onBlur, value }) => (
                <InputWithErrors
                  error={errors.lastName?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Apellidos"
                />
              )}
              rules={{ required: "Este campo es obligatorio" }}
            />
          </Box>
          <Box paddingBottom="l">
            <Controller
              control={control}
              name="mail"
              render={({ onChange, onBlur, value }) => (
                <InputWithErrors
                  error={errors.mail?.message}
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  placeholder="Email"
                />
              )}
              rules={{ required: "Este campo es obligatorio" }}
            />
          </Box>
          <Box paddingBottom="l">
            <Controller
              control={control}
              name="password"
              render={({ onChange, onBlur, value }) => (
                <InputWithErrors
                  error={errors.password?.message}
                  secureTextEntry
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  placeholder="Contraseña"
                />
              )}
              rules={{
                required: "Este campo es obligatorio",
                minLength: {
                  value: 8,
                  message: "La contraseña debe tener al menos 8 caracteres",
                },
              }}
            />
          </Box>
          <Controller
            control={control}
            name="confirmPassword"
            render={({ onChange, onBlur, value }) => (
              <InputWithErrors
                error={errors.confirmPassword?.message}
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Confirmar contraseña"
              />
            )}
            rules={{ required: "Este campo es obligatorio" }}
          />
          <Button
            marginTop="l"
            label="Registrarme"
            onPress={handleSubmit(onSubmit)}
          />
          <Button
            marginTop="l"
            backgroundColor="background"
            color="dark"
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
