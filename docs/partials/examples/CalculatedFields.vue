<template lang="pug">
div
  label.typo__label Calculated fields
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows",
      :transform="transform"
    )
</template>

<script>
  import Crosstab from 'vue-crosstab'
  import _ from 'underscore'
  import data from 'data/seattle-weather-lite.json'

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
        cols: [
          {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
          {field: 'weather', label: 'Weather', aggregate: 'count'}
        ],
        rows: [
          {field: 'season', label: 'Season'},
          {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'}
        ]
      }
    }
  }
</script>
