import React, { Component } from 'react'
import { connect } from 'react-redux'

import withStyles from 'isomorphic-style-loader/withStyles'
import { getHomeList } from '@/store/Home/actions'
import styles from './index.css'

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
      <div className={styles.home} title="前往详情">
        <h3 className={styles.bigTitle}>{this.props.list.title || ''}</h3>
        <div className={styles.itemList}>
          {
            this.props.list.subjects ? (
              this.props.list.subjects.map((item, index) => (
                <div className={styles.itemBox} key={index} onClick={this.goDetail.bind(this, item.id)}>
                  <p className={styles.pic} style={{
                    backgroundImage: `url(${item.images.small})`
                  }}></p>
                  <p className={styles.name}>{item.original_title}</p>
                  <p className={styles.score}>{item.rating.average}分</p>
                  <button className={styles.payTicket}>查看详情</button>
                </div>
              ))
            ) : null
          }
        </div>
      </div>
    )
  }
}

// 给服务器端渲染使用
Home.loadData = store => store.dispatch(getHomeList())

const mapStateToProps = state => ({
  list: state.homeReducer.newsList
})

const mapDispatchToProps = dispatch => ({
  getHomeList () {
    return dispatch(getHomeList())
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(withStyles(styles)(Home))
