<template>
    <g @mousedown="select" @mousemove="move" @mouseup="deselect" @mouseleave="deselect">
        <slot></slot>
        <rect :x="mapX" :y="mapY" fill="gray" fill-opacity=".5" :width="mapWidth" :height="mapHeight"></rect>
        <rect :x="mapX" :y="mapY" fill="white" fill-opacity=".5" :width="mapViewportWidth" :height="mapViewportHeight" :style="mapViewportStyle"></rect>
    </g>
</template>

<script>
  export default {
    name: 'minimap',

    props: {
      viewportHeight: {
        type: Number,
        default: 0
      },
      viewportWidth: {
        type: Number,
        default: 0
      },
      viewportX: {
        type: Number,
        default: 0
      },
      viewportY: {
        type: Number,
        default: 0
      },
      contentHeight: {
        type: Number,
        default: 0
      },
      contentWidth: {
        type: Number,
        default: 0
      },
      mapMaxHeight: {
        type: Number,
        default: 50
      },
      mapMaxWidth: {
        type: Number,
        default: 50
      },
      mapIndentation: {
        type: Number,
        default: 3
      }
    },

    data () {
      return {
        selected: false,
        currentX: 0,
        currentY: 0,
        fromX: 0,
        fromY: 0,
        toX: 0,
        toY: 0
      }
    },
    computed: {
      mapHeight () {
        if (this.contentHeight > this.contentWidth) {
          return this.mapMaxHeight
        } else {
          return this.contentHeight * this.mapMaxWidth / this.contentWidth
        }
      },
      mapWidth () {
        if (this.contentHeight < this.contentWidth) {
          return this.mapMaxWidth
        } else {
          return this.contentWidth * this.mapMaxHeight / this.contentHeight
        }
      },
      mapY () {
        return this.viewportHeight + this.viewportY - this.mapHeight - this.mapIndentation
      },
      mapX () {
        return this.viewportWidth + this.viewportX - this.mapWidth - this.mapIndentation
      },
      mapViewportWidth () {
        return this.mapWidth / this.contentWidth * this.viewportWidth
      },
      mapViewportHeight () {
        return this.mapHeight / this.contentHeight * this.viewportHeight
      },
      scale () {
        return this.mapWidth / this.contentWidth
      },
      mapViewportStyle () {
        let x = -(this.currentX + this.toX - this.fromX) * this.scale
        let y = -(this.currentY + this.toY - this.fromY) * this.scale
        return {
          transform: `translateX(${x}px) translateY(${y}px)`
        }
      }
    },
    methods: {
      select (evt) {
        this.selected = true
        this.currentX = this.currentX + this.toX - this.fromX
        this.currentY = this.currentY + this.toY - this.fromY
        this.fromX = evt.clientX
        this.fromY = evt.clientY
        this.toX = evt.clientX
        this.toY = evt.clientY
      },
      move (evt) {
        if (this.selected) {
          let clientX = evt.clientX
          let clientY = evt.clientY

          if (this.currentX + clientX - this.fromX > 0) clientX = this.fromX - this.currentX
          if (this.currentX + clientX - this.fromX < this.viewportWidth - this.contentWidth) clientX = this.viewportWidth + this.fromX - this.currentX - this.contentWidth
          if (this.currentY + clientY - this.fromY > 0) clientY = this.fromY - this.currentY
          if (this.currentY + clientY - this.fromY < this.viewportHeight - this.contentHeight) clientY = this.viewportHeight + this.fromY - this.currentY - this.contentHeight

          this.toX = clientX
          this.toY = clientY

          this.$emit('dragX', this.currentX + this.toX - this.fromX)
          this.$emit('dragY', this.currentY + this.toY - this.fromY)
        }
      },
      deselect () {
        this.selected = false
      }
    }
  }
</script>

<style scoped>
    svg text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    svg text::selection {
        background: none;
    }
</style>
