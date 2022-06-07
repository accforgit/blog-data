import { drawRing, drawIcon, drawLine } from './canvas'
import { genXByDegrees, genYByDegrees, searchPosition, transPositionByK, genCenterAngle } from './math'
import {
  clientW, constellationList, planetMap, constellationMap, phaseBaseDataList,
  TPlanetPositionItem, TAstrolabeData, TConstellationItem, TPhaseDataItem
} from './vars'

const themeColor = '#a29528'

// 以 iPhone 6 为基准
const sizeRate = clientW / 375

const scaleNum = (n: number) => n * sizeRate

// 星座顺序，从第一宫开始
const getConstellationSort = (firstHouseInKey: TConstellationItem) => {
  const firstHouseIndex = constellationList.indexOf(firstHouseInKey)
  return constellationList.slice(firstHouseIndex).concat(constellationList.slice(0, firstHouseIndex))
}

export const draw = async (ctx: CanvasRenderingContext2D, astrolabeData: TAstrolabeData) => {
  // 星座顺序，从上升星座开始逆时针
  const constellationSortList = getConstellationSort(astrolabeData.houses[0].in_key)
  // 与屏幕的边距
  const paddingH = 4
  // 星座外圆
  const constellationOutRadius = Math.floor((clientW - paddingH * 2) / 2)
  // 圆心坐标
  const radiusX = paddingH + constellationOutRadius
  const radiusY = paddingH + constellationOutRadius
  // 星座内圆与外圆的边距
  const constellationGap = scaleNum(32)
  // 星座内圆半径
  const constellationInnerRadius = constellationOutRadius - constellationGap
  const firstAngle = astrolabeData.houses[0].angle
  // 上升星座与水平线夹角
  const resetAngle = firstAngle / 60
  // 星座圆环与宫圆环的间距
  const gap = scaleNum(60)
  // 宫外圆半径
  const houseOutRadius = constellationInnerRadius - gap
  // 宫外圆与内圆的间距
  const houseGap = scaleNum(14)
  // 宫内圆半径
  const houseInnerRadius = houseOutRadius - houseGap
  // 绘制星座
  drawConstellation(ctx, constellationOutRadius, constellationInnerRadius, radiusX, radiusY, resetAngle, constellationSortList)
  // 绘制十二宫
  drawHouse(ctx, houseOutRadius, houseInnerRadius, constellationInnerRadius, radiusX, radiusY, resetAngle, constellationSortList, astrolabeData.houses)
  // 绘制行星
  const planetPositionList = drawPlanet(ctx, constellationInnerRadius, houseOutRadius, radiusX, radiusY, resetAngle, constellationSortList, astrolabeData.planets)
  // 相位划线
  drawPhase(ctx, planetPositionList, radiusX, radiusY, houseInnerRadius)
}

/**
 * 绘制星座相关
 * @param constellationOutRadius 外圆半径
 * @param constellationInnerRadius 外圆半径
 * @param rx 圆心x坐标
 * @param ry 圆心y坐标
 * @param resetAngle 上升星座和第一宫的夹角（即与水平线夹角）
 * @param constellationSortList 星座排序（第一个是上升星座）
 */
const drawConstellation = (
  ctx: CanvasRenderingContext2D,
  constellationOutRadius: number,
  constellationInnerRadius: number,
  rx: number,
  ry: number,
  resetAngle: number,
  constellationSortList: ReturnType<typeof getConstellationSort>
) => {
  // 星座icon尺寸
  const iconSize = scaleNum(20)
  ctx.save()
  // 星座圆环背景
  drawRing(ctx, rx, ry, constellationOutRadius, constellationInnerRadius)
  ctx.beginPath()
  ctx.strokeStyle = themeColor
  // 绘制圆环
  // 外圆边
  ctx.arc(rx, ry, constellationOutRadius, 0, Math.PI * 2)
  ctx.stroke()
  // 内圆边
  ctx.beginPath()
  ctx.arc(rx, ry, constellationInnerRadius, 0, Math.PI * 2)
  ctx.stroke()
  const constellationTextRadius = (constellationOutRadius + constellationInnerRadius) / 2
  // 绘制划分线和图标
  for (let i = 0; i < 12; i++) {
    const constellationDegrees = i * 30 - resetAngle
    // 十二星座划分线，线段起点在星座内圆，终点在星座内圆
    ctx.beginPath()
    ctx.moveTo(genXByDegrees(constellationDegrees, constellationOutRadius, rx), genYByDegrees(constellationDegrees, constellationOutRadius, rx))
    ctx.lineTo(genXByDegrees(constellationDegrees, constellationInnerRadius, ry), genYByDegrees(constellationDegrees, constellationInnerRadius, ry))
    ctx.lineWidth = 1
    ctx.stroke()
    // 星座图标
    drawIcon(ctx, constellationMap[constellationSortList[i]].icon, iconSize, rx, ry, constellationTextRadius, constellationDegrees + 15)
  }
  ctx.restore()
}

