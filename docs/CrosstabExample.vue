<template>
  <crosstab
    :data="data"
    :rows="rows"
    :cols="cols"
    aggregator="sum"
    measure="total_bill"
    :width="600"
    :height="200"
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
      rows: ['sex', 'smoker'],
      cols: ['time', 'day'],
    }
  }
}
</script>

<style lang="sass">

</style>
