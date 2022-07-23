/// <reference types="vite/client" />

type SFCBlock = {
  type: string
  content: string
  attrs: Record<string, string>
  start?: number
  end?: number
  lang?: string
  src?: string
  scoped?: boolean
  module?: string | boolean
}
declare module 'vue-template-compiler/browser' {
  export function compile(template: string): { render: string; staticRenderFns: string[] }
  export function parseComponent(file: string): {
    template: SFCBlock | undefined
    script: SFCBlock | undefined
    styles: SFCBlock[]
    customBlocks: SFCBlock[]
  }
}

declare module 'vue-template-es2015-compiler/buble' {
  export function transform(str: string, options?: any): { code: string }
}

declare module '@babel/standalone' {
  export function transform(str: string, options?: any): { code: string }
}
