declare module '*.svg' {
  import * as React from 'react'
  export const ReactComponent: React.FunctionComponent<React.SVGProps<SVGSVGElement>>
  const src: string
  export default src
}

/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string
  readonly VITE_SUPABASE_ANON_KEY: string
  readonly VITE_THIRDWEB_CLIENT_ID: string
  readonly VITE_APP_TITLE: string
  readonly VITE_APP_DESCRIPTION: string
  readonly VITE_AI_PROVIDER: string
  readonly VITE_DEFAULT_AI_MODEL: string
  // 其他环境变量...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}