/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_HIGHLEVEL_API_KEY: string
  readonly VITE_HIGHLEVEL_LOCATION_ID: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}