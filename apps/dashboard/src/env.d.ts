/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_ENDPOINT_URL: string;
  readonly VITE_LOCALES_PATH: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
