import App from './App'
import NotFound from './containers/NotFound'
import Home from './containers/Home'
import Personal from './containers/Personal'

export default [{
  path: '/',
  component: App,
  loadData: App.loadData,
  // 多级路由
  routes: [{
    path: '/',
    component: Home,
    exact: true,
    loadData: Home.loadData,
    key: 'home'
  }, {
    path: '/personal',
    component: Personal,
    exact: true,
    key: 'personal',
    needAuth: true
  }, {
    component: NotFound
  }]
}]
