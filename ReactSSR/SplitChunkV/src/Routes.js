import App from './App'

import loadable from '@loadable/component'

import NotFound from './containers/NotFound'
import Loading from './containers/Loading'

import { getHomeList } from '@/store/Home/actions'
import { getHeaderInfo } from '@/store/Header/actions'

const Home = loadable(
  () => import('./containers/Home'),
  {
    fallback: Loading,
  }
);
const Personal = loadable(
  () => import('./containers/Personal'),
  {
    fallback: Loading,
  }
);
const About = loadable(
 () =>  import('./containers/About'),
  {
    fallback: Loading,
  }
);

export default [{
  path: '/',
  component: App,
  loadData: store => store.dispatch(getHeaderInfo()),
  // 多级路由
  routes: [{
    path: '/',
    component: Home,
    exact: true,
    loadData: store => store.dispatch(getHomeList()),
    key: 'home'
  }, {
    path: '/personal',
    component: Personal,
    exact: true,
    key: 'personal'
  }, {
    path: '/about',
    component: About,
    exact: true,
    key: 'about'
  }, {
    component: NotFound
  }]
}]
