import { ComponentCustomProperties } from 'vue'
import { TRootStore } from '@/store/index'

/* eslint-disable */
declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}
declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $store: TRootStore
  }
}