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
        {field: 'date', type: 'temporal', timeUnit: 'year'},
        {field: 'date', type: 'temporal', timeUnit: 'quarter'},
        {field: '', aggregate: 'count'}
      ],
      cols: [
        {field: 'date', type: 'temporal', timeUnit: 'day'},
        {field: 'weather'}
      ]
    }
  }
}
</script>

<style lang="scss">

</style>
