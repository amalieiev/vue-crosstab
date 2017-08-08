<template lang="pug">
div
  label.typo__label Basic Crosstab
  div.overflow-auto
    crosstab(
      :data="data",
      :rows="rows",
      :cols="cols",
      aggregator="count",
      :cellWidth="75",
      :cellHeight="75",
      :fontSize="20"
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
      rows: ['sex', 'smoker'],
      cols: ['time']
    }
  }
}
</script>
