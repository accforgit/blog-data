import { createStore, applyMiddleware, combineReducers } from 'redux'
import thunk from 'redux-thunk'
import headerReducer from './Header/reducer'
import homeReducer from './Home/reducer'
import clientAxios from '../client/request'
import serverAxios from '../server/request'

const reducer = combineReducers({
  homeReducer,
  headerReducer
})

export const getStore = req => {
  return createStore(reducer, applyMiddleware(thunk.withExtraArgument(serverAxios(req))))
}

export const getClientStore = () => {
  // 从服务器端输出的页面上拿到脱水的数据
  const defaultState = window.context.state
  // 当做 store的初始数据（即注水）
  return createStore(reducer, defaultState, applyMiddleware(thunk.withExtraArgument(clientAxios)))
}