<template>
  <svg :height="calculatedHeight" :width="calculatedWidth">
    <scrollbar
            :viewportHeight="calculatedHeight - cornerHeight"
            :viewportWidth="calculatedWidth - cornerWidth"
            :viewportX="cornerWidth"
            :viewportY="cornerHeight"
            :contentWidth="calculatedColumnsWidth"
            :contentHeight="calculatedRowsHeight"
            :scrollReverse="scrollReverse"
            @dragX="onDragX"
            @dragY="onDragY"
    >
      <g :style="dataStyle">
        <rect
                v-for="item in aggregatedData"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="getRectStyle(item)"
                @click="onCellClick($event, item)"
                @touchstart="onCellClick($event, item)"
        ></rect>
        <text
                v-for="item in aggregatedData"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :dy="item.height / 2 + calculatedFontSize / 2"
                :dx="item.width - 5"
                text-anchor="end"
                :style="getTextStyle(item)"
                @click="onCellClick($event, item)"
                @touchstart="onCellClick($event, item)"
        >{{ item.text }}
        </text>
      </g>
      <g :style="colHeaderStyle">
        <rect
                v-for="item in colItems"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.rectStyle"
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
                :style="item.textStyle"
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
                :style="item.rectStyle"
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
                :style="item.textStyle"
        >{{ item.text }}
        </text>
      </g>
      <g>
        <rect :height="cornerHeight" :width="cornerWidth" :style="`fill:${theme.background};stroke:${theme.border}`"></rect>
        <rect
                v-for="item in cornerItems"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.rectStyle"
        ></rect>
        <text
                v-for="item in cornerItems"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :dy="item.height / 2 + calculatedFontSize / 2"
                :dx="item.textStyle.dx"
                :text-anchor="item.textStyle.textAnchor"
                :style="item.textStyle"
        >{{ item.text }}
        </text>
      </g>
    </scrollbar>
  </svg>
</template>

