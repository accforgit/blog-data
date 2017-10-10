// 源自 http://www.zhangxinxu.com/wordpress/2013/12/javascript-js-%E5%85%83%E7%B4%A0-%E6%8A%9B%E7%89%A9%E7%BA%BF-%E8%BF%90%E5%8A%A8-%E5%8A%A8%E7%94%BB/

// 控制元素进行抛物线运动
export default class Parabola {
  constructor(element, target, options) {
    this.element = element
    this.target = target
    this.options = options || {}
    this.flagMove = true
    this.params = {}
    this.coordTarget = null
    this.stopRun = false
    this.moveStyle = "margin"

    this.defaults = {
      // 每帧移动的像素大小，每帧（对于大部分显示屏）大约16~17毫秒
      speed: 166.67,
      // 实际指焦点到准线的距离，可以抽象成曲率,绝对值越大，则抛物弧度越小
      //如果大于0，则抛物线开口向下，否则向上
      curvature: 0.001,
      // 抛物线的进度, function
      progress: null,
      // 完成抛物后的回调, function
      complete: null
    }

    // 初始化暴露出去的方法
    this.expose = {
      mark() {
        return this
      },
      position() {
        return this
      },
      move() {
        return this
      },
      init() {
        return this
      }
    }

    this.init()
  }

  init() {
    this.getParams()
    this.moveAttr()
    this.curvilinear()
  }

  run() {
    // 启动抛物线运动
    this.expose.init()
  }

  stop(stopCompleteFn=true) {
    this.stopRun = true
    // 清除结束运动后的回调函数
    stopCompleteFn && (this.params.complete = null)
  }

  getParams() {
    let options = this.options
    let defaults = this.defaults
    let params = this.params
    for (let key in defaults) {
      params[key] = options[key] || defaults[key]
    }
  }

  moveAttr() {
    /* 确定移动的方式 
    * IE6-IE8 是margin位移
    * IE9+使用transform，另外还有可能存在前缀
    */
    let that = this
    let testDiv = document.createElement("div")
    if ("oninput" in testDiv) {
      ["", "ms", "webkit"].forEach(function (prefix) {
        let transform = prefix + (prefix ? "T" : "t") + "ransform"
        if (transform in testDiv.style) {
          that.moveStyle = transform
        }
      })
    }
  }

  curvilinear() {
    let that = this
    let params = this.params
    let coordTarget = this.coordTarget
    let moveStyle = this.moveStyle
    let element = that.element
    let target = that.target
    let targetIsEle = typeof(target.sx) === 'undefined' ? true : false
    let a = params.curvature,
        b = 0,
        c = 0

    // 是否执行运动的标志量
    this.flagMove = true
    if (element && target && element.nodeType === 1) {
      let rectElement = {},
          rectTarget = {}

      // 移动元素的中心点位置，目标元素的中心点位置
      let centerElement = {},
          centerTarget = {}

      // 目标元素的坐标位置
      let coordElement = {}

      // 标注当前元素的坐标
      let expose = this.expose
      expose.mark = ()=> {
        if (that.flagMove === false) return that
        if (typeof coordElement.x === "undefined") expose.position()
        return that
      }

      expose.position = ()=> {
        if (that.flagMove === false) return that

        let scrollLeft = document.documentElement.scrollLeft || document.body.scrollLeft,
          scrollTop = document.documentElement.scrollTop || document.body.scrollTop

        // 初始位置
        if (moveStyle === "margin") {
          element.style.marginLeft = element.style.marginTop = "0px"
        } else {
          element.style[moveStyle] = "translate(0, 0)"
        }

        // 四边缘的坐标
        rectElement = element.getBoundingClientRect()
        rectTarget = targetIsEle ? target.getBoundingClientRect() : target

        // 移动元素的中心点坐标
        centerElement = {
          x: rectElement.left + (rectElement.right - rectElement.left) / 2 + scrollLeft,
          y: rectElement.top + (rectElement.bottom - rectElement.top) / 2 + scrollTop
        }

        // 目标元素的中心点位置
        centerTarget = targetIsEle ? {
          x: rectTarget.left + (rectTarget.right - rectTarget.left) / 2 + scrollLeft,
          y: rectTarget.top + (rectTarget.bottom - rectTarget.top) / 2 + scrollTop
        } : {
          x: target.sx + scrollLeft,
          y: target.sy + scrollTop
        }

        // 转换成相对坐标位置
        coordElement = {
          x: 0,
          y: 0
        };
        coordTarget = {
          x: -1 * (centerElement.x - centerTarget.x),
          y: -1 * (centerElement.y - centerTarget.y)
        }
        /*
        * 因为经过(0, 0), 因此c = 0
        * 于是：
        * y = a * x*x + b*x;
        * y1 = a * x1*x1 + b*x1;
        * y2 = a * x2*x2 + b*x2;
        * 利用第二个坐标：
        * b = (y2+ a*x2*x2) / x2
        */
        // 于是
        b = (coordTarget.y - a * coordTarget.x * coordTarget.x) / coordTarget.x

        return that
      }

      // 按照这个曲线运动
      expose.move = ()=> {
        // 如果曲线运动还没有结束，不再执行新的运动
        if (that.flagMove === false) return that

        let startx = 0,
          rate = coordTarget.x > 0 ? 1 : -1

        let step = ()=> {
          // 切线 y'=2ax+b
          let tangent = 2 * a * startx + b
          // y*y + x*x = speed
          // (tangent * x)^2 + x*x = speed
          // x = Math.sqr(speed / (tangent * tangent + 1))
          startx = startx + rate * Math.sqrt(params.speed / (tangent * tangent + 1))

          // 防止过界
          if ((rate == 1 && startx > coordTarget.x) || (rate == -1 && startx < coordTarget.x)) {
            startx = coordTarget.x
          }
          let x = startx,
            y = a * x * x + b * x

          // x, y目前是坐标，需要转换成定位的像素值
          if (moveStyle === "margin") {
            element.style.marginLeft = x + "px"
            element.style.marginTop = y + "px"
          } else {
            element.style[moveStyle] = "translate(" + [x + "px", y + "px"].join() + ")"
          }

          if (startx !== coordTarget.x && !this.stopRun) {
            // 当前进度
            params.progress && params.progress(x, y)
            // 继续进行沿抛物线运动
            // console.log('movemove:', Math.random())
            window.requestAnimationFrame(step)
          } else {
            // 运动结束，回调执行
            params.complete && params.complete()
            that.flagMove = true
          }
        }
        window.requestAnimationFrame(step)
        that.flagMove = false

        return that
      }

      // 初始化方法
      expose.init = ()=> {
        expose.mark().expose.move()
      }
    }
  }
}

/**
 * 用法示例
假设 .box1是进行抛物线运动的元素， .box2 是抛物线终点元素

let element = document.querySelector(".box1"),
target = document.querySelector(".box2")

// 抛物线元素的的位置标记
let parabola = new Parabola(element, target)

// 抛物线运动的触发
document.body.onclick = ()=> {
  parabola.run()
}
 */

