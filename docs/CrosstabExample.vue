<template>
  <crosstab
    :data="data"
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
      rows: [
        {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
        {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'}
      ],
      cols: [
        {field: 'date', type: 'temporal', timeUnit: 'day', label: 'Day'},
        {field: 'weather', label: 'Weather'},
        {field: 'wind', aggregate: 'avg', label: 'Wind'}
      ]
    }
  }
}
</script>

<style lang="scss">

</style>
