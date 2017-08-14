<template lang="pug">
div
  label.typo__label Custom Theme
  div.overflow-auto
    crosstab(
      :data="data",
      :rows="rows",
      :cols="cols",
      measure="tip",
      aggregator="avg",
      :width="380",
      :palette="palette"
    )
</template>

<script>
import Crosstab from 'vue-crosstab'
import data from 'data/people.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      rows: ['day', 'time'],
      cols: ['sex', 'smoker'],
      palette: {
        primary: '#edc68a',
        secondary: '#edb118',
        background: 'orange',
        border: '#e07b21',
        text: 'white'
      }
    }
  }
}
</script>
