import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "YOWNES_TOKEN";

export function saveToken(token: string) {
  return SecureStore.setItemAsync(TOKEN_KEY, token);
}

export function getToken() {
  return SecureStore.getItemAsync(TOKEN_KEY);
}

export function removeToken() {
  return SecureStore.deleteItemAsync(TOKEN_KEY);
}

export function extractTokenFromHeaders(headers: Map<string, string>) {
  const setCookie = headers.get("set-cookie");

  const regex = /PrestaShop-[a-zA-Z0-9]*=[^;]{2,}/gm;

  if (!setCookie) {
    return;
  }

  let result;
  //obtain last cookie
  let match = regex.exec(setCookie);
  do {
    result = match?.[0];
  } while ((match = regex.exec(setCookie)) !== null);

  if (result) {
    return result;
  }
}
