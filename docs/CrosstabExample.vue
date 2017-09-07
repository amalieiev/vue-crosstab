<template>
  <crosstab
    :data="data"
    :rows="rows"
    :cols="cols"
    :transform="transform"
    height="200"
  ></crosstab>
</template>

<script>
import Crosstab from '../src/Crosstab.vue'
import _ from 'underscore'
import data from '../docs/data/seattle-weather-lite.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      transform: [
        {
          calculate: 'season',
          value: record => {
            return _.contains(['December', 'January', 'February'], record.date_month) ? 'Winter' :
                   _.contains(['March', 'April', 'May'], record.date_month) ? 'Spring' :
                   _.contains(['June', 'July', 'August'], record.date_month) ? 'Summer' : 'Autumn'
          }
        }
      ],
      rows: [
        {field: 'season', label: 'Season'},
        {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'},
        {field: 'date', type: 'temporal', timeUnit: 'day', label: 'Day'}
      ],
      cols: [
        {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
        {field: 'weather', label: 'Weather', aggregate: 'count'}
      ]
    }
  }
}
</script>

<style lang="scss">
  #app .start .typo__h1 {
    padding-top: 0;
  }
</style>
