import React from 'react'
import { connect } from 'react-redux'
import { Redirect } from 'react-router-dom'

import './style.css'

class Personal extends React.Component {
  render () {
    return this.props.login
      ? <p className="personal">个人中心</p>
      : <Redirect to="/" />
  }
}

const mapState = state => ({
  login: state.headerReducer.login
})

export default connect(mapState, null)(Personal)
