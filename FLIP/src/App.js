import React, { Component } from 'react'
import './App.css'

// 卡片 Card增删动画
import Card from './components/Card'
// 图片放大/恢复动画
import Preview from './components/Preview'

class App extends Component {
  state = {
    showIndex: 0
  }
  componentDidMount () {
    const mt = window.location.search.match(/showIndex=(\d)/)
    if (mt) {
      this.setState({
        showIndex: +mt[1]
      })
    }
  }
  changeCor (showIndex) {
    this.setState({
      showIndex
    })
  }
  render() {
    return (
      <div className="App">
        <div className="route">
          <span onClick={this.changeCor.bind(this, 0)}>点击切换到 卡片增删动效</span>
          <span onClick={this.changeCor.bind(this, 1)}>点击切换到 图片放大预览/活肤动效</span>
        </div>
        <hr/>
        {
          this.state.showIndex === 0
            ? <Card />
            : <Preview />
        }
      </div>
    )
  }
}

export default App
