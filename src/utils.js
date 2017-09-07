export const aggregators = {
  count (items) {
    return items.length
  },
  sum (items, measure) {
    return Math.round(items.reduce((memo, item) => {
      return memo + Number.parseFloat(item[measure])
    }, 0))
  },
  max (items, measure) {
    return Math.round(items.reduce((max, item) => {
      return max > Number.parseFloat(item[measure]) ? max : Number.parseFloat(item[measure])
    }, -Infinity))
  },
  min (items, measure) {
    return Math.round(items.reduce((min, item) => {
      return min < Number.parseFloat(item[measure]) ? min : Number.parseFloat(item[measure])
    }, Infinity))
  },
  avg (items, measure) {
    return Math.round(items.reduce((total, item) => {
      return total + Number.parseFloat(item[measure])
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
    datum[fieldName + '_year'] = date.getFullYear()
  }
  if (timeUnit === 'quarter') {
    let month = date.getMonth()

    datum[fieldName + '_quarter'] = month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4'
  }
  if (timeUnit === 'month') {
    datum[fieldName + '_month'] = date.toLocaleString('en-us', {month: 'long'})
  }
  if (timeUnit === 'day') {
    datum[fieldName + '_day'] = date.toLocaleString('en-us', {weekday: 'long'})
  }
}

export const csvJSON = function (csv) {
  let lines = csv.split('\n')
  let result = []

  let headers = lines[0].split(',').map(header => normalize(header))

  for (let i = 1; i < lines.length; i++) {
    let obj = {}
    let currentline = lines[i].split(',')

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = normalize(currentline[j])
    }

    result.push(obj)
  }

  return JSON.parse(JSON.stringify(result))
}

function normalize (value) {
  if (/^['|"]/.test(value) && /['|"]$/.test(value)) {
    return value.slice(1, -1)
  }
  return value
}
