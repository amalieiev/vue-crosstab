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
    return Math.round(items.reduce((max, item) => {
      return max > item[measure] ? max : item[measure]
    }, -Infinity))
  },
  min (items, measure) {
    return Math.round(items.reduce((min, item) => {
      return min < item[measure] ? min : item[measure]
    }, Infinity))
  },
  avg (items, measure) {
    return Math.round(items.reduce((total, item) => {
      return total + item[measure]
    }, 0) / items.length)
  }
}

export const formatters = {
  currency (value) {
    return '$' + Number.parseFloat(value).toLocaleString()
  }
}

export const temporalMixin = (datum, item) => {
  let timeUnit = item.timeUnit
  let fieldName = item.field
  let date = new Date(datum[fieldName])

  if (timeUnit === 'year') {
    datum['year_' + fieldName] = date.getFullYear()
  }
  if (timeUnit === 'quarter') {
    let month = date.getMonth()

    datum['quarter_' + fieldName] = month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4'
  }
  if (timeUnit === 'month') {
    datum['month_' + fieldName] = date.toLocaleString('en-us', {month: 'long'})
  }
  if (timeUnit === 'day') {
    datum['day_' + fieldName] = date.toLocaleString('en-us', {weekday: 'long'})
  }
}

export const csvJSON = function (csv) {
  let lines = csv.split('\n')
  let result = []

  let headers = lines[0].split(',')

  for (let i = 1; i < lines.length; i++) {
    let obj = {}
    let currentline = lines[i].split(',')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j]
    }

    result.push(obj)
  }

  return JSON.parse(JSON.stringify(result))
}
