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
import data from '../docs/data/seattle-weather-lite.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      transform: [
        {calculate: `datum.season = datum.month_date === "December" ||
                                      datum.month_date === "January" ||
                                      datum.month_date === "February" ? 'Winter' :
                                      datum.month_date === "March" ||
                                      datum.month_date === "April" ||
                                      datum.month_date === "May" ? 'Spring' :
                                      datum.month_date === "June" ||
                                      datum.month_date === "July" ||
                                      datum.month_date === "August" ? 'Summer' : 'Autumn'`}
      ],
      rows: [
        {field: 'season', label: 'Season'},
        {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'}
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
