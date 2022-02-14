import React from "react";
import { TouchableOpacity } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { ScrollView } from "react-native-gesture-handler";
import { useLogin } from "@yownes/api";
import { useAuth } from "@yownes/core";

import { Box, Button, Text } from "../../components/atoms";
import { InputWithErrors } from "../../components/molecules";
import LoginImage from "../../components/images/Login";
import type { LoginProps } from "../../navigation/Profile";

interface LoginState {
  mail: string;
  password: string;
}

const intialState: LoginState = {
  mail: "",
  password: "",
};

const Login = ({ navigation }: LoginProps) => {
  const { control, handleSubmit, errors } = useForm<LoginState>({
    defaultValues: intialState,
  });
  const Auth = useAuth();
  const [login, { error, loading }] = useLogin();
  function onSubmit(loginState: LoginState) {
    login({
      variables: {
        email: loginState.mail,
        password: loginState.password,
      },
    })
      .then(({ data }) => {
        if (data?.accountLogin?.customer) {
          Auth.login(data.accountLogin.customer);
          navigation.replace("Profile");
        }
      })
      .catch(() => null);
  }
  return (
    <ScrollView>
      <Box padding="xl" paddingTop="s">
        <Box>
          <LoginImage />
          <Text variant="header3" textAlign="center" paddingBottom="xl">
            Inicio sesión
          </Text>
          {error && <Text color="danger">{error.message}</Text>}
          <Box paddingBottom="l">
            <Controller
              control={control}
              name="mail"
              render={({ onChange, onBlur, value }) => (
                <InputWithErrors
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                  keyboardType="email-address"
                  placeholder="Email"
                  error={errors.mail?.message}
                />
              )}
              rules={{ required: "Este campo es obligatorio" }}
            />
          </Box>
          <Controller
            control={control}
            name="password"
            render={({ onChange, onBlur, value }) => (
              <InputWithErrors
                secureTextEntry
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                placeholder="Contraseña"
                error={errors.password?.message}
              />
            )}
            rules={{ required: "Este campo es obligatorio" }}
          />
          <TouchableOpacity
            style={{ paddingVertical: 10 }}
            onPress={() => {
              // TODO: ForgotPassword screen
              return;
            }}
          >
            <Text variant="small" textAlign="right">
              ¿Has olvidado la contraseña?
            </Text>
          </TouchableOpacity>
          <Button
            marginTop="l"
            label="Iniciar sesión"
            onPress={handleSubmit(onSubmit)}
            disabled={loading}
          />
          <Button
            marginTop="l"
            backgroundColor="background"
            color="dark"
            disabled={loading}
            label="Registrarme"
            onPress={() => {
              navigation.navigate("Register");
            }}
          />
        </Box>
      </Box>
    </ScrollView>
  );
};

export default Login;
