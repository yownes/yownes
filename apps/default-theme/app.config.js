import "dotenv/config";

const config = {
  name: "expo-animated2",
  slug: "expo-animated2",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/icon.png",
  splash: {
    image: "./assets/splash.png",
    resizeMode: "contain",
    backgroundColor: "#ffffff",
  },
  updates: {
    fallbackToCacheTimeout: 0,
  },
  assetBundlePatterns: ["**/*"],
  ios: {
    supportsTablet: true,
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/favicon.png",
  },
  experiments: {
    // turboModules: true,
  },
  plugins: [
    [
      "@yownes/core",
      {
        merchantIdentifier: "merchant.com.yownes.test",
        enableGooglePay: true,
      },
    ],
  ],
  extra: {
    apiUrl: process.env.SERVER_URL,
    stripeKey: process.env.STRIPE_KEY,
  },
};

export default config;
