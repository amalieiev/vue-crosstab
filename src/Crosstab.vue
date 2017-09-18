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
                v-for="item in partialData"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="getRectStyle(item)"
                @click="onCellClick($event, item)"
                @touchstart="onCellClick($event, item)"
        ></rect>
        <rect
                v-if="bars"
                v-for="item in partialData"
                :height="item.height / 4"
                :width="item.width * (item.value / maxValue)"
                :x="item.x"
                :y="item.y"
                :fill="item.value ? Theme.valueToColor(item.value, maxValue) : 'none'"
                @click="onCellClick($event, item)"
                @touchstart="onCellClick($event, item)"
        ></rect>
        <text
                v-for="item in partialData"
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
        <foreignObject
                v-for="item in colItems"
                :key="item.x + '_' + item.y"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.textStyle"
        ><div :title="item.text" :style="{
                     textAlign: 'center',
                     color: Theme.headerText,
                     overflow: 'hidden',
                     lineHeight: cellHeight + 'px',
                     userSelect: 'none',
                     padding: '0 5px',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap'
                  }">{{ item.text }}</div>
        </foreignObject>
        <!--<text-->
                <!--v-for="item in colItems"-->
                <!--:height="item.height"-->
                <!--:width="item.width"-->
                <!--:x="item.x"-->
                <!--:y="item.y"-->
                <!--:dy="item.height / 2 + calculatedFontSize / 2"-->
                <!--:dx="item.width / 2"-->
                <!--text-anchor="middle"-->
                <!--:style="item.textStyle"-->
        <!--&gt;{{ item.text }}-->
        <!--</text>-->
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
        <foreignObject
                v-for="item in rowItems"
                :key="item.x + '_' + item.y"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.textStyle"
          ><div :title="item.text" :style="{
                     textAlign: 'center',
                     color: Theme.headerText,
                     overflow: 'hidden',
                     lineHeight: cellHeight + 'px',
                     userSelect: 'none',
                     padding: '0 5px',
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap'
                  }">{{ item.text }}</div>
        </foreignObject>
        <!--<text-->
                <!--v-for="item in rowItems"-->
                <!--:height="item.height"-->
                <!--:width="item.width"-->
                <!--:x="item.x"-->
                <!--:y="item.y"-->
                <!--:dy="cellHeight / 2 + calculatedFontSize / 2"-->
                <!--:dx="item.width / 2"-->
                <!--text-anchor="middle"-->
                <!--:style="item.textStyle"-->
        <!--&gt;{{ item.text }}-->
        <!--</text>-->
      </g>
      <g>
        <rect :height="cornerHeight" :width="cornerWidth" :style="`fill:${Theme.bodyPrimary};stroke:${Theme.headerBorder}`"></rect>
        <rect
                v-for="item in cornerItems"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.rectStyle"
        ></rect>
        <foreignObject
                v-for="item in cornerItems"
                :key="item.x + '_' + item.y"
                :height="item.height"
                :width="item.width"
                :x="item.x"
                :y="item.y"
                :style="item.textStyle"
        ><div :title="item.text" :style="{
                     textAlign: item.textStyle.textAlign,
                     color: item.textStyle.fill,
                     overflow: 'hidden',
                     lineHeight: cellHeight + 'px',
                     userSelect: 'none',
                     padding: item.textStyle.padding,
                     textOverflow: 'ellipsis',
                     whiteSpace: 'nowrap'
                  }">{{ item.text }}</div>
        </foreignObject>
        <!--<text-->
                <!--v-for="item in cornerItems"-->
                <!--:height="item.height"-->
                <!--:width="item.width"-->
                <!--:x="item.x"-->
                <!--:y="item.y"-->
                <!--:dy="item.height / 2 + calculatedFontSize / 2"-->
                <!--:dx="item.textStyle.dx"-->
                <!--:text-anchor="item.textStyle.textAnchor"-->
                <!--:style="item.textStyle"-->
        <!--&gt;{{ item.text }}-->
        <!--</text>-->
      </g>
      <rect
              :height="calculatedHeight"
              :width="calculatedWidth"
              fill="none"
              :stroke="Theme.headerBorder"
      ></rect>
    </scrollbar>
  </svg>
</template>

