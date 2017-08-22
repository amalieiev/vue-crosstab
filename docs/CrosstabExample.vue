<template>
  <crosstab
    :data="data"
    :rows="rows"
    :cols="cols"
    aggregator="count"
    height="200"
  ></crosstab>
</template>

<script>
import Crosstab from '../src/Crosstab.vue'
import data from '../docs/data/people.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      cols: [],
      rows: ['sex', 'day', 'time']
    }
  }
}
</script>

<style lang="sass">

</style>
