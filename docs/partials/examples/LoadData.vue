<template lang="pug">
div
  label.typo__label Load data
  div.overflow-auto
    crosstab(
      :dataUrl="dataUrl",
      :cols="cols",
      :rows="rows",
      height="200"
    )
</template>

<script>
  import Crosstab from 'vue-crosstab'

  export default {
    components: {
      Crosstab
    },
    data () {
      return {
        dataUrl: 'static/data/seattle-weather-lite.json',
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
