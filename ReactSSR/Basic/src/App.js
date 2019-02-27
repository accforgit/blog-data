import React from 'react'
import { renderRoutes } from 'react-router-config'

import Header from './components/Header'
import { getHeaderInfo } from '@/store/Header/actions'
import withStyles from 'isomorphic-style-loader/withStyles'
import styles from './style.css'

const App = props => {
  return (
    <div className={styles.main}>
      <Header {...props} />
      {renderRoutes(props.route.routes)}
    </div>
  )
}

// 给服务器端渲染使用
App.loadData = store => store.dispatch(getHeaderInfo())

export default withStyles(styles)(App)
