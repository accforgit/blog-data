import React from 'react'
import FlyBall from './FlyBall'
import './style.css'

export default class Index extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      ballsTarget: { sx: 300, sy: 300 },
      // 抛物小球
      balls: []
    }
  }

  render() {
    let state = this.state
    return (
      <main>
        <FlyBall
          changeFlyBallCount={this.changeFlyBallCount.bind(this)}
          balls={state.balls}
          target={state.ballsTarget}
          curvature={0.004}
          speed={20}/>
        <div className='target'/>
      </main>
    )
  }

  componentDidMount() {
    this.clickToShowFlyBall()
  }

  clickToShowFlyBall() {
    document.querySelector('body').addEventListener('click', (e)=> {
      this.showFlyBall(e)
    })
  }

  showFlyBall(e) {
    let state = this.state
    // console.log('eee:', e.pageY, e.pageX, this.props.source);
    let balls = this.state.balls
    let len = balls.length

    let newball ={
      id: new Date().getTime(),
      position: {
        x: e.pageX,
        y: e.pageY
      }
    }
    balls.push(newball)
    this.setState({
      balls: Object.assign([], balls),
    })
  }

  changeFlyBallCount(id) {
    console.log(`ball: ${id} hidden`)
    let state = this.state
    let balls = state.balls
    for (let i=0; i<balls.length; i++) {
      if(balls[i].id === id) {
        balls.splice(i, 1)
        break
      }
    }
    this.setState({
      balls: Object.assign([], state.balls)
    })
    console.log(this.state.balls)
  }
}