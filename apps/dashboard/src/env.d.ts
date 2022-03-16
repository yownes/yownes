/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PK_TEST: string;
  readonly VITE_STRIPE_PK: string;
  readonly VITE_ENDPOINT_URL: string;
  readonly VITE_LOCALES_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