/**
 * 绘制十二宫相关
 * @param ctx ctx
 * @param houseOutRadius 外圆半径
 * @param houseInnerRadius 外圆半径
 * @param constellationInnerRadius 星座内圆半径
 * @param rx 圆心x坐标
 * @param ry 圆心y坐标
 * @param resetAngle 上升星座和第一宫的夹角（即与水平线夹角
 * @param constellationSortList 星座排序（第一个是上升星座）
 * @param astrolabeDataHouses 十二宫数据
 */
const drawHouse = (
  ctx: CanvasRenderingContext2D,
  houseOutRadius: number,
  houseInnerRadius: number,
  constellationInnerRadius: number,
  rx: number,
  ry: number,
  resetAngle: number,
  constellationSortList: ReturnType<typeof getConstellationSort>,
  astrolabeDataHouses: TAstrolabeData['houses']
) => {
  ctx.save()
  // 宫圆环背景
  drawRing(ctx, rx, ry, houseOutRadius, houseInnerRadius, '#efffff')
  ctx.beginPath()
  // 绘制圆环
  ctx.fillStyle = themeColor
  ctx.strokeStyle = '#3d7489'
  ctx.arc(rx, ry, houseOutRadius, 0, Math.PI * 2)
  ctx.arc(rx, ry, houseInnerRadius, 0, Math.PI * 2)
  ctx.stroke()
  // 文案样式
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `${scaleNum(10)}px sans-serif`
  // 十二宫数字所在虚圆的半径
  const houseTextRadius = (houseOutRadius + houseInnerRadius) / 2
  const houseStartAngle = [] as number[]
  for (let i = 0; i < 12; i++) {
    houseStartAngle[i] = constellationSortList.findIndex(v => v === astrolabeDataHouses[i].in_key) * 30 + astrolabeDataHouses[i].angle / 60 - resetAngle
  }
  for (let i = 0; i < 12; i++) {
    ctx.beginPath()
    ctx.lineWidth = [0, 3, 6, 9].includes(i) ? 2 : 1
    // 找到宫头所在的星座角度
    const houseInCDegrees = houseStartAngle[i]
    // 十二星座划分线，线段起点在宫内圆，终点在星座内圆
    ctx.moveTo(genXByDegrees(houseInCDegrees, houseInnerRadius, rx), genYByDegrees(houseInCDegrees, houseInnerRadius, rx))
    ctx.lineTo(genXByDegrees(houseInCDegrees, constellationInnerRadius, rx), genYByDegrees(houseInCDegrees, constellationInnerRadius, rx))
    ctx.stroke()
    // 宫数字
    const textDegrees = houseInCDegrees + (i < 11 ? ((houseStartAngle[i + 1] - houseStartAngle[i]) / 2) : (360 - houseStartAngle[i]) / 2)
    ctx.fillText(
      String(i + 1),
      genXByDegrees(textDegrees, houseTextRadius, rx),
      genYByDegrees(textDegrees, houseTextRadius, ry)
    )
  }
  ctx.restore()
}

