import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import withStyles from 'isomorphic-style-loader/withStyles'
import styles from './style.css'

class Personal extends React.Component {
  render () {
    return this.props.login
      ? <h3 className={styles.personal}>个人中心</h3>
      : <Redirect to="/" />
  }
}

const mapState = state => ({
  login: state.headerReducer.login
})

export default connect(mapState, null)(withStyles(styles)(Personal))
