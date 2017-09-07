<template lang="pug">
div
  label.typo__label Basic Crosstab
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows"
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
      cols: [
        {field: 'sex'},
        {field: 'smoker'},
        {field: 'total_bill', aggregate: 'sum', formatter: 'currency'}
      ],
      rows: [
        {field: 'day'},
        {field: 'time'}
      ]
    }
  }
}
</script>
