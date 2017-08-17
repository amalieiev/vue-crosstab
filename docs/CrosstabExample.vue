<template>
  <crosstab
    :data="data"
    :rows="rows"
    :cols="cols"
    aggregator="sum"
    measure="total_bill"
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
      cols: ['sex', 'smoker'],
      rows: ['time', 'day']
    }
  }
}
</script>

<style lang="sass">

</style>
