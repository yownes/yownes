import { extractTokenFromHeaders } from "./auth";

describe("Auth", () => {
  describe("extractTokenFromHeaders", () => {
    test("should get token from headers", () => {
      const storeId = "8bb4ceb228b77c00263b2694d8fa944f";
      const token = "def5020076ad3ed97f4b0465947e9670afbccc44d9968a29e2fc";
      const cookie = `PrestaShop-${storeId}=${token}`;
      const headers = new Map();
      headers.set("set-cookie", cookie);

      const result = extractTokenFromHeaders(headers);
      expect(result).toEqual(cookie);
    });
    test("should get last token from headers if there are more than one", () => {
      const storeId = "8bb4ceb228b77c00263b2694d8fa944f";
      const token = "def5020076ad3ed97f4b0465947e9670afbccc44d9968a29e2fc";
      const token2 = "70afbccc44d9968a29e2fc70afbccc44d9968a29e2fcdd23wa2";
      const cookie1 = `PrestaShop-${storeId}=${token}`;
      const cookie2 = `PrestaShop-${storeId}=${token2}`;
      const cookie = `${cookie1};${cookie2}`;
      const headers = new Map();
      headers.set("set-cookie", cookie);

      const result = extractTokenFromHeaders(headers);
      expect(result).toEqual(cookie2);
    });
    test("should return undefined if no token", () => {
      const headers = new Map();

      const result = extractTokenFromHeaders(headers);
      expect(result).toBeUndefined();
    });
  });
});
