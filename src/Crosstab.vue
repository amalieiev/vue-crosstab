<template>
  <div class="container" :style="{height: calculatedHeight+'px', width: calculatedWidth+'px'}">
    <div class="corner" :style="cornerStyle">
      <svg :height="cornerHeight" :width="cornerWidth">
        <g>
          <rect
                  v-for="item in cornerItems"
                  :height="item.height"
                  :width="item.width"
                  :x="item.x"
                  :y="item.y"
                  style="stroke:silver;fill:rgb(238, 238, 238)"
          ></rect>
          <text
                  v-for="item in cornerItems"
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
    </div>
    <div class="cols" :style="colHeaderStyle">
      <svg :height="cornerHeight" :width="calculatedColumnsWidth" :style="{transform: `translateX(${-scrollLeft}px)`}">
        <g>
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
      </svg>
    </div>
    <div class="rows" :style="rowHeaderStyle">
      <svg :height="calculatedRowsHeight" :width="cornerWidth" :style="{transform: `translateY(${-scrollTop}px)`}">
        <g>
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
      </svg>
    </div>
    <div class="body" ref="body" :style="dataStyle" @scroll="onScroll">
      <div class="wrap" :style="{height: calculatedRowsHeight+'px', width: calculatedColumnsWidth+'px'}">
        <svg :height="calculatedRowsHeight" :width="calculatedColumnsWidth">
          <g>
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
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'underscore'
  import { aggregators } from './utils'
  import Ps from 'perfect-scrollbar'

  export default {
    name: 'crosstab',
    data () {
      return {
        scrollTop: 0,
        scrollLeft: 0
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
        type: String,
        default: ''
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
      }
    },
    mounted () {
      Ps.initialize(this.$refs.body)
    },
    beforeDestroy () {
      Ps.destroy(this.$refs.body)
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
              width: this.cellWidth
            })
          })

          this.cols.forEach((col, colIdx) => {
            result.push({
              text: col,
              x: 0,
              y: colIdx * this.cellHeight,
              height: this.cellHeight,
              width: this.rows.length * this.cellWidth
            })
          })

          result.push({
            text: this.measure,
            x: 0,
            y: this.cols.length * this.cellHeight,
            height: this.cellHeight,
            width: this.rows.length * this.cellWidth
          })
        }

        if (this.hasColsOnly) {
          this.cols.forEach((col, colIdx) => {
            result.push({
              text: col,
              x: 0,
              y: colIdx * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth
            })
          })

          result.push({
            text: this.measure,
            x: 0,
            y: this.cols.length * this.cellHeight,
            height: this.cellHeight,
            width: this.cellWidth
          })
        }

        if (this.hasRowsOnly) {
          this.rows.forEach((row, rowIdx) => {
            result.push({
              text: row,
              x: rowIdx * this.cellWidth,
              y: 0,
              height: this.cellHeight,
              width: this.cellWidth
            })
          })

          result.push({
            text: this.measure,
            x: this.rows.length * this.cellWidth,
            y: 0,
            height: this.cellHeight,
            width: this.cellWidth
          })
        }

        return result
      },

      colItems () {
        if (!this.data.length) return
        if (this.cols.length) {
          let colsCount = count(this.colsAggregation)
          let colItems = getColItems(setColPosition(this.colsAggregation), this.cellHeight, this.cellWidth)
          let colMeasureItems = _.map(Array(colsCount), (item, colIdx) => {
            return {
              text: this.aggregator,
              x: colIdx * this.cellWidth,
              y: this.cols.length * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth
            }
          })
          let emptyCellItems = _.map(Array(colsCount), (item, colIdx) => {
            return {
              x: colIdx * this.cellWidth,
              y: (this.cols.length + 1) * this.cellHeight,
              height: this.cellHeight,
              width: this.cellWidth
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
            width: this.cellWidth
          }]
        }
      },
      rowItems () {
        if (!this.data.length) return
        if (this.rows.length) {
          let rowsCount = count(this.rowsAggregation)
          let rowItems = getRowItems(setRowPosition(this.rowsAggregation), this.cellHeight, this.cellWidth)

          if (this.cols.length) {
            return rowItems
          } else {
            let rowMeasureItems = _.map(Array(rowsCount), (item, rowIdx) => {
              return {
                text: this.aggregator,
                x: this.rows.length * this.cellWidth,
                y: rowIdx * this.cellHeight,
                height: this.cellHeight,
                width: this.cellWidth
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
            width: this.cellWidth
          }]
        }
      },
      aggregatedData () {
        if (!this.data.length) return

        return generateData(this.data, this.rows, this.cols, this.aggregatorFn, this.cellHeight, this.cellWidth)
      },

      cornerStyle () {
        return {
          height: this.cornerHeight + 'px',
          width: this.cornerWidth + 'px'
        }
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
          height: this.cornerHeight + 'px',
          width: this.calculatedWidth - this.cornerWidth + 'px'
        }
      },
      rowHeaderStyle () {
        return {
          height: `${this.calculatedHeight - this.cornerHeight}px`,
          width: `${this.cornerWidth}px`
        }
      },
      dataStyle () {
        return {
          height: `${this.calculatedHeight - this.cornerHeight}px`,
          width: `${this.calculatedWidth - this.cornerWidth}px`
        }
      },
      textStyle () {
        return `fill:black;font-size:${this.calculatedFontSize}px;`
      },
      calculatedFontSize () {
        if (this.fontSize) {
          return this.fontSize
        }
        return this.cellHeight / 2 < 14 ? this.cellHeight / 2 : 14
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
      calculatedRowsWidth () {
        return this.rows.length * this.cellWidth
      },
      calculatedColumnsContainerWidth () {
        return this.calculatedWidth - this.rows.length * this.cellWidth
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
      onScroll () {
        this.scrollTop = this.$refs.body.scrollTop
        this.scrollLeft = this.$refs.body.scrollLeft
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

  function getRowItems (item, cellHeight, cellWidth, result) {
    if (result === undefined) result = []

    _.each(item.items, (item) => {
      result.push({
        text: item.name,
        x: (item.x - 1) * cellWidth,
        y: item.y * cellHeight,
        height: count(item) * cellHeight,
        width: cellWidth
      })

      getRowItems(item, cellHeight, cellWidth, result)
    })

    if (item.items) {
      result.push({
        text: 'Total',
        y: (item.items[item.items.length - 1].y + count(item.items[item.items.length - 1])) * cellHeight,
        x: item.x * cellWidth,
        width: deep(item) * cellWidth,
        height: cellHeight
      })
    }

    return result
  }

  function getColItems (item, cellHeight, cellWidth, result) {
    if (result === undefined) result = []

    _.each(item.items, (item) => {
      result.push({
        text: item.name,
        x: item.x * cellWidth,
        y: (item.y - 1) * cellHeight,
        height: cellHeight,
        width: count(item) * cellWidth
      })

      getColItems(item, cellHeight, cellWidth, result)
    })

    if (item.items) {
      result.push({
        text: 'Total',
        x: (item.items[item.items.length - 1].x + count(item.items[item.items.length - 1])) * cellWidth,
        y: item.y * cellHeight,
        height: deep(item) * cellHeight,
        width: cellWidth
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
  .container {
    background-color: white;
    position: relative;
  }
  .corner {
    float: left;
  }
  .cols {
    overflow: hidden;
    float: left;
  }
  .rows {
    overflow: hidden;
    float: left;
  }
  .body {
    position: relative;
    float: left;
  }
  .wrap {
    overflow: hidden;
  }


  /* perfect-scrollbar v0.6.10 */
  .ps-container {
    -ms-touch-action: none;
    touch-action: none;
    overflow: hidden !important;
    -ms-overflow-style: none; }
  @supports (-ms-overflow-style: none) {
    .ps-container {
      overflow: auto !important; } }
  @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
    .ps-container {
      overflow: auto !important; } }
  .ps-container.ps-active-x > .ps-scrollbar-x-rail,
  .ps-container.ps-active-y > .ps-scrollbar-y-rail {
    display: block;
    background-color: transparent; }
  .ps-container.ps-in-scrolling {
    pointer-events: none; }
  .ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #999; }
  .ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #999; }
  .ps-container > .ps-scrollbar-x-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    opacity: 0;
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    bottom: 3px;
    /* there must be 'bottom' for ps-scrollbar-x-rail */
    height: 8px; }
  .ps-container > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    position: absolute;
    /* please don't change 'position' */
    background-color: #aaa;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-transition: background-color .2s linear;
    -moz-transition: background-color .2s linear;
    -o-transition: background-color .2s linear;
    transition: background-color .2s linear;
    bottom: 0;
    /* there must be 'bottom' for ps-scrollbar-x */
    height: 8px; }
  .ps-container > .ps-scrollbar-y-rail {
    display: none;
    position: absolute;
    /* please don't change 'position' */
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    opacity: 0;
    -webkit-transition: background-color .2s linear, opacity .2s linear;
    -moz-transition: background-color .2s linear, opacity .2s linear;
    -o-transition: background-color .2s linear, opacity .2s linear;
    transition: background-color .2s linear, opacity .2s linear;
    right: 3px;
    /* there must be 'right' for ps-scrollbar-y-rail */
    width: 8px; }
  .ps-container > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    position: absolute;
    /* please don't change 'position' */
    background-color: #aaa;
    -webkit-border-radius: 4px;
    -moz-border-radius: 4px;
    border-radius: 4px;
    -webkit-transition: background-color .2s linear;
    -moz-transition: background-color .2s linear;
    -o-transition: background-color .2s linear;
    transition: background-color .2s linear;
    right: 0;
    /* there must be 'right' for ps-scrollbar-y */
    width: 8px; }
  .ps-container:hover.ps-in-scrolling {
    pointer-events: none; }
  .ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container:hover.ps-in-scrolling.ps-x > .ps-scrollbar-x-rail > .ps-scrollbar-x {
    background-color: #999; }
  .ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container:hover.ps-in-scrolling.ps-y > .ps-scrollbar-y-rail > .ps-scrollbar-y {
    background-color: #999; }
  .ps-container:hover > .ps-scrollbar-x-rail,
  .ps-container:hover > .ps-scrollbar-y-rail {
    opacity: 0.6; }
  .ps-container:hover > .ps-scrollbar-x-rail:hover {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container:hover > .ps-scrollbar-x-rail:hover > .ps-scrollbar-x {
    background-color: #999; }
  .ps-container:hover > .ps-scrollbar-y-rail:hover {
    background-color: #eee;
    opacity: 0.9; }
  .ps-container:hover > .ps-scrollbar-y-rail:hover > .ps-scrollbar-y {
    background-color: #999; }


</style>
