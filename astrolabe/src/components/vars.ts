import BaiYang from '../assets/constellation/白羊座.png'
import ChuNv from '../assets/constellation/处女座.png'
import JinNiu from '../assets/constellation/金牛座.png'
import JuXie from '../assets/constellation/巨蟹座.png'
import MoJie from '../assets/constellation/摩羯座.png'
import SheShou from '../assets/constellation/射手座.png'
import ShiZi from '../assets/constellation/狮子座.png'
import ShuangYu from '../assets/constellation/双鱼座.png'
import ShuangZi from '../assets/constellation/双子座.png'
import ShuiPing from '../assets/constellation/水瓶座.png'
import TianCheng from '../assets/constellation/天秤座.png'
import TianXie from '../assets/constellation/天蝎座.png'
import TaiYang from '../assets/planet/太阳.png'
import YueLiang from '../assets/planet/月亮.png'
import ShuiXing from '../assets/planet/水星.png'
import JinXing from '../assets/planet/金星.png'
import HuoXing from '../assets/planet/火星.png'
import MuXing from '../assets/planet/木星.png'
import TuXing from '../assets/planet/土星.png'
import TianWangXing from '../assets/planet/天王星.png'
import HaiWangXing from '../assets/planet/海王星.png'
import MingWangXing from '../assets/planet/冥王星.png'
import YueBeiJiao from '../assets/planet/月北交.png'
import KaiLongXing from '../assets/planet/凯龙.png'

export const clientW = document.documentElement.clientWidth || document.body.clientWidth

export const constellationData = [
  { key: 97, label: 'ASC' },
  { key: 98, label: '二宫' },
  { key: 99, label: '三宫' },
  { key: 100, label: 'IC' },
  { key: 101, label: '五宫' },
  { key: 102, label: '六宫' },
  { key: 103, label: 'DES' },
  { key: 104, label: '八宫' },
  { key: 105, label: '九宫' },
  { key: 106, label: 'MC' },
  { key: 107, label: '十一宫' },
  { key: 108, label: '十二宫' }
] as const
export const constellationList = constellationData.map(c => c.key)

export type TConstellationItem = typeof constellationList[number]

export const constellationMap = {
  [constellationList[0]]: { name: '白羊', icon: BaiYang },
  [constellationList[1]]: { name: '金牛', icon: JinNiu },
  [constellationList[2]]: { name: '双子', icon: ShuangZi },
  [constellationList[3]]: { name: '巨蟹', icon: JuXie },
  [constellationList[4]]: { name: '狮子', icon: ShiZi },
  [constellationList[5]]: { name: '处女', icon: ChuNv },
  [constellationList[6]]: { name: '天秤', icon: TianCheng },
  [constellationList[7]]: { name: '天蝎', icon: TianXie },
  [constellationList[8]]: { name: '射手', icon: SheShou },
  [constellationList[9]]: { name: '摩羯', icon: MoJie },
  [constellationList[10]]: { name: '水瓶', icon: ShuiPing },
  [constellationList[11]]: { name: '双鱼', icon: ShuangYu },
} as const

export const planetMap = {
  65: { name: '太阳', icon: TaiYang },
  66: { name: '月亮', icon: YueLiang },
  67: { name: '水星', icon: ShuiXing },
  68: { name: '金星', icon: JinXing },
  69: { name: '火星', icon: HuoXing },
  70: { name: '木星', icon: MuXing },
  71: { name: '土星', icon: TuXing },
  72: { name: '天王星', icon: TianWangXing },
  73: { name: '海王星', icon: HaiWangXing },
  74: { name: '冥王星', icon: MingWangXing },
  // 75: '实际月北交',
  76: { name: '月北交', icon: YueBeiJiao },
  // 77: '黑月莉莉丝',
  78: { name: '凯龙星', icon: KaiLongXing },
} as const

export type TPlanetKey = keyof typeof planetMap

type TKeyAngle = {
  // 进入的星座key
  in_key: TConstellationItem
  // 进入星座的角度
  angle: number
}

export type TAstrolabeData = {
  // 宫位
  houses: TKeyAngle[]
  // 行星
  planets: Array<TKeyAngle & { planet_key: TPlanetKey }>
}

export type TPlanetPositionItem = {
  x: number,
  y: number,
  width: number,
  name: string,
  planetKey: TAstrolabeData['planets'][number]['planet_key']
}

const phaseBaseData = {
  // 0°，合相
  conjunction: {
    name: '合相',
    angle: 0,
    tolerance: 7,
    color: '#003366'
  },
  // 60°，六分相
  sextile: {
    name: '六分相',
    angle: 60,
    tolerance: 5,
    color: '#00B8B8'
  },
  // 90°，四分相/刑相
  square: {
    name: '四分相/刑相',
    angle: 90,
    tolerance: 6,
    color: 'red'
  },
  // 120°，三分相、拱、三合
  trine: {
    name: '三分相/拱/三合',
    angle: 120,
    tolerance: 6,
    color: 'green'
  },
  // 180°，冲相、对分相、对冲
  opposition: {
    name: '冲相/对分相/对冲',
    angle: 180,
    tolerance: 6,
    color: 'blue'
  }
} as const

export const phaseBaseDataList = Object.values(phaseBaseData)

export type TPhaseDataItem = typeof phaseBaseDataList[number]