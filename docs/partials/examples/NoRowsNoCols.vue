<template lang="pug">
div
  label.typo__label No rows and now cols
  div.overflow-auto
    crosstab(
      :data="data",
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
      data
    }
  }
}
</script>
