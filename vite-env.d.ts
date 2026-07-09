/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly ORBITYPE_API_SQL_URL: string
  readonly ORBITYPE_API_SQL_KEY: string
  readonly ORBITYPE_FORM_WEBHOOK_URL: string
  readonly SENDGRID_API_KEY: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
