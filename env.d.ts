/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly MAIN_VITE_XATA_BRANCH: string
  readonly MAIN_VITE_XATA_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
