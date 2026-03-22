/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** Установите `1` для демонстрации ошибки загрузки кабинета (ветка UI с retry). */
  readonly VITE_API_FAIL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
