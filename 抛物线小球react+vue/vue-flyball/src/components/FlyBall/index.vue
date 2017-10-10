<template>
  <div class="box">
    <transition
      v-for="(ball, index) in balls"
      :key="ball.id"
      name="ballslist"
      @appear="appear"
      @after-appear="afterAppear">
      <div
        v-if="ball.show"
        class="ball"
        :data-id="ball.id"
        :style="{transform: `translate3d(${ball.x}px, ${ball.y}px, 0)`}"></div>
    </transition>
    <div class="targetEle"></div>
  </div>
</template>

<script>
export default {
  name: 'flyball',
  data () {
    return {
      balls: [],
      // 控制小球运动速度
      speed: 2,
      // 购物车坐标
      target: {x: 600, y: 600}
    }
  },
  mounted () {
    this.click2Show()
  },
  methods: {
    click2Show () {
      document.body.addEventListener('click', e => {
        this.add(e.pageX, e.pageY)
      })
    },
    add (x, y) {
      let balls = this.balls
      balls.push({id: new Date().getTime(), x, y, show: true})
    },
    move(el, x, y, a, done) {
      let style = el.style
      // 记录下起始点坐标
      let sx = x
      let sy = y

      let moveFn = (x, y) => {
        requestAnimationFrame(()=>{
          style.transform = `translate3d(${x}px, ${y}px, 0)`
          if(x < this.target.x) {
            y = a*Math.pow(x-sx, 2) + sy
            x += this.speed
            moveFn(x, y)
          } else {
            console.log('done')
            done()
          }
        })
      }
      moveFn(x, y)
    },
    appear (el, done) {
      console.log('enter')
      let balls = this.balls
      let target = this.target
      let id = el.dataset.id
      let x, y
      for (let i=0; i< balls.length; i++) {
        if (balls[i].id == id) {
          x = balls[i].x
          y = balls[i].y
          break
        }
      }
      // let {x, y} = balls[id]
      // 假设抛物线顶点在原点，则抛物线方式为 y = a*Math.pow(x-h, 2) + k，
      // 其中(h,k)即为抛物线顶点坐标
      let a = (target.y - y) / Math.pow(target.x - x, 2)
      this.move(el, x, y, a, done)
      // done()
    },
    afterAppear (el) {
      let balls = this.balls
      let id = el.dataset.id
      console.log('afterEnter', id)
      // 隐藏小球
      for (let i=0; i< balls.length; i++) {
        if (balls[i].id == id) {
          balls[i].show = false
          break
        }
      }
    }
  }
}
</script>

<style scoped>
.ball {
  position: absolute;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background-color: skyblue;
}
.targetEle {
  width: 40px;
  height: 40px;
  background-color: yellowgreen;
  transform: translate(580px, 600px)
}
</style>
