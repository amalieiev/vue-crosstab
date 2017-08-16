<template>
    <g
            @mousedown="mousedown"
            @mousemove="mousemove"
            @mouseup="mouseup"
            @mouseleave="mouseleave"
            @touchstart.prevent="touchstart"
            @touchmove.prevent="touchmove"
            @touchend.prevent="touchend"
            @mousewheel.prevent="mousewheel"
            @DOMMouseScroll.prevent="mousewheel"
    >
        <slot></slot>
        <rect :x="mapX" :y="mapY" fill="gray" fill-opacity=".5" :width="mapWidth" :height="mapHeight" v-if="isRequired"></rect>
        <rect :x="mapX" :y="mapY" fill="white" fill-opacity=".5" :width="mapViewportWidth" :height="mapViewportHeight" :style="mapViewportStyle" v-if="isRequired"></rect>
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
        return this.mapIndentation
      },
      mapX () {
        return this.mapIndentation
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
      },
      isRequired () {
        return this.viewportHeight < this.contentHeight || this.viewportWidth < this.contentWidth
      }
    },
    methods: {
      select (evt) {
        this.selected = true

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

        this.currentX = this.currentX + this.toX - this.fromX
        this.currentY = this.currentY + this.toY - this.fromY

        this.fromX = this.toX
        this.fromY = this.toY
      },

      mousedown (evt) {
        this.select(evt)
      },

      mousemove (evt) {
        this.move(evt)
      },

      mouseup (evt) {
        this.deselect(evt)
      },

      mouseleave (evt) {
        this.deselect(evt)
      },

      touchstart (evt) {
        this.select(evt.touches[0])
      },

      touchmove (evt) {
        this.move(evt.touches[0])
      },

      touchend (evt) {
        this.deselect(evt.touches[0])
      },

      mousewheel (evt) {
        let deltaX = evt.deltaX
        let deltaY = evt.deltaY

        if (this.currentX + deltaX > 0) deltaX = -this.currentX
        if (this.currentX + deltaX < this.viewportWidth - this.contentWidth) deltaX = this.viewportWidth - this.contentWidth - this.currentX
        if (this.currentY + deltaY > 0) deltaY = -this.currentY
        if (this.currentY + deltaY < this.viewportHeight - this.contentHeight) deltaY = this.viewportHeight - this.contentHeight - this.currentY

        this.$emit('dragX', this.currentX + deltaX)
        this.$emit('dragY', this.currentY + deltaY)
        this.currentX = this.currentX + deltaX
        this.currentY = this.currentY + deltaY
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
