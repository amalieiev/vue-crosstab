<template lang="pug">
div
  label.typo__label Rows Only
  div.overflow-auto
    crosstab(
      :data="data",
      :rows="rows",
      :cellWidth="80"
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
        {field: 'smoker'},
        {field: 'total_bill', aggregate: 'sum'}
      ]
    }
  }
}
</script>
