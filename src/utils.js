export const aggregators = {
  count (items) {
    return items.length
  },
  sum (items, measure) {
    return Math.round(items.reduce((memo, item) => {
      return memo + item[measure]
    }, 0))
  },
  max (items, measure) {
    return items.reduce((max, item) => {
      return max > item[measure] ? max : item[measure]
    }, -Infinity)
  },
  min (items, measure) {
    return items.reduce((min, item) => {
      return min < item[measure] ? min : item[measure]
    }, Infinity)
  },
  avg (items, measure) {
    return items.reduce((total, item) => {
      return total + item[measure]
    }, 0) / items.length
  }
}