/**
 * 绘制行星相关
 * @param ctx ctx
 * @param constellationInnerRadius 星座内圆半径
 * @param houseOutRadius 外圆半径
 * @param rx 圆心x坐标
 * @param ry 圆心y坐标
 * @param resetAngle 上升星座和第一宫的夹角（即与水平线夹角
 * @param constellationSortList 星座排序（第一个是上升星座）
 * @param astrolabeDataPlanets 行星数据
 * @return planetPositionList 行星位置数据
 */
const drawPlanet = (
  ctx: CanvasRenderingContext2D,
  constellationInnerRadius: number,
  houseOutRadius: number,
  rx: number,
  ry: number,
  resetAngle: number,
  constellationSortList: ReturnType<typeof getConstellationSort>,
  astrolabeDataPlanets: TAstrolabeData['planets']
) => {
  // icon 尺寸
  const iconSize = scaleNum(20)
  ctx.save()
  ctx.beginPath()
  // 行星图标基准半径
  const planetRoundRadius = houseOutRadius + (constellationInnerRadius - houseOutRadius) / 2
  const planetsStartAngle = [] as number[]
  // 已放置好的行星坐标信息，(x, y) 是中心点坐标，width 是图标尺寸
  const planetPositionList = [] as TPlanetPositionItem[]
  for (const p of astrolabeDataPlanets) {
    planetsStartAngle.push(constellationSortList.findIndex(v => v === p.in_key) * 30 + p.angle / 60 - resetAngle)
  }
  const maxTransZ = (constellationInnerRadius - houseOutRadius) / 2
  for (let index = 0; index < astrolabeDataPlanets.length; index++) {
    // 行星
    const planetInCDegrees = planetsStartAngle[index]
    const planetKey = astrolabeDataPlanets[index].planet_key
    const planetItem = planetMap[planetKey]
    if (!planetItem) continue
    const centerX = genXByDegrees(planetInCDegrees, planetRoundRadius, rx)
    const centerY = genYByDegrees(planetInCDegrees, planetRoundRadius, ry)
    const currentPosition = { x: centerX, y: centerY, width: iconSize, name: planetItem.name, planetKey }
    const maxTrans = searchPosition(planetPositionList, currentPosition, planetInCDegrees, maxTransZ)
    currentPosition.x += maxTrans.x
    currentPosition.y += maxTrans.y
    planetPositionList.push(currentPosition)
    drawIcon(ctx, planetItem.icon, iconSize, rx, ry, planetRoundRadius + maxTrans.z, planetInCDegrees)
  }
  ctx.restore()
  return planetPositionList
}

// 绘制相位
const drawPhase = (
  ctx: CanvasRenderingContext2D,
  planetPositionList: TPlanetPositionItem[],
  radiusX: number,
  radiusY: number,
  lineR: number
) => {
  // 将行星坐标都映射到半径为 lineR 的圆上，方便划相位线
  const linePositionList = planetPositionList.map(p => {
    return {
      ...p,
      ...transPositionByK(p.x, p.y, radiusX, radiusY, lineR)
    }
  })
  const len = linePositionList.length
  for (let i = 0; i < len; i++) {
    const v1 = linePositionList[i]
    for (let j = i + 1; j < len; j++) {
      const v2 = linePositionList[j]
      for (const v of phaseBaseDataList) {
        const result = isPhaseAngle(v1.x, v1.y, v2.x, v2.y, lineR, v)
        if (result) {
          drawLine(ctx, v1.x, v1.y, v2.x, v2.y, v.color)
        }
      }
    }
  }
}

/**
 * 半径为 r 的圆上两点(x1, y1)、(x2, y2) 所成夹角是否成相位
 * @param x1 x1
 * @param y1 y1
 * @param x2 x2
 * @param y2 y2
 * @param r r
 * @param phaseDataItem phaseDataItem
 */
 export const isPhaseAngle = (x1: number, y1: number, x2: number, y2: number, r: number, phaseDataItem: TPhaseDataItem) => {
  const angle = genCenterAngle(x1, y1, x2, y2, r)
  return angle >= (phaseDataItem.angle - phaseDataItem.tolerance) && angle <= (phaseDataItem.angle + phaseDataItem.tolerance)
}

