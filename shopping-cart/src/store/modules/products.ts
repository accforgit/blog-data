import {
  ActionTree, MutationTree, Module, GetterTree
} from 'vuex'
import { TRootState, TRootGetters, TRootActions, TRootMutations } from '@/store/index'
import { GettersReturnType, TActionContext, TStore, TCommit, TDispatch } from '@/store/type'
import shop from '@/api/shop'

export const moduleName = 'products'
type TModuleName = typeof moduleName

export type TState = {
  all: Array<{ id: number, title: string, price: number, quantity: number, inventory: number }>
}

const state: () => TState = () => ({
  all: []
})

const GettersTypes = {
  myProducts: 'myProducts',
} as const
type VGettersTypes = (typeof GettersTypes)[keyof typeof GettersTypes]

export type TGetters = {
  readonly [key in VGettersTypes]: (
    state: TState, getters: GettersReturnType<TGetters, key>, rootState: TRootState, rootGetters: TRootGetters
  ) => key extends typeof GettersTypes.myProducts ? TState['all'] : number
}

// getters
const getters: GetterTree<TState, TRootState> & TGetters = {
  [GettersTypes.myProducts]: (state, getters, rootState, rootGetters) => {
    return state.all
  },
}

export const ActionTypes = {
  getAllProducts: 'getAllProducts',
} as const

type TUserActionContext = TActionContext<TState, TRootState, TActions, TRootActions, TMutations, TRootMutations, TGetters, TRootGetters>
export type TActions = {
  [ActionTypes.getAllProducts](context: TUserActionContext): Promise<void>
}
const actions: ActionTree<TState, TRootState> & TActions = {
  async getAllProducts ({ commit, dispatch, getters, rootState, rootGetters}) {
    const products = await shop.getProducts()
    commit(MutationTypes.setProducts, products)
  }
}

const MutationTypes = {
  setProducts: 'setProducts',
  decrementProductInventory: 'decrementProductInventory',
} as const
export type TMutations = {
  [MutationTypes.setProducts](state: TState, payload: TState['all']): void;
  [MutationTypes.decrementProductInventory]<T extends { id: number }>(state: TState, payload: T): void;
}
const mutations: MutationTree<TState> & TMutations = {
  setProducts (state, products) {
    state.all = products
  },
  decrementProductInventory (state, { id }) {
    const product = state.all.find(product => product.id === id)
    product && product.inventory--
  }
}

export type TProductsStore = TStore<
  { [moduleName]: TState }, TCommit<TMutations, TRootMutations, true>, 
  TDispatch<TActions, TRootActions, true>,
  { [key in keyof TGetters as `${TModuleName}/${key}`]: ReturnType<TGetters[key]> }
>

export const store: Module<TState, TRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
}
