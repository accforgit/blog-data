import React from 'react'
import { renderRoutes } from 'react-router-config'

import Header from './components/Header'
import styles from './style.css'

const App = props => {
  return (
    <div className={styles.main}>
      <Header {...props} />
      {renderRoutes(props.route.routes)}
    </div>
  )
}

export default App
