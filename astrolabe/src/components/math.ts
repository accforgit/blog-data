/**
 * 角度换算成弧度
 * @param degrees 角度
 */
 const toRadians = (degrees: number) => degrees * Math.PI / 180

 // 弧度换算成角度
 const toDegrees = (radians: number) => radians / (Math.PI / 180)
 /**
  * degrees数学计算上以圆右端点为起始点顺时针旋转，此处会转换成以左端点为起始点逆时针旋转
  * @param degrees 星盘上的角度
  */
 const resetDegees = (degrees: number) => degrees <= 180 ? (180 - degrees) : (540 - degrees)
 /**
  * 求圆上任意点的 x 坐标
  * @param degrees 星盘上的角度
  * @param radius 半径
  * @param x0 圆心x坐标
  */
 export const genXByDegrees = (degrees: number, radius: number, x0: number) => {
   return x0 + radius * Math.cos(toRadians(resetDegees(degrees)))
 }
 
 /**
  * 求圆上任意点的 y 坐标
  * @param degrees 星盘上的角度
  * @param radius 半径
  * @param y0 圆心y坐标
  */
 export const genYByDegrees = (degrees: number, radius: number, y0: number) => {
   return y0 + radius * Math.sin(toRadians(resetDegees(degrees)))
 }
 
 // 平面上长方形碰撞检测
 export const isRectCollision = (x1: number, y1: number, w1: number, h1: number, x2: number, y2: number, w2: number, h2: number) => {
   return x1 < x2 + w2 && x1 + w1 > x2 && y1 < y2 + h2 && y1 + h1 > y2
 }
 
 /**
  * 第二个矩形应该移动多少距离以避免碰撞（以第一个矩形为基准，在其两端寻找合适的位置）
  * @param rect1 第一个矩形的中心点坐标和长宽信息
  * @param rect2 第二个矩形的中心点坐标和长宽信息
  * @param degrees 第二个矩形中心点坐标的圆心角
  */
 const transAVoidCollision = (
   rect1: { x: number, y: number, width: number, height?: number },
   rect2: { x: number, y: number, width: number, height?: number },
   degrees: number
 ) => {
   if (!rect1.height) rect1.height = rect1.width
   if (!rect2.height) rect2.height = rect2.width
   const xHalf = rect1.width / 2 + rect2.width / 2
   const yHalf = rect1.height / 2 + rect2.height / 2
   let diffX = Math.abs(rect2.x - rect1.x) - xHalf
   let diffY = Math.abs(rect2.y - rect1.y) - yHalf
   if (diffX >= 0 || diffY >= 0) {
     return [
       { x: 0, y: 0, z: 0 },
       { x: 0, y: 0, z: 0 }
     ]
   }
   
   // 标识第二个矩形的坐标应该是增大还是减小
   const xFlag = rect2.x - rect1.x >= 0
   const yFlag = rect2.y - rect1.y >= 0
   diffX = Math.abs(diffX)
   diffY = Math.abs(diffY)
   const obliqueX = rect1.width + rect2.width - diffX
   const obliqueY = rect1.height + rect2.height - diffY
   degrees = resetDegees(degrees)
   let [tx, ty, tz, tx1, ty1, tz1, tx2, ty2, tz2, tx3, ty3, tz3] = [
     Infinity, Infinity, Infinity, Infinity, Infinity, -Infinity, Infinity, Infinity, Infinity, Infinity, Infinity, -Infinity
   ]
   // 只能在x轴上移动
   if ([0, 360].includes(degrees)) {
     tx2 = diffX
     ty2 = 0
     tz2 = -diffX
     tx3 = -obliqueX
     ty3 = 0
     tz3 = obliqueX
   } else if (degrees === 180) {
     tx2 = diffX
     ty2 = 0
     tz2 = diffX
     tx3 = -obliqueX
     ty3 = 0
     tz3 = -obliqueX
   } else if (degrees === 90) {
     // 只能在y移动
     tx = 0
     ty = diffY
     tz = diffY
     tx1 = 0
     ty1 = -obliqueY
     tz1 = -obliqueY
   } else if (degrees === 270) {
     tx = 0
     ty = diffY
     tz = -diffY
     tx1 = 0
     ty1 = -obliqueY
     tz1 = obliqueY
   }
   
   if (degrees > 0 && degrees < 90) {
     // y轴移动
     // tan = y/x
     // sin = y/z
     tx = diffY / Math.tan(toRadians(degrees))
     ty = diffY
     tz = ty / Math.sin(toRadians(degrees))
 
     tx1 = -obliqueY / Math.tan(toRadians(degrees))
     ty1 = -obliqueY
     tz1 = ty1 / Math.sin(toRadians(degrees))
     // x 轴移动
     tx2 = diffX
     ty2 = tx2 * Math.tan(toRadians(degrees))
     tz2 = ty2 / Math.sin(toRadians(degrees))
 
     tx3 = -obliqueX
     ty3 = tx3 * Math.tan(toRadians(degrees))
     tz3 = ty3 / Math.sin(toRadians(degrees))
     console.log(`哈哈 tx2:${tx2} ty2:${ty2} tz2:${tz2} tx3:${tx3} ty3:${ty3} tz3:${tz3}`)
   } else if (degrees > 90 && degrees < 180) {
     // y轴移动
     // tan = y/x
     // sin = y/z
     tx = -diffY / Math.tan(toRadians(180 - degrees))
     ty = diffY
     tz = ty / Math.sin(toRadians(180 - degrees))
 
     tx1 = obliqueY / Math.tan(toRadians(180 - degrees))
     ty1 = -obliqueY
     tz1 = ty1 / Math.sin(toRadians(180 - degrees))
     // x 轴移动
     tx2 = diffX
     ty2 = -tx2 * Math.tan(toRadians(180 - degrees))
     tz2 = ty2 / Math.sin(toRadians(180 - degrees))
 
     tx3 = -obliqueX
     ty3 = -tx3 * Math.tan(toRadians(180 - degrees))
     tz3 = ty3 / Math.sin(toRadians(180 - degrees))
   } else if (degrees > 180 && degrees < 270) {
     // y轴移动
     // tan = x/y
     // sin = x/z
     tx = diffY * Math.tan(toRadians(270 - degrees))
     ty = diffY
     tz = -tx / Math.sin(toRadians(270 - degrees))
 
     tx1 = -obliqueY * Math.tan(toRadians(270 - degrees))
     ty1 = -obliqueY
     tz1 = -tx1 / Math.sin(toRadians(270 - degrees))
     // x 轴移动
     tx2 = diffX
     ty2 = tx2 / Math.tan(toRadians(270 - degrees))
     tz2 = -tx2 / Math.sin(toRadians(270 - degrees))
 
     tx3 = -obliqueX
     ty3 = tx3 / Math.tan(toRadians(270 - degrees))
     tz3 = -tx3 / Math.sin(toRadians(270 - degrees))
   } else {
     // y轴移动
     // tan = y/x
     // sin = y/z
     tx = -diffY / Math.tan(toRadians(360 - degrees))
     ty = diffY
     tz = -ty / Math.sin(toRadians(360 - degrees))
 
     tx1 = obliqueY / Math.tan(toRadians(360 - degrees))
     ty1 = -obliqueY
     tz1 = -ty1 / Math.sin(toRadians(360 - degrees))
     
     // x 轴移动
     tx2 = diffX
     ty2 = -tx2 * Math.tan(toRadians(360 - degrees))
     tz2 = -ty2 / Math.sin(toRadians(360 - degrees))
 
     tx3 = -obliqueX
     ty3 = -tx3 * Math.tan(toRadians(360 - degrees)) 
     tz3 = -ty3 / Math.sin(toRadians(360 - degrees))
   }
   if (!xFlag) {
     tx2 = -tx2
     ty2 = -ty2
     tz2 = -tz2
     tx3 = -tx3
     ty3 = -ty3
     tz3 = -tz3
   }
   if (!yFlag) {
     tx = -tx
     ty = -ty
     tz = -tz
     tx1 = -tx1
     ty1 = -ty1
     tz1 = -tz1
   }
   // 找出z移动距离最短的两个，且两个为相反方向
   const positiveList = [] as typeof negativeList
   const negativeList = [] as { x: number; y: number; z: number }[]
   ;[
     { x: tx, y: ty, z: tz },
     { x: tx1, y: ty1, z: tz1 },
     { x: tx2, y: ty2, z: tz2 },
     { x: tx3, y: ty3, z: tz3 }
   ].forEach(item => {
     if (item.z > 0) {
       positiveList.push(item)
     } else {
       negativeList.push(item)
     }
   })
   const positiveDirectionData = Math.abs(positiveList[0].z) < Math.abs(positiveList[1].z) ? positiveList[0] : positiveList[1]
   const negativeDirectionData = Math.abs(negativeList[0].z) < Math.abs(negativeList[1].z) ? negativeList[0] : negativeList[1]
   return [positiveDirectionData, negativeDirectionData]
 }
 
 /**
  * point 是否在矩形 rect 内（边也算）
  * @param point 点坐标
  * @param rect 矩形位置信息
  */
 export const isInRect = (point: { x: number, y: number }, rect: { x: number, y: number, width: number, height?: number }) => {
   if (!rect.height) {
     rect.height = rect.width
   }
   return (point.x >= rect.x - rect.width / 2) &&
     (point.x <= rect.x + rect.width / 2) &&
     (point.y >= rect.y - rect.height / 2) &&
     (point.y <= rect.y + rect.height / 2)
 }
 
 /**
  * 搜索适合放置的坐标点
  * @param planetPositionList 其他已经放置好的行星的坐标信息
  * @param pendingPosition 待放置的图标的起始坐标信息
  * @param degrees 待放置的图标的角度
  * @param maxTransZ 沿着圆心线最大移动距离
  */
 export const searchPosition = (
   planetPositionList: { x: number; y: number; width: number }[],
   pendingPosition: { x: number; y: number; width: number },
   degrees: number,
   maxTransZ = Infinity
 ) => {
   // 要保证跟所有已放置的图标都是不碰撞的，所以取最大 z 距离
   const positiveStepTrans = { x: 0, y: 0, z: 0 }
   const negativeStepTrans = { x: 0, y: 0, z: 0 }
   const len = planetPositionList.length
   for (let i = 0; i < len; i++) {
     const v = transAVoidCollision(
       planetPositionList[i],
       { x: pendingPosition.x + positiveStepTrans.x, y: pendingPosition.y + positiveStepTrans.y, width: pendingPosition.width },
       degrees
     )
     if (v[0].z !== 0) {
       positiveStepTrans.x += v[0].x
       positiveStepTrans.y += v[0].y
       positiveStepTrans.z += v[0].z
       i = 0
     }
   }
   if (Math.abs(positiveStepTrans.z) <= maxTransZ) {
     return {
       x: positiveStepTrans.x,
       y: positiveStepTrans.y,
       z: positiveStepTrans.z
     }
   }
   for (let i = 0; i < planetPositionList.length; i++) {
     const v = transAVoidCollision(
       planetPositionList[i],
       { x: pendingPosition.x + negativeStepTrans.x, y: pendingPosition.y + negativeStepTrans.y, width: pendingPosition.width },
       degrees
     )
     if (v[1].z !== 0) {
       negativeStepTrans.x += v[1].x
       negativeStepTrans.y += v[1].y
       negativeStepTrans.z += v[1].z
       i = 0
     }
   }
   if (Math.abs(negativeStepTrans.z) <= maxTransZ) {
     return {
       x: negativeStepTrans.x,
       y: negativeStepTrans.y,
       z: negativeStepTrans.z
     }
   }
   // 两个都超过了，返回一个小的
   const p = Math.abs(positiveStepTrans.z) <= Math.abs(negativeStepTrans.z) ? positiveStepTrans : negativeStepTrans
   return {
     x: p.x,
     y: p.y,
     z: p.z
   }
 }
 
 /**
  * 将原先在圆心为(rx, ry)圆上的点 (x, y)，沿着与圆心连线移动到半径为 r1 的圆上之后的坐标
  */
 export const transPositionByK = (x: number, y: number, rx: number, ry: number, r1: number) => {
   const r = Math.sqrt(Math.pow(x - rx, 2) + Math.pow(y - ry, 2))
   return {
     x: r1 * (x - rx) / r + rx,
     y: r1 * (y - rx) / r + ry
   }
 }
 /**
  * 已知半径为 r 的圆上两点坐标(x1, y1)、(x2, y2)，求两点围成的圆心角
  */
 export const genCenterAngle = (x1: number, y1: number, x2: number, y2: number, r: number) => {
   // 弦长
   const chord = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
   const halfAngle = Math.asin(chord / 2 / r)
   return toDegrees(halfAngle) * 2
 }
 