<script>
  /* eslint-disable no-eval */
  import _ from 'underscore'
  import { aggregators, formatters, csvJSON, temporalMixin } from './utils'
  import Scrollbar from './Scrollbar.vue'
  import Theme from './Theme'

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
        parentNodeWidth: Infinity,
        tmpMaxValue: -Infinity,
        maxValue: -Infinity,

        // partial rendering
        nextPointX: 0,
        nextPointY: 0,
        previousPointX: 0,
        previousPointY: 0,
        partialScale: 1,
        partialData: []
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
      bars: {
        type: Boolean,
        default: false
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
      theme: {
        type: Object,
        default: () => {
          return {
            name: 'Teal'
          }
        }
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
      this.parentNodeHeight = Math.floor(this.$el.parentNode.clientHeight)
      this.parentNodeWidth = Math.floor(this.$el.parentNode.clientWidth - 1)

      this.updatePartialRendering()
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
            datum[calculation.calculate] = calculation.value(datum)
          })
        })

        filters.forEach(filter => {
          data = data.filter(datum => {
            if (filter.equals) {
              return datum[filter.filter] === filter.equals
            }
            if (filter.isNotEqualTo) {
              return datum[filter.filter] !== filter.isNotEqualTo
            }
            if (filter.isOneOf) {
              return _.contains(filter.isOneOf, datum[filter.filter])
            }
            if (filter.isNotOneOf) {
              return !_.contains(filter.isNotOneOf, datum[filter.filter])
            }
            if (filter.isGreaterThan) {
              return datum[filter.filter] > filter.isGreaterThan
            }
            if (filter.isSmallerThan) {
              return datum[filter.filter] < filter.isGreaterThan
            }
            if (filter.contains) {
              return datum[filter.filter].toLowerCase().indexOf(filter.contains.toLowerCase()) !== -1
            }
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
                fill: this.Theme.headerText,
                dx: this.cellWidth / 2,
                'text-anchor': 'middle',
                textAlign: 'center',
                padding: '0 5px'
              },
              rectStyle: {
                fill: this.Theme.palette[0],
                stroke: this.Theme.cornerBorder
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
                fill: this.Theme.bodyText,
                dx: (this.cellWidth * this.rows.length) - this.cellWidth / 4,
                'text-anchor': 'end',
                textAlign: 'right',
                padding: '0 10px'
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
                fill: this.Theme.bodyText,
                dx: this.cellWidth - this.cellWidth / 4,
                'text-anchor': 'end',
                textAlign: 'right',
                padding: '0 10px'
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
                fill: this.Theme.headerText,
                dx: this.cellWidth / 2,
                'text-anchor': 'middle',
                textAlign: 'center'
              },
              rectStyle: {
                fill: this.Theme.palette[0],
                stroke: this.Theme.cornerBorder
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
                fill: this.Theme.headerText
              },
              rectStyle: {
                fill: this.Theme.bodySecondary,
                stroke: this.Theme.bodyBorder
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
                fill: this.Theme.headerText
              },
              rectStyle: {
                fill: this.Theme.palette[0],
                stroke: this.Theme.headerBorder
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
              fill: this.Theme.headerText,
              fontWeight: 'bold'
            },
            rectStyle: {
              fill: this.Theme.palette[0],
              stroke: this.Theme.headerBorder
            }
          }]
        }
      },

      aggregatedData () {
        if (!this.transformedData.length) return []

        let rowItems = flat(this.groupedRows)
        let colItems = flat(this.groupedCols)
        let result = []
        let aggregationInRows = this.rows.find(item => item.aggregate)
        let aggregatedData = aggregationInRows ? aggregateBy(this.transformedData, this.cols.concat(this.rows)) : aggregateBy(this.transformedData, this.rows.concat(this.cols))
        let maxAggregation = aggregationInRows ? getMaxAggregation(this.transformedData, this.cols.concat(this.rows)) : getMaxAggregation(this.transformedData, this.rows.concat(this.cols))

        this.maxValue = maxAggregation.value

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
              text: value && value.formattedAggregation,
              value: value ? value.aggregation : 0,
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
      Theme () {
        return Theme({name: this.theme.name})
      },
      calculatedWidth () {
        let fullWidth = this.cellWidth * (this.rows.length + count(this.groupedCols) + (this.hasNothing || this.hasColsOnly ? 1 : 0))

        if (this.width) {
          if (/%$/.test(this.width)) {
            return this.parentNodeWidth * Number.parseInt(this.width) / 100
          }
          return +this.width > fullWidth ? fullWidth : +this.width
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
          return +this.height > fullHeight ? fullHeight : +this.height
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

        if (this.dragX < this.nextPointX || this.dragX > this.previousPointX) {
          this.updatePartialRendering()
        }
      },

      onDragY (value) {
        this.dragY = value

        if (this.dragY < this.nextPointY || this.dragY > this.previousPointY) {
          this.updatePartialRendering()
        }
      },

      onCellClick (evt, item) {},

      getTextStyle (item) {
        return {
          fontSize: this.calculatedFontSize,
          fill: this.Theme.bodyText
        }
      },

      getRectStyle (item) {
        return {
          fill: item.isOddRow ? this.Theme.bodyPrimary : this.Theme.bodySecondary,
          stroke: this.Theme.bodyBorder,
          strokeOpacity: 0.5
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
              fill: this.Theme.headerText
            },
            rectStyle: {
              fill: this.Theme.palette[item.y] || this.Theme.palette[6],
              stroke: this.Theme.palette[item.y + 1]
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
              fill: this.Theme.headerText
            },
            rectStyle: {
              fill: this.Theme.palette[item.x] || this.Theme.palette[6],
              stroke: this.Theme.palette[item.x + 1]
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
                this.values = csvJSON(xmlhttp.responseText)
              }
              this.updatePartialRendering()
            }
          }
        }
        xmlhttp.send(null)
      },

      updatePartialRendering () {
        let visibleDataHeight = this.calculatedHeight - this.cornerHeight
        let visibleDataWidth = this.calculatedWidth - this.cornerWidth

        this.nextPointX = this.dragX - visibleDataWidth * (this.partialScale - 1)
        this.nextPointY = this.dragY - visibleDataHeight * (this.partialScale - 1)
        this.previousPointX = this.dragX + visibleDataWidth * this.partialScale
        this.previousPointY = this.dragY + visibleDataHeight * this.partialScale

        let partialData = this.aggregatedData.filter(item => {
          return item.x >= -this.cellWidth - this.previousPointX &&
            item.x <= (visibleDataWidth - this.nextPointX) &&
            item.y >= -this.cellHeight - this.previousPointY &&
            item.y <= (visibleDataHeight - this.nextPointY)
        })

        this.partialData = partialData
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
        tmp.formattedAggregation = data.length
      }

      return tmp
    } else {
      if (items[levelIdx].aggregate && items[levelIdx].aggregate === 'count') {
        return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
          let formatter = formatters[items[levelIdx].formatter] || items[levelIdx].formatter
          let aggregation = aggregators[items[levelIdx].aggregate](value, items[levelIdx].field)

          return {
            name: key,
            aggregation: aggregation,
            formattedAggregation: formatter ? formatter(aggregation) : aggregation
          }
        })
      }
      if (items[levelIdx].aggregate) {
        let aggregation = aggregators[items[levelIdx].aggregate](data, items[levelIdx].field)
        let formatter = formatters[items[levelIdx].formatter] || items[levelIdx].formatter

        return [{
          name: items[levelIdx].aggregate,
          aggregation: aggregation,
          formattedAggregation: formatter ? formatter(aggregation) : aggregation
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

  function getMaxAggregation (data, items, levelIdx, result) {
    if (result === undefined) result = {value: -Infinity}
    if (levelIdx === undefined) {
      levelIdx = 0

      if (items.length) {
        getMaxAggregation(data, items, levelIdx, result)
      } else {
        result.value = data.length
      }

      return result
    } else {
      if (items[levelIdx].aggregate && items[levelIdx].aggregate === 'count') {
        return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
          let aggregation = aggregators[items[levelIdx].aggregate](value, items[levelIdx].field)

          if (result.value < aggregation) result.value = aggregation
        })
      }
      if (items[levelIdx].aggregate) {
        let aggregation = aggregators[items[levelIdx].aggregate](data, items[levelIdx].field)

        if (result.value < aggregation) result.value = aggregation
      }
      return _.map(_.groupBy(data, getFieldLabel(items[levelIdx])), function (value, key) {
        if (items.length > levelIdx + 1) {
          getMaxAggregation(value, items, levelIdx + 1, result)
        }
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
      return label || item.field.concat('_', item.timeUnit)
    }

    return label || item.field
  }

  function getValue (aggregation, values) {
    let result = findWhere(aggregation, values)

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
