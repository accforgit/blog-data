import { genXByDegrees, genYByDegrees } from './math'
import { clientW } from './vars'

/**
 * 绘制圆环
 * @param x0 圆环圆心x坐标
 * @param y0 圆环圆心y坐标
 * @param r1 圆环外圆直径
 * @param r2 圆环内圆直径
 * @param strokeColor 圆环颜色
 */
export function drawRing(ctx: CanvasRenderingContext2D, x0: number, y0: number, r1: number, r2: number, strokeColor = '#f8f8c2') {
  ctx.save()
  ctx.beginPath()
  ctx.lineWidth = r1 - r2
  ctx.strokeStyle = strokeColor
  ctx.beginPath()
  ctx.arc(x0, y0, (r1 + r2) / 2, 0, Math.PI * 2)
  ctx.stroke()
  ctx.restore()
}

/**
 * 从 (x1, y1) 绘制一条到 (x2, y2) 颜色为 strokeColor 的线段
 */
export function drawLine(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, strokeColor: string) {
  ctx.save()
  ctx.beginPath()
  ctx.moveTo(x1, y1)
  ctx.lineTo(x2, y2)
  ctx.strokeStyle = strokeColor
  ctx.stroke()
  ctx.restore()
}

/**
 * 绘制图标
 * @param ctx canvas上下文
 * @param icon 图标 path
 * @param size icon尺寸
 * @param x0 所在圆的圆心x坐标
 * @param y0 所在圆的圆心y坐标
 * @param radius 所在圆的半径
 * @param degree 角度
 */
export const drawIcon = (ctx: CanvasRenderingContext2D, icon: string, size: number, x0: number, y0: number, radius: number, degree: number) => {
  const cX0 = genXByDegrees(degree, radius, x0)
  const cY0 = genYByDegrees(degree, radius, y0)
  const img = new Image()
  img.src = icon
  img.onload = () => {
    ctx.drawImage(img, cX0 - size / 2, cY0 - size / 2, size, size)
  }
}

export const canvasImprove = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D, size = clientW) => {
  canvas.style.width = size + "px"
  canvas.style.height = size + "px"
  canvas.height = size * window.devicePixelRatio
  canvas.width = size * window.devicePixelRatio
  ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
}

export const clearCanvas = (canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