<script>
  /* eslint-disable no-eval */
  import _ from 'underscore'
  import { aggregators, formatters, csvJSON, temporalMixin } from './utils'
  import Scrollbar from './Scrollbar.vue'

  const palette = {
    primary: '#d9e4f1',
    secondary: '#f4f4f4',
    border: '#d4d4d4',
    background: '#ffffff',
    text: '#555555'
  }

  export default {
    components: {
      Scrollbar
    },
    name: 'crosstab',
    data () {
      return {
        values: [],
        dragX: 0,
        dragY: 0,
        parentNodeHeight: Infinity,
        parentNodeWidth: Infinity
      }
    },
    props: {
      dataUrl: {
        type: String
      },
      data: {
        type: Array,
        default: () => []
      },
      transform: {
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
        type: String,
        default: 'count'
      },
      width: {},
      height: {},
      cellWidth: {
        type: Number,
        default: 100
      },
      cellHeight: {
        type: Number,
        default: 25
      },
      fontSize: {
        type: Number
      },
      palette: {
        type: Object
      },
      scrollReverse: {
        type: Boolean,
        default: true
      }
    },
    created () {
      if (this.dataUrl) {
        this.loadData()
      }
    },
    mounted () {
      this.parentNodeHeight = this.$el.parentNode.clientHeight
      this.parentNodeWidth = this.$el.parentNode.clientWidth
    },
    computed: {
      rawData () {
        if (this.data.length) {
          return this.data
        }
        return this.values
      },
      transformedData () {
        let filters = this.transform.filter(item => item.filter)
        let calculations = this.transform.filter(item => item.calculate)
        let data = this.rawData
        let temporal = this.rows.filter(item => item.type === 'temporal')
          .concat(this.cols.filter(item => item.type === 'temporal'))

        data.forEach(datum => {
          temporal.forEach(item => {
            temporalMixin(datum, item)
          })
        })

        data.forEach(datum => {
          calculations.forEach(calculation => {
            eval(calculation.calculate)
          })
        })

        filters.forEach(filter => {
          data = data.filter(datum => {
            return eval(filter.filter)
          })
        })

        return data
      },
      groupedRows () {
        return groupBy(this.transformedData, this.rows)
      },
      groupedCols () {
        return groupBy(this.transformedData, this.cols)
      },
      cornerItems () {
        let result = []
        let isCornerField = true

        if (this.hasRowsAndCols) {
          this.rows.forEach((row, rowIdx) => {
            result.push({
              text: getFieldLabel(row, isCornerField),
              x: rowIdx * this.cellWidth,
              y: (this.cols.length) * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fontWeight: 'bold',
                fill: this.theme.text,
                dx: this.cellWidth / 2,
                'text-anchor': 'middle'
              },
              rectStyle: {
                fill: this.theme.primary,
                stroke: this.theme.border
              }
            })
          })

          this.cols.forEach((col, colIdx) => {
            result.push({
              text: getFieldLabel(col, isCornerField),
              x: 0,
              y: colIdx * this.cellHeight,
              height: this.cellHeight,
              width: this.rows.length * this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fontWeight: 'bold',
                fill: this.theme.text,
                dx: (this.cellWidth * this.rows.length) - this.cellWidth / 4,
                'text-anchor': 'end'
              },
              rectStyle: {
                fill: 'none'
              }
            })
          })
        }

        if (this.hasColsOnly) {
          this.cols.forEach((col, colIdx) => {
            result.push({
              text: getFieldLabel(col, isCornerField),
              x: 0,
              y: colIdx * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fontWeight: 'bold',
                fill: this.theme.text,
                dx: this.cellWidth - this.cellWidth / 4,
                'text-anchor': 'end'
              },
              rectStyle: {
                fill: 'none'
              }
            })
          })
        }

        if (this.hasRowsOnly) {
          this.rows.forEach((row, rowIdx) => {
            result.push({
              text: getFieldLabel(row, isCornerField),
              x: rowIdx * this.cellWidth,
              y: 0,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fontWeight: 'bold',
                fill: this.theme.text,
                dx: this.cellWidth / 2,
                'text-anchor': 'middle'
              },
              rectStyle: {
                fill: 'none',
                stroke: this.theme.border
              }
            })
          })
        }

        return result
      },

      colItems () {
        if (!this.transformedData.length) return
        if (this.cols.length) {
          let colsCount = count(this.groupedCols)
          let colItems = this.getColItems(setColPosition(this.groupedCols), this.cellHeight, this.cellWidth)

          let emptyCellItems = _.map(Array(colsCount), (item, colIdx) => {
            return {
              x: colIdx * this.cellWidth,
              y: (this.cols.length) * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fill: this.theme.text
              },
              rectStyle: {
                fill: this.theme.secondary,
                stroke: this.theme.border
              }
            }
          })

          if (this.rows.length) {
            return colItems.concat(emptyCellItems)
          } else {
            return colItems
          }
        } else {
          if (this.hasNothing) {} else {
            return [{
              text: 'Totals',
              x: 0,
              y: 0,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fontWeight: 'bold',
                fill: this.theme.text
              },
              rectStyle: {
                fill: this.theme.primary,
                stroke: this.theme.border
              }
            }]
          }
        }
      },
      rowItems () {
        if (!this.transformedData.length) return
        if (this.rows.length) {
          let rowItems = this.getRowItems(setRowPosition(this.groupedRows), this.cellHeight, this.cellWidth)

          if (this.cols.length) {
            return rowItems
          } else {
            return rowItems
          }
        } else {
          return [{
            text: 'Totals',
            x: 0,
            y: 0,
            height: this.cellHeight,
            width: this.cellWidth,
            textStyle: {
              fontSize: this.calculatedFontSize,
              fill: this.theme.text,
              fontWeight: 'bold'
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          }]
        }
      },

      aggregatedData () {
        if (!this.transformedData.length) return

        let rowItems = flat(this.groupedRows)
        let colItems = flat(this.groupedCols)
        let result = []
        let aggregationInRows = this.rows.find(item => item.aggregate)
        let aggregatedData = aggregationInRows ? aggregateBy(this.transformedData, this.cols.concat(this.rows)) : aggregateBy(this.transformedData, this.rows.concat(this.cols))

        const isOdd = () => {
          if (isOdd.prev) {
            isOdd.prev.isOdd = !isOdd.prev.isOdd
            return isOdd.prev.isOdd
          } else {
            isOdd.prev = {}
            isOdd.prev.isOdd = true
            return true
          }
        }

        _.each(rowItems, (row, rowIdx) => {
          let isOddRow = isOdd()

          _.each(colItems, (col, colIdx) => {
            let value = aggregationInRows ? getValue(aggregatedData, col.concat(row)) : getValue(aggregatedData, row.concat(col))

            result.push({
              text: value,
              x: colIdx * this.cellWidth,
              y: rowIdx * this.cellHeight,
              isOddRow: isOddRow,
              width: this.cellWidth,
              height: this.cellHeight
            })
          })
        })

        return result
      },

      cornerHeight () {
        if (this.hasRowsAndCols) {
          return (this.cols.length + 1) * this.cellHeight
        }
        if (this.hasColsOnly) {
          return (this.cols.length) * this.cellHeight
        }
        if (this.hasRowsOnly) {
          return this.cellHeight
        }
        if (this.hasNothing) {
          return 0
        }
      },
      cornerWidth () {
        if (this.hasRowsAndCols) {
          return this.rows.length * this.cellWidth
        }
        if (this.hasColsOnly) {
          return this.cellWidth
        }
        if (this.hasRowsOnly) {
          return (this.rows.length) * this.cellWidth
        }
        if (this.hasNothing) {
          return this.cellWidth
        }
      },

      colHeaderStyle () {
        return {
          transform: `translateX(${this.cornerWidth + this.dragX}px)`
        }
      },
      rowHeaderStyle () {
        return {
          transform: `translateY(${this.cornerHeight + this.dragY}px)`
        }
      },
      dataStyle () {
        return {
          transform: `translateX(${this.cornerWidth + this.dragX}px) translateY(${this.cornerHeight + this.dragY}px)`
        }
      },
      calculatedFontSize () {
        if (this.fontSize) {
          return this.fontSize
        }
        return this.cellHeight / 2 < 14 ? this.cellHeight / 2 : 14
      },
      theme () {
        return _.extend({}, palette, this.palette)
      },
      calculatedWidth () {
        let fullWidth = this.cellWidth * (this.rows.length + count(this.groupedCols) + (this.hasNothing ? 1 : 0))

        if (this.width) {
          if (/%$/.test(this.width)) {
            return this.parentNodeWidth * Number.parseInt(this.width) / 100
          }
          return this.width > fullWidth ? fullWidth : this.width
        } else {
          return fullWidth < this.parentNodeWidth ? fullWidth : this.parentNodeWidth
        }
      },
      calculatedHeight () {
        let fullHeight = this.cellHeight * (this.cols.length + count(this.groupedRows) + (this.hasRowsAndCols || this.hasRowsOnly ? 1 : 0))

        if (this.height) {
          if (/%$/.test(this.height)) {
            return this.parentNodeHeight * Number.parseInt(this.height) / 100
          }
          return this.height > fullHeight ? fullHeight : this.height
        } else {
          return fullHeight < this.parentNodeHeight ? fullHeight : this.parentNodeHeight
        }
      },
      calculatedColumnsWidth () {
        return count(this.groupedCols) * this.cellWidth
      },
      calculatedRowsHeight () {
        return count(this.groupedRows) * this.cellHeight
      },
      hasRowsAndCols () {
        return !!(this.rows.length && this.cols.length)
      },
      hasRowsOnly () {
        return !!(this.rows.length && !this.cols.length)
      },
      hasColsOnly () {
        return !!(this.cols.length && !this.rows.length)
      },
      hasNothing () {
        return !!(!this.cols.length && !this.rows.length)
      }
    },
    methods: {
      onDragX (value) {
        this.dragX = value
      },

      onDragY (value) {
        this.dragY = value
      },

      onCellClick (evt, item) {},

      getTextStyle (item) {
        return {
          fontSize: this.calculatedFontSize,
          fill: this.theme.text
        }
      },

      getRectStyle (item) {
        return {
          fill: item.isOddRow ? this.theme.background : this.theme.secondary,
          stroke: this.theme.border
        }
      },

      getColItems (item, cellHeight, cellWidth, result) {
        if (result === undefined) result = []

        _.each(item.items, (item) => {
          result.push({
            text: item.name,
            x: item.x * cellWidth,
            y: (item.y - 1) * cellHeight,
            height: cellHeight,
            width: count(item) * cellWidth,
            textStyle: {
              fontSize: this.calculatedFontSize,
              fill: this.theme.text
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          })

          this.getColItems(item, cellHeight, cellWidth, result)
        })

        return result
      },

      getRowItems (item, cellHeight, cellWidth, result) {
        if (result === undefined) result = []

        _.each(item.items, (item) => {
          result.push({
            text: item.name,
            x: (item.x - 1) * cellWidth,
            y: item.y * cellHeight,
            height: count(item) * cellHeight,
            width: cellWidth,
            textStyle: {
              fontSize: this.calculatedFontSize,
              fill: this.theme.text
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          })

          this.getRowItems(item, cellHeight, cellWidth, result)
        })

        return result
      },

      loadData () {
        let isJSON = /\.json$/.test(this.dataUrl)
        let isCSV = /\.csv$/.test(this.dataUrl)

        let xmlhttp = new window.XMLHttpRequest()
        xmlhttp.open('GET', this.dataUrl, true)
        xmlhttp.onreadystatechange = () => {
          if (xmlhttp.readyState === 4) {
            if (xmlhttp.status === 200) {
              if (isJSON) {
                this.values = JSON.parse(xmlhttp.responseText)
              }
              if (isCSV) {
                this.values = JSON.parse(csvJSON(xmlhttp.responseText))
              }
            }
          }
        }
        xmlhttp.send(null)
      }
    }
  }

  function aggregateBy (data, items, levelIdx) {
    if (levelIdx === undefined) {
      levelIdx = 0

      let tmp = {
        name: 'All'
      }

      if (items.length) {
        tmp.items = aggregateBy(data, items, levelIdx)
      } else {
        tmp.aggregation = data.length
      }

      return tmp
    } else {
      if (items[levelIdx].aggregate && items[levelIdx].aggregate === 'count') {
        return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
          let formatter = formatters[items[levelIdx].formatter] || items[levelIdx].formatter
          let aggregation = aggregators[items[levelIdx].aggregate](value, items[levelIdx].field)

          return {
            name: key,
            aggregation: formatter ? formatter(aggregation) : aggregation
          }
        })
      }
      if (items[levelIdx].aggregate) {
        let aggregation = aggregators[items[levelIdx].aggregate](data, items[levelIdx].field)
        let formatter = formatters[items[levelIdx].formatter] || items[levelIdx].formatter

        return [{
          name: items[levelIdx].aggregate,
          aggregation: formatter ? formatter(aggregation) : aggregation
        }]
      }
      return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
        let tmp = {
          name: key
        }

        if (items.length > levelIdx + 1) {
          tmp.items = aggregateBy(value, items, levelIdx + 1)
        }

        return tmp
      })
    }
  }

  function groupBy (data, items, levelIdx) {
    if (levelIdx === undefined) {
      levelIdx = 0

      let tmp = {
        name: 'All'
      }

      if (items.length) {
        tmp.items = groupBy(data, items, levelIdx)
      }

      return tmp
    } else {
      if (items[levelIdx].aggregate && items[levelIdx].aggregate === 'count') {
        return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
          let tmp = {
            name: key
          }

          if (items.length > levelIdx + 1) {
            tmp.items = groupBy(value, items, levelIdx + 1)
          } else {
            tmp.values = value
          }
          return tmp
        })
      }
      if (items[levelIdx].aggregate) {
        return [{
          name: items[levelIdx].aggregate,
          aggregation: aggregators[items[levelIdx].aggregate](data, items[levelIdx].field)
        }]
      }
      return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
        let tmp = {
          name: key
        }

        if (items.length > levelIdx + 1) {
          tmp.items = groupBy(value, items, levelIdx + 1)
        } else {
          tmp.values = value
        }
        return tmp
      })
    }
  }

  function setColPosition (item, position, levelIdx) {
    if (position === undefined) position = {x: 0, y: 0}
    if (levelIdx === undefined) levelIdx = 0

    item.x = position.x
    item.y = levelIdx

    if (item.items) {
      item.items.forEach((itm, itmIdx) => {
        setColPosition(itm, position, levelIdx + 1)
        if (itmIdx !== item.items.length - 1) {
          position.x++
        }
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
      item.items.forEach((itm, itmIdx) => {
        setRowPosition(itm, position, levelIdx + 1)
        if (itmIdx !== item.items.length - 1) {
          position.y++
        }
      })
    }

    return item
  }

  function count (item, result) {
    if (result === undefined) result = {count: 0}

    if (item.items) {
      item.items.forEach(item => {
        count(item, result)
      })
    } else {
      result.count++
    }

    return result.count
  }

  function flat (item, prefix, result) {
    if (prefix === undefined) prefix = []
    if (result === undefined) result = []

    if (item.items) {
      item.items.forEach(item => {
        flat(item, prefix.concat(item.name), result)
      })
    } else {
      result.push(prefix)
    }

    return result
  }

  function getFieldLabel (item, isCornerField) {
    let label = isCornerField && item.label

    if (item.type === 'temporal') {
      return label || item.timeUnit.concat('_', item.field)
    }

    return label || item.field
  }

  function getValue (aggregation, values) {
    let result = findWhere(aggregation, values)

    return result && result.aggregation
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
