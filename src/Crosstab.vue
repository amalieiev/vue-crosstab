<template>
  <div class="container" :style="{height: calculatedHeight+'px', width: calculatedWidth+'px'}">
    <div class="corner" :style="{width: `${rows.length * cellWidth}px`, height: `${cols.length * cellHeight}px`}">

    </div>
    <div class="cols" :style="colHeaderStyle">
      <svg :height="cols.length * cellHeight" :width="calculatedColumnsWidth" :style="{transform: `translateX(${-scrollLeft}px)`}">
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
      <svg :height="calculatedRowsHeight" :style="{transform: `translateY(${-scrollTop}px)`}">
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
        type: Number,
        default: 80
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
          return aggregators[this.aggregator] ? aggregators[this.aggregator](items, this.measure) : null
        }
      },
      colItems () {
        if (!this.data.length) return

        return getColItems(setColPosition(aggregateBy(this.data, this.cols, this.aggregatorFn)), this.cellHeight, this.cellWidth)
      },
      rowItems () {
        if (!this.data.length) return

        return getRowItems(setRowPosition(aggregateBy(this.data, this.rows, this.aggregatorFn)), this.cellHeight, this.cellWidth)
      },
      aggregatedData () {
        if (!this.data.length) return

        return generateData(this.data, this.rows, this.cols, this.aggregatorFn, this.cellHeight, this.cellWidth)
      },
      colHeaderStyle () {
        return `height: ${this.cellHeight * this.cols.length}px; width: ${this.calculatedColumnsContainerWidth}px;`
      },
      rowHeaderStyle () {
        return `width: ${this.rows.length * this.cellWidth}px; height: ${this.height - this.cols.length * this.cellHeight}px`
      },
      dataStyle () {
        return `width: ${this.calculatedColumnsContainerWidth}px; height: ${this.height - this.cols.length * this.cellHeight}px;`
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
        return this.cellWidth * (this.rows.length + count(aggregateBy(this.data, this.cols, this.aggregatorFn)))
      },
      calculatedHeight () {
        if (this.height) {
          return this.height
        }
        return this.cellHeight * (this.cols.length + count(aggregateBy(this.data, this.rows, this.aggregatorFn)))
      },
      calculatedColumnsWidth () {
        return count(aggregateBy(this.data, this.cols, this.aggregatorFn)) * this.cellWidth
      },
      calculatedRowsHeight () {
        return count(aggregateBy(this.data, this.rows, this.aggregatorFn)) * this.cellHeight
      },
      calculatedColumnsContainerWidth () {
        return this.width - this.rows.length * this.cellWidth
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
