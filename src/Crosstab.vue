<template>
  <svg style="clear:both; background-color: white;" :height="calculatedHeight" :width="calculatedWidth">
    <g :style="colHeaderStyle">
      <rect
        v-for="item in colItems"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        style="stroke:silver;fill:rgb(238, 238, 238)"
      ></rect>
      <text
        v-for="item in colItems"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        :dy="item.height / 2 + calculatedFontSize / 2"
        :dx="item.width / 2"
        text-anchor="middle"
        :style="textStyle"
      >{{ item.text }}
      </text>
    </g>

    <g :style="rowHeaderStyle">
      <rect
        v-for="item in rowItems"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        style="stroke:silver;fill:rgb(238, 238, 238);"
      ></rect>
      <text
        v-for="item in rowItems"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        :dy="item.height / 2 + calculatedFontSize / 2"
        :dx="item.width / 2"
        text-anchor="middle"
        :style="textStyle"
      >{{ item.text }}
      </text>
    </g>

    <g :style="dataStyle">
      <rect
        v-for="item in aggregatedData"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        style="stroke:silver;fill:none"
      ></rect>
      <text
        v-for="item in aggregatedData"
        :height="item.height"
        :width="item.width"
        :x="item.x"
        :y="item.y"
        :dy="item.height / 2 + calculatedFontSize / 2"
        :dx="item.width / 2"
        text-anchor="middle"
        :style="textStyle"
      >{{ item.text }}
      </text>
    </g>
  </svg>
</template>

