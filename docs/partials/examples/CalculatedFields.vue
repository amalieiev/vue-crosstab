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
  import data from 'data/seattle-weather-lite.json'

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
        cols: [
          {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
          {field: 'weather', label: 'Weather'},
          {aggregate: 'count'}
        ],
        rows: [
          {field: 'season', label: 'Season'},
          {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'}
        ]
      }
    }
  }
</script>
