import {
  ActionTree, MutationTree, Module, GetterTree
} from 'vuex'
import { TRootState, TRootGetters, TRootActions, TRootMutations } from '@/store/index'
import { GettersReturnType, TActionContext, TStore, TCommit, TDispatch } from '@/store/type'
import shop from '@/api/shop'

export const moduleName = 'cart'
type TModuleName = typeof moduleName

export type IProductItem = { id: number, title: string, inventory: number; quantity: number }
export type TState = {
  items: Array<{ id: number, quantity: number }>;
  checkoutStatus: null | 'successful' | 'failed'
}

const state: () => TState = () => ({
  items: [],
  checkoutStatus: null
})

const GettersTypes = {
  cartProducts: 'cartProducts',
  cartTotalPrice: 'cartTotalPrice'
} as const
type VGettersTypes = (typeof GettersTypes)[keyof typeof GettersTypes]

export type TGetters = {
  readonly [key in VGettersTypes]: (
    state: TState, getters: GettersReturnType<TGetters, key>, rootState: TRootState, rootGetters: TRootGetters
  ) => key extends typeof GettersTypes.cartProducts ? Array<{
    id: number;
    title: string;
    price: number;
    quantity: number;
  }> : number
}

const getters: GetterTree<TState, TRootState> & TGetters = {
  [GettersTypes.cartProducts]: (state, getters, rootState, rootGetters) => {
    return state.items.map(({ id, quantity }) => {
      const product = rootState.products.all.find(product => product.id === id)!
      return {
        id,
        title: product.title,
        price: product.price,
        quantity
      }
    })
  },
  [GettersTypes.cartTotalPrice]: (state, getters) => {
    return getters.cartProducts.reduce((total, product) => {
      return total + product.price * product.quantity
    }, 0)
  }
}

export const ActionTypes = {
  checkout: 'checkout',
  addProductToCart: 'addProductToCart',
} as const

type TUserActionContext = TActionContext<TState, TRootState, TActions, TRootActions, TMutations, TRootMutations, TGetters, TRootGetters>
export type TActions = {
  [ActionTypes.checkout]: (context: TUserActionContext, payload: TState["items"]) => Promise<void>
  [ActionTypes.addProductToCart]: (context: TUserActionContext, payload: IProductItem) => void
}
// actions
const actions: ActionTree<TState, TRootState> & TActions = {
  async checkout ({ commit, state, getters, dispatch, rootGetters, rootState }, products) {
    const savedCartItems = [...state.items]
    commit(MutationTypes.setCheckoutStatus, null)
    // empty cart
    commit(MutationTypes.setCartItems, { items: [] })
    try {
      await shop.buyProducts(products)
      commit(MutationTypes.setCheckoutStatus, 'successful')
    } catch (e) {
      console.error(e)
      commit(MutationTypes.setCheckoutStatus, 'failed')
      // rollback to the cart saved before sending the request
      commit(MutationTypes.setCartItems, { items: savedCartItems })
    }
  },
  addProductToCart ({ state, commit, dispatch }, product) {
    commit(MutationTypes.setCheckoutStatus, null)
    if (product.inventory > 0) {
      const cartItem = state.items.find(item => item.id === product.id)
      if (!cartItem) {
        commit(MutationTypes.pushProductToCart, { id: product.id })
      } else {
        commit(MutationTypes.incrementItemQuantity, cartItem)
      }
      commit('products/decrementProductInventory', { id: product.id }, { root: true })
    }
  }
}

const MutationTypes = {
  pushProductToCart: 'pushProductToCart',
  incrementItemQuantity: 'incrementItemQuantity',
  setCartItems: 'setCartItems',
  setCheckoutStatus: 'setCheckoutStatus'
} as const
export type TMutations = {
  [MutationTypes.pushProductToCart]<T extends { id: number }>(state: TState, payload: T): void;
  [MutationTypes.incrementItemQuantity]<T extends { id: number }>(state: TState, payload: T): void;
  [MutationTypes.setCartItems]<T extends { items: TState["items"] }>(state: TState, payload: T): void;
  [MutationTypes.setCheckoutStatus](state: TState, payload: TState["checkoutStatus"]): void;
}
// mutations
const mutations: MutationTree<TState> & TMutations = {
  [MutationTypes.pushProductToCart] (state, { id }) {
    state.items.push({ id, quantity: 1 })
  },
  [MutationTypes.incrementItemQuantity] (state, { id }) {
    const cartItem = state.items.find(item => item.id === id)
    cartItem && cartItem.quantity++
  },
  [MutationTypes.setCartItems] (state, { items }) {
    state.items = items
  },
  [MutationTypes.setCheckoutStatus] (state, status) {
    state.checkoutStatus = status
  }
}

export type TCartStore = TStore<
  { [moduleName]: TState }, TCommit<TMutations, TRootMutations, true>,
  TDispatch<TActions, TRootActions, true>,
  {
    [key in keyof TGetters as `${TModuleName}/${key}`]: ReturnType<TGetters[key]>
  }
>

export const store: Module<TState, TRootState> = {
  namespaced: true,
  state,
  getters,
  actions,
  mutations
} as const


