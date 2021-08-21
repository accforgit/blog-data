import {
  Store as VuexStore, CommitOptions, DispatchOptions, ActionContext
} from 'vuex'

export type GettersReturnType<T, K extends string> = {
  readonly [key in Exclude<keyof T, K>]: T[key] extends ((...args: any) => any) ? ReturnType<T[key]> : never
}

export type RootGettersReturnType<T extends Record<string, any>, TModuleName extends string> = {
  readonly [key in keyof T as `${TModuleName}/${Extract<key, string>}`]: T[key] extends ((...args: any) => any)
    ? ReturnType<T[key]>
    : never
}

type TObjFn = Record<string, (...args: any) => any>

type UnionToIntersection<U extends TObjFn> =
  (U extends TObjFn ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never

type FlatRootObj<T extends Record<string, TObjFn>> = T extends Record<infer U, TObjFn>
  ? U extends keyof T ? {
    [key in keyof T[U] as `${Extract<U, string>}/${Extract<key, string>}`]: T[U][key]
  } : never : never

export type TCommit<
  TMutations extends TObjFn, TRootMutations extends Record<string, TObjFn>, UseInGlobal extends boolean
> = {
  commit<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<TRootMutations>>
      : (UnionToIntersection<FlatRootObj<TRootMutations>> & TMutations),
    K extends keyof M = keyof M
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
    options?: CommitOptions
  ): void
}

export type TDispatch<
  TActions extends TObjFn, TRootActions extends Record<string, TObjFn>, UseInGlobal extends boolean,
> = {
  dispatch<
    M = UseInGlobal extends true
      ? UnionToIntersection<FlatRootObj<TRootActions>>
      : (UnionToIntersection<FlatRootObj<TRootActions>> & TActions),
    K extends keyof M = keyof M
  >(
    key: K,
    payload: Parameters<Extract<M[K], (...args: any) => any>>[1],
    options?: DispatchOptions
  ): Promise<ReturnType<Extract<M[K], (...args: any) => any>>>;
}

export type TActionContext<
  TState, TRootState,
  TActions extends TObjFn, TRootActions extends Record<string, TObjFn>,
  TMutations extends TObjFn, TRootMutations extends Record<string, TObjFn>,
  TGetters extends TObjFn, TRootGetters extends Record<string, any>
> = Omit<ActionContext<TState, TRootState>, 'commit' | 'dispatch' | 'getters' | 'rootGetters'>
  & TCommit<TMutations, TRootMutations, false>
  & TDispatch<TActions, TRootActions, false>
  & {
    getters: {
      [key in keyof TGetters]: ReturnType<TGetters[key]>
    }
  }
  & { rootGetters: TRootGetters }


export type TStore<
  TState extends Record<string, any>,
  TCommit extends { commit(type: string, payload?: any, options?: CommitOptions | undefined): void },
  TDispatch extends { dispatch(type: string, payload?: any, options?: DispatchOptions | undefined): Promise<any> },
  TGetters
> = Omit<VuexStore<TState>, 'commit' | 'dispatch' | 'getters'> & TCommit & TDispatch & {
  getters: TGetters
};


// type A = { q: () => 1; w: () => '2' }
// type B = { e: () => []; r: () => true; }
// type C = { a: A; b: B; }

// type D<T extends Record<string, TObjFn>, U extends TObjFn = FlatRootObj<T>, M extends TObjFn = UnionToIntersection<U>> = {
//   [key in keyof M]: 1
// }

// type E = D<C>