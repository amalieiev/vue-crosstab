<template lang="pug">
div
  label.typo__label Data types
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows"
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
