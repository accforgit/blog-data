import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'

import { login, logout } from '@/store/Header/actions'
import './style.css'

class Header extends React.Component {
  render () {
    const { login, handleLogin, handleLogout } = this.props
    return (
      <header className="header">
        <div>
          <Link className="commonText link" title="回到首页" to="/">首页</Link>
          <Link className="commonText link" title="前往个人中心" to="/personal">个人中心</Link>
          <Link className="commonText link" title="前往About" to="/about">关于</Link>
        </div>
        {
          login
            ? <button className="commonText" onClick={handleLogout} title="点击退出">退出</button>
            : <button className="commonText" onClick={handleLogin} title="点击登录">登录</button>
        }
      </header>
    )
  }
}

const mapState = state => ({
  login: state.headerReducer.login
})

const mapDispatch = dispatch => ({
  handleLogin () {
    dispatch(login())
  },
  handleLogout () {
    dispatch(logout())
  }
})

export default connect(mapState, mapDispatch)(Header)