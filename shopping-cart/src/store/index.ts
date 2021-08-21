import { InjectionKey } from 'vue'
import { createStore, createLogger, Store as VuexStore, useStore as baseUseStore } from 'vuex'
import {
  store as cartStore, TState as TCartState, TGetters as TCartGetters, moduleName as cartModuleName,
  TActions as TCartActions, TMutations as TCartMutations, TCartStore
} from '@/store/modules/cart'
import {
  store as productStore, TState as TProductState, TGetters as TProductsGetters, moduleName as productsModuleName,
  TActions as TProductsActions, TMutations as TProductsMutations, TProductsStore
} from '@/store/modules/products'
import { RootGettersReturnType } from '@/store/type'

const debug = process.env.NODE_ENV !== 'production'

export type TRootState = {
  [cartModuleName]: TCartState;
  [productsModuleName]: TProductState;
}
export type TRootActions = {
  [cartModuleName]: TCartActions;
  [productsModuleName]: TProductsActions;
}
export type TRootMutations = {
  [cartModuleName]: TCartMutations;
  [productsModuleName]: TProductsMutations;
}
export type TRootGetters = RootGettersReturnType<TCartGetters, typeof cartModuleName>
  & RootGettersReturnType<TProductsGetters, typeof productsModuleName>

export type TRootStore = TCartStore & TProductsStore

export default createStore({
  modules: {
    [cartModuleName]: cartStore,
    [productsModuleName]: productStore
  },
  strict: debug,
  plugins: debug ? [createLogger()] : []
})

const key: InjectionKey<VuexStore<TRootState>> = Symbol('store')

export function useStore (): TRootStore {
  return baseUseStore(key)
}
