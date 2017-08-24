<template lang="pug">
div
  label.typo__label Basic Crosstab
  div.overflow-auto
    crosstab(
      :data="data",
      :rows="rows",
      :cols="cols",
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
      rows: [
        {field: 'sex'},
        {field: 'smoker'}
      ],
      cols: [
        {field: 'time'},
        {field: 'total_bill', aggregate: 'sum'}
      ]
    }
  }
}
</script>
