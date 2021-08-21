const digitsRE = /(\d{3})(?=\d)/g

export function currency (value: string | number, currency?: string, decimals?: number) {
  const strValue = parseFloat(String(value))
  if (!isFinite(strValue) || (!strValue && strValue !== 0)) return ''
  currency = currency || '$'
  decimals = typeof decimals === 'number' ? decimals : 2
  var stringified = Math.abs(strValue).toFixed(decimals)
  var _int = decimals
    ? stringified.slice(0, -1 - decimals)
    : stringified
  var i = _int.length % 3
  var head = i > 0
    ? (_int.slice(0, i) + (_int.length > 3 ? ',' : ''))
    : ''
  var _float = decimals
    ? stringified.slice(-1 - decimals)
    : ''
  var sign = strValue < 0 ? '-' : ''
  return sign + currency + head +
    _int.slice(i).replace(digitsRE, '$1,') +
    _float
}