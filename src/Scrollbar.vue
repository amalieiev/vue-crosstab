<template>
    <g
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
        <rect
            class="x-scrollbar"
            :x="viewportX"
            :y="viewportY + viewportHeight - 6"
            :width="xScrollbarWidth"
            height=5 fill="gray"
            rx="3"
            ry="3"
            :style="xScrollbarStyle"
            v-if="isXScrollbarRequired"
            @mousedown="mousedown"
        ></rect>
        <rect
            class="y-scrollbar"
            :x="viewportX + viewportWidth - 6"
            :y="viewportY"
            width="5"
            :height="yScrollbarHeight"
            fill="gray"
            fill-opacity=".3"
            rx="3"
            ry="3"
            :style="yScrollbarStyle"
            v-if="isYScrollbarRequired"
            @mousedown="mousedown"
        ></rect>
    </g>
</template>

<script>
  export default {
    name: 'scrollbar',

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
    mounted () {
      this.applyStyles()
    },
    computed: {
      xScrollbarWidth () {
        return (this.viewportWidth / this.contentWidth) * this.viewportWidth
      },
      yScrollbarHeight () {
        return (this.viewportHeight / this.contentHeight) * this.viewportHeight
      },
      xScrollbarStyle () {
        return {
          transform: `translateX(${-(this.currentX + this.deltaX) * this.xScale}px)`
        }
      },
      yScrollbarStyle () {
        return {
          transform: `translateY(${-(this.currentY + this.deltaY) * this.yScale}px)`
        }
      },
      isXScrollbarRequired () {
        return this.viewportWidth < this.contentWidth
      },
      isYScrollbarRequired () {
        return this.viewportHeight < this.contentHeight
      },
      xScale () {
        return this.viewportWidth / this.contentWidth
      },
      yScale () {
        return this.viewportHeight / this.contentHeight
      }
    },
    methods: {
      select (evt, useScrollBar) {
        this.selected = true
        this.useScrollBar = useScrollBar

        this.deltaX = 0
        this.deltaY = 0
        this.fromX = evt.clientX
        this.fromY = evt.clientY
      },

      move (evt, scrollReverse) {
        if (this.selected) {
          let deltaX = scrollReverse ? this.fromX - evt.clientX : evt.clientX - this.fromX
          let deltaY = scrollReverse ? this.fromY - evt.clientY : evt.clientY - this.fromY

          if (this.useScrollBar) {
            deltaX *= this.contentWidth / this.viewportWidth
            deltaY *= this.contentHeight / this.viewportHeight
          }

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
        this.useScrollBar = false

        this.currentX = this.currentX + this.deltaX
        this.currentY = this.currentY + this.deltaY

        this.deltaX = 0
        this.deltaY = 0
        this.fromX = 0
        this.fromY = 0
      },

      mousedown (evt) {
        this.select(evt, true)
      },

      mousemove (evt) {
        this.move(evt, true)
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
      },

      applyStyles () {
        let styleEl = document.createElement('style')
        styleEl.innerHTML = styles
        document.body.appendChild(styleEl)
      }
    }
  }

  const styles = `
    svg text {
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
        user-select: none;
    }
    svg text::selection {
        background: none;
    }
    .x-scrollbar,
    .y-scrollbar {
        transition: fill-opacity .5s;
        fill-opacity: .3;
    }
    .x-scrollbar:hover,
    .y-scrollbar:hover {
        fill-opacity: .7;
    }
  `
</script>
