/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_PLATFORM?: string;
  // ajoutez d'autres variables ici si besoin
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
