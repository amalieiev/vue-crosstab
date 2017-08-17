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
      },
      scrollReverse: {
        type: Boolean,
        default: true
      }
    },

    data () {
      return {
        selected: false,
        currentX: 0,
        currentY: 0,
        fromX: 0,
        fromY: 0,
        deltaX: 0,
        deltaY: 0
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
        let x = -(this.currentX + this.deltaX) * this.scale
        let y = -(this.currentY + this.deltaY) * this.scale
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

        this.deltaX = 0
        this.deltaY = 0
        this.fromX = evt.clientX
        this.fromY = evt.clientY
      },

      move (evt, scrollReverse) {
        if (this.selected) {
          let deltaX = scrollReverse ? this.fromX - evt.clientX : evt.clientX - this.fromX
          let deltaY = scrollReverse ? this.fromY - evt.clientY : evt.clientY - this.fromY

          if (this.currentX + deltaX > 0) deltaX = -this.currentX
          if (this.currentX + deltaX < this.viewportWidth - this.contentWidth) deltaX = this.viewportWidth - this.contentWidth - this.currentX
          if (this.currentY + deltaY > 0) deltaY = -this.currentY
          if (this.currentY + deltaY < this.viewportHeight - this.contentHeight) deltaY = this.viewportHeight - this.contentHeight - this.currentY

          this.$emit('dragX', this.currentX + deltaX)
          this.$emit('dragY', this.currentY + deltaY)

          this.deltaX = deltaX
          this.deltaY = deltaY
        }
      },

      deselect () {
        this.selected = false

        this.currentX = this.currentX + this.deltaX
        this.currentY = this.currentY + this.deltaY

        this.deltaX = 0
        this.deltaY = 0
        this.fromX = 0
        this.fromY = 0
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
        this.move(evt.touches[0], this.scrollReverse)
      },

      touchend (evt) {
        this.deselect(evt.touches[0])
      },

      mousewheel (evt) {
        let deltaX = this.scrollReverse ? -evt.deltaX : evt.deltaX
        let deltaY = this.scrollReverse ? -evt.deltaY : evt.deltaY

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