<script>
  import _ from 'underscore'
  import { aggregators } from './utils'

  export default {
    name: 'crosstab',

    props: {
      data: {
        type: Array,
        default: () => []
      },
      rows: {
        type: Array,
        default: () => []
      },
      cols: {
        type: Array,
        default: () => []
      },
      aggregator: {
        type: String
      },
      measure: {
        type: String
      },
      width: {
        type: Number
      },
      height: {
        type: Number
      },
      cellWidth: {
        type: Number
      },
      cellHeight: {
        type: Number
      },
      fontSize: {
        type: Number
      }
    },

    computed: {
      aggregatorFn () {
        return items => {
          return aggregators[this.aggregator] ? aggregators[this.aggregator](items, this.measure) : null
        }
      },
      colItems () {
        if (!this.data.length) return

        return getColItems(setColPosition(aggregateBy(this.data, this.cols, this.aggregatorFn)), this.calculatedCellHeight, this.calculatedCellWidth)
      },
      rowItems () {
        if (!this.data.length) return

        return getRowItems(setRowPosition(aggregateBy(this.data, this.rows, this.aggregatorFn)), this.calculatedCellHeight, this.calculatedCellWidth)
      },
      aggregatedData () {
        if (!this.data.length) return

        return generateData(this.data, this.rows, this.cols, this.aggregatorFn, this.calculatedCellHeight, this.calculatedCellWidth)
      },
      colHeaderStyle () {
        return `transform: translateX(${this.rows.length * this.calculatedCellWidth}px)`
      },
      rowHeaderStyle () {
        return `transform: translateY(${this.cols.length * this.calculatedCellHeight}px)`
      },
      dataStyle () {
        return `transform: translateY(${this.cols.length * this.calculatedCellHeight}px) translateX(${this.rows.length * this.calculatedCellWidth}px)`
      },
      textStyle () {
        return `fill:black;font-size:${this.calculatedFontSize}px;`
      },
      calculatedFontSize () {
        if (this.fontSize) {
          return this.fontSize
        }
        return this.calculatedCellHeight / 2 < 14 ? this.calculatedCellHeight / 2 : 14
      },
      calculatedWidth () {
        if (this.width) {
          return this.width
        }
        return this.calculatedCellWidth * (this.rows.length + count(aggregateBy(this.data, this.cols, this.aggregatorFn)))
      },
      calculatedHeight () {
        if (this.height) {
          return this.height
        }
        return this.calculatedCellHeight * (this.cols.length + count(aggregateBy(this.data, this.rows, this.aggregatorFn)))
      },
      calculatedCellWidth () {
        if (this.width) {
          return this.width / (this.rows.length + count(aggregateBy(this.data, this.cols, this.aggregatorFn)))
        }
        if (this.cellWidth) {
          return this.cellWidth
        }
        return 80
      },
      calculatedCellHeight () {
        if (this.height) {
          return this.height / (this.cols.length + count(aggregateBy(this.data, this.rows, this.aggregatorFn)))
        }
        if (this.cellHeight) {
          return this.cellHeight
        }
        return 25
      }
    }
  }

  function aggregateBy (data, names, aggregatorFn, levelIdx) {
    if (levelIdx === undefined) {
      levelIdx = 0

      let tmp = {
        name: 'All',
        aggregation: aggregatorFn(data)
      }

      if (names.length) {
        tmp.items = aggregateBy(data, names, aggregatorFn, levelIdx)
      } else {
        tmp.values = data
      }

      return tmp
    } else {
      return _.map(_.groupBy(data, names[levelIdx]), function (value, key) {
        let tmp = {
          name: key,
          aggregation: aggregatorFn(value)
        }

        if (names.length > levelIdx + 1) {
          tmp.items = aggregateBy(value, names, aggregatorFn, levelIdx + 1)
        } else {
          tmp.values = value
        }

        return tmp
      })
    }
  }

  function getRowItems (item, height, width, result) {
    if (result === undefined) result = []
    if (height === undefined) height = 30
    if (width === undefined) width = 80

    _.each(item.items, (item) => {
      result.push({
        text: item.name,
        x: (item.x - 1) * width,
        y: item.y * height,
        height: count(item) * height,
        width: width
      })

      getRowItems(item, height, width, result)
    })

    if (item.items) {
      result.push({
        text: 'Total',
        y: (item.items[item.items.length - 1].y + count(item.items[item.items.length - 1])) * height,
        x: item.x * width,
        width: deep(item) * width,
        height
      })
    }

    return result
  }

  function getColItems (item, height, width, result) {
    if (result === undefined) result = []
    if (height === undefined) height = 30
    if (width === undefined) width = 80

    _.each(item.items, (item) => {
      result.push({
        text: item.name,
        x: item.x * width,
        y: (item.y - 1) * height,
        height,
        width: count(item) * width
      })

      getColItems(item, height, width, result)
    })

    if (item.items) {
      result.push({
        text: 'Total',
        x: (item.items[item.items.length - 1].x + count(item.items[item.items.length - 1])) * width,
        y: item.y * height,
        height: deep(item) * height,
        width
      })
    }

    return result
  }

  function deep (item) {
    if (item.items) {
      return deep(item.items[0]) + 1
    } else {
      return 0
    }
  }

  function setColPosition (item, position, levelIdx) {
    if (position === undefined) position = {x: 0, y: 0}
    if (levelIdx === undefined) levelIdx = 0

    item.x = position.x
    item.y = levelIdx

    if (item.items) {
      item.items.forEach((item) => {
        setColPosition(item, position, levelIdx + 1)
        position.x++
      })
    }

    return item
  }

  function setRowPosition (item, position, levelIdx) {
    if (position === undefined) position = {x: 0, y: 0}
    if (levelIdx === undefined) levelIdx = 0

    item.x = levelIdx
    item.y = position.y

    if (item.items) {
      item.items.forEach((item) => {
        setRowPosition(item, position, levelIdx + 1)
        position.y++
      })
    }

    return item
  }

  function count (item, result) {
    if (result === undefined) result = {count: 0}

    _.each(item.items, item => {
      count(item, result)
    })

    return ++result.count
  }

  function flat (item, prefix, result) {
    if (prefix === undefined) prefix = []
    if (result === undefined) result = []

    if (item.items) {
      item.items.forEach(item => {
        flat(item, prefix.concat(item.name), result)
      })
      result.push(prefix)
    } else {
      result.push(prefix)
    }

    return result
  }

  function getAggregations (data, rows, cols, aggregatorFn) {
    const result = []

    if (rows.length) {
      rows.forEach(function (row, idx) {
        result.push(aggregateBy(data, rows.slice(0, rows.length - idx).concat(cols), aggregatorFn))
      })
    }

    result.push(aggregateBy(data, cols, aggregatorFn))

    return result
  }

  function getValue (data, rows, cols, values, aggregatorFn) {
    let result

    getAggregations(data, rows, cols, aggregatorFn).forEach(aggregation => {
      if (result === undefined) {
        result = findWhere(aggregation, values)
      }
    })

    return result && result.aggregation
  }

  function generateData (data, rows, cols, aggregatorFn, cellHeight, cellWidth) {
    let rowItems = flat(aggregateBy(data, rows, aggregatorFn))
    let colItems = flat(aggregateBy(data, cols, aggregatorFn))
    let result = []

    _.each(rowItems, function (row, rowIdx) {
      _.each(colItems, function (col, colIdx) {
        result.push({
          text: getValue(data, rows, cols, rowItems[rowIdx].concat(colItems[colIdx]), aggregatorFn),
          x: colIdx * cellWidth,
          y: rowIdx * cellHeight,
          width: cellWidth,
          height: cellHeight
        })
      })
    })

    return result
  }

  function findWhere (item, values, levelIdx) {
    if (levelIdx === undefined) levelIdx = 0
    if (!item) return

    if (values.length > levelIdx) {
      return findWhere(_.findWhere(item.items, {name: values[levelIdx]}), values, levelIdx + 1)
    } else {
      return item
    }
  }
</script>

<style>

</style>
