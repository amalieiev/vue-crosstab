<template>
  <svg :height="calculatedHeight" :width="calculatedWidth">
    <minimap
            :viewportHeight="calculatedHeight - cornerHeight"
            :viewportWidth="calculatedWidth - cornerWidth"
            :viewportX="cornerWidth"
            :viewportY="cornerHeight"
            :contentWidth="calculatedColumnsWidth"
            :contentHeight="calculatedRowsHeight"
            :mapMaxHeight="100"
            :mapMaxWidth="100"
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
                :style="item.rectStyle"
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
                :style="item.textStyle"
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
    </minimap>
  </svg>
</template>

<script>
  import _ from 'underscore'
  import { aggregators } from './utils'
  import Minimap from './Minimap.vue'

  const palette = {
    primary: '#d9e4f1',
    secondary: '#f4f4f4',
    border: '#d4d4d4',
    background: '#ffffff',
    text: '#555555'
  }

  export default {
    components: {
      Minimap
    },
    name: 'crosstab',
    data () {
      return {
        dragX: 0,
        dragY: 0
      }
    },
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
        type: String,
        default: 'count'
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
      }
    },
    computed: {
      aggregatorFn () {
        return items => {
          return aggregators[this.aggregator](items, this.measure)
        }
      },
      rowsAggregation () {
        return aggregateBy(this.data, this.rows, this.aggregatorFn)
      },
      colsAggregation () {
        return aggregateBy(this.data, this.cols, this.aggregatorFn)
      },
      cornerItems () {
        let result = []

        if (this.hasRowsAndCols) {
          this.rows.forEach((row, rowIdx) => {
            result.push({
              text: row,
              x: rowIdx * this.cellWidth,
              y: (this.cols.length + 1) * this.cellHeight,
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
              text: col,
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

          result.push({
            text: 'measure',
            x: 0,
            y: this.cols.length * this.cellHeight,
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
        }

        if (this.hasColsOnly) {
          this.cols.forEach((col, colIdx) => {
            result.push({
              text: col,
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

          result.push({
            text: 'measure',
            x: 0,
            y: this.cols.length * this.cellHeight,
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
        }

        if (this.hasRowsOnly) {
          this.rows.forEach((row, rowIdx) => {
            result.push({
              text: row,
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

          result.push({
            text: 'measure',
            x: this.rows.length * this.cellWidth,
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
              fill: 'none'
            }
          })
        }

        return result
      },

      colItems () {
        if (!this.data.length) return
        if (this.cols.length) {
          let colsCount = count(this.colsAggregation)
          let colItems = this.getColItems(setColPosition(this.colsAggregation), this.cellHeight, this.cellWidth)
          let colMeasureItems = _.map(Array(colsCount), (item, colIdx) => {
            return {
              text: this.measure,
              x: colIdx * this.cellWidth,
              y: this.cols.length * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fill: this.theme.text
              },
              rectStyle: {
                fill: this.theme.primary,
                stroke: this.theme.border
              }
            }
          })
          let emptyCellItems = _.map(Array(colsCount), (item, colIdx) => {
            return {
              x: colIdx * this.cellWidth,
              y: (this.cols.length + 1) * this.cellHeight,
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
            return colItems.concat(colMeasureItems, emptyCellItems)
          } else {
            return colItems.concat(colMeasureItems)
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
              fontWeight: 'bold',
              fill: this.theme.text
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          }]
        }
      },
      rowItems () {
        if (!this.data.length) return
        if (this.rows.length) {
          let rowsCount = count(this.rowsAggregation)
          let rowItems = this.getRowItems(setRowPosition(this.rowsAggregation), this.cellHeight, this.cellWidth)

          if (this.cols.length) {
            return rowItems
          } else {
            let rowMeasureItems = _.map(Array(rowsCount), (item, rowIdx) => {
              return {
                text: this.measure,
                x: this.rows.length * this.cellWidth,
                y: rowIdx * this.cellHeight,
                height: this.cellHeight,
                width: this.cellWidth,
                textStyle: {
                  fontSize: this.calculatedFontSize,
                  fill: this.theme.text
                },
                rectStyle: {
                  fill: this.theme.primary,
                  stroke: this.theme.border
                }
              }
            })

            return rowItems.concat(rowMeasureItems)
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
        if (!this.data.length) return

        let rowItems = flat(aggregateBy(this.data, this.rows, this.aggregatorFn))
        let colItems = flat(aggregateBy(this.data, this.cols, this.aggregatorFn))
        let result = []

        _.each(rowItems, (row, rowIdx) => {
          _.each(colItems, (col, colIdx) => {
            result.push({
              text: getValue(this.data, this.rows, this.cols, rowItems[rowIdx].concat(colItems[colIdx]), this.aggregatorFn),
              x: colIdx * this.cellWidth,
              y: rowIdx * this.cellHeight,
              width: this.cellWidth,
              height: this.cellHeight,
              textStyle: {
                fontSize: this.calculatedFontSize,
                fill: this.theme.text
              },
              rectStyle: {
                fill: this.theme.background,
                stroke: this.theme.border
              }
            })
          })
        })

        return result
      },

      cornerHeight () {
        if (this.rows.length && this.cols.length) {
          return (this.cols.length + 2) * this.cellHeight
        }
        if (!this.rows.length && this.cols.length) {
          return (this.cols.length + 1) * this.cellHeight
        }
        if (this.rows.length && !this.cols.length) {
          return this.cellHeight
        }
      },
      cornerWidth () {
        if (this.rows.length && this.cols.length) {
          return this.rows.length * this.cellWidth
        }
        if (!this.rows.length && this.cols.length) {
          return this.cellWidth
        }
        if (this.rows.length && !this.cols.length) {
          return (this.rows.length + 1) * this.cellWidth
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
        if (this.width) {
          return this.width
        }

        return this.cellWidth * (this.rows.length + count(this.colsAggregation) + (this.hasColsOnly || this.hasRowsOnly ? 1 : 0))
      },
      calculatedHeight () {
        if (this.height) {
          return this.height
        }

        return this.cellHeight * (this.cols.length + count(this.rowsAggregation) + (this.hasRowsAndCols ? 2 : 1))
      },
      calculatedColumnsWidth () {
        return count(this.colsAggregation) * this.cellWidth
      },
      calculatedRowsHeight () {
        return count(this.rowsAggregation) * this.cellHeight
      },
      hasRowsAndCols () {
        return !!(this.rows.length && this.cols.length)
      },
      hasRowsOnly () {
        return !!(this.rows.length && !this.cols.length)
      },
      hasColsOnly () {
        return !!(this.cols.length && !this.rows.length)
      }
    },
    methods: {
      onDragX (value) {
        this.dragX = value
      },

      onDragY (value) {
        this.dragY = value
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

        if (item.items) {
          result.push({
            text: 'Total',
            x: (item.items[item.items.length - 1].x + count(item.items[item.items.length - 1])) * cellWidth,
            y: item.y * cellHeight,
            height: deep(item) * cellHeight,
            width: cellWidth,
            textStyle: {
              fontSize: this.calculatedFontSize,
              fontWeight: 'bold',
              fill: this.theme.text
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          })
        }

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

        if (item.items) {
          result.push({
            text: 'Total',
            y: (item.items[item.items.length - 1].y + count(item.items[item.items.length - 1])) * cellHeight,
            x: item.x * cellWidth,
            width: deep(item) * cellWidth,
            height: cellHeight,
            textStyle: {
              fontSize: this.calculatedFontSize,
              fontWeight: 'bold',
              fill: this.theme.text
            },
            rectStyle: {
              fill: this.theme.primary,
              stroke: this.theme.border
            }
          })
        }

        return result
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
