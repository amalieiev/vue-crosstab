<template>
  <crosstab
    :data="data"
    :transform="transform"
    :rows="rows"
    :cols="cols"
    height="200"
  ></crosstab>
</template>

<script>
import Crosstab from '../src/Crosstab.vue'
import data from '../docs/data/seattle-weather-lite.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      cols: [{field: 'year'}],
      rows: [{field: 'weather'}],
      transform: [
        {calculate: 'datum.year = new Date(datum.date).getFullYear()'}
      ]
    }
  }
}
</script>

<style lang="scss">

</style>
