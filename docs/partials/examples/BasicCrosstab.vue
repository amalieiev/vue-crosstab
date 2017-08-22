<template lang="pug">
div
  label.typo__label Basic Crosstab
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows",
      aggregator="sum",
      measure="total_bill"
    )
</template>

<script>
import Crosstab from 'vue-crosstab'
import data from 'data/people.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      cols: [{field: 'sex'}, {field: 'smoker'}],
      rows: [{field: 'day'}, {field: 'time'}]
    }
  }
}
</script>
