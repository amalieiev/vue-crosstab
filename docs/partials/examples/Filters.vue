<template lang="pug">
div
  label.typo__label Filters
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
          {filter: 'weather', equals: 'sun'},
          {filter: 'date_year', isGreaterThan: 2012}
        ],
        cols: [
          {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
          {field: 'weather', label: 'Weather', aggregate: 'count'}
        ],
        rows: [
          {field: 'date', type: 'temporal', timeUnit: 'month', label: 'Month'}
        ]
      }
    }
  }
</script>
