import React, { Component } from 'react'
import { connect } from 'react-redux'

// import withStyles from 'isomorphic-style-loader/withStyles'
import { getHomeList } from '@/store/Home/actions'
import './index.css'

class Home extends Component {
  componentDidMount () {
    // 如果服务器端已经获取到这部分的数据了，就无需在浏览器端再次获取一遍了
    if (!this.props.list.title) {
      this.props.getHomeList()
    }
  }
  goDetail (id) {
    window.open(`https://movie.douban.com/subject/${id}/?from=showing`)
  }
  render () {
    return (
      <div className="home" title="前往详情">
        <h3 className="bigTitle">{this.props.list.title || ''}</h3>
        <div className="itemList">
          {
            this.props.list.subjects ? (
              this.props.list.subjects.map((item, index) => (
                <div className="itemBox" key={index} onClick={this.goDetail.bind(this, item.id)}>
                  <p className="pic" style={{
                    backgroundImage: `url(${item.images.small})`
                  }}></p>
                  <p className="name">{item.original_title}</p>
                  <p className="score">{item.rating.average}分</p>
                  <button className="payTicket">查看详情</button>
                </div>
              ))
            ) : null
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  list: state.homeReducer.newsList
})

const mapDispatchToProps = dispatch => ({
  getHomeList () {
    return dispatch(getHomeList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Home)
