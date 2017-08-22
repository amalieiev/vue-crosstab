<template lang="pug">
    div
        div
            label.typo__label Natural scroll direction
            div.overflow-auto
                crosstab(
                :data="data",
                :rows="rows",
                :cols="cols",
                :scrollReverse="false"
                measure="tip",
                aggregator="avg",
                height="300")
        div
            label.typo__label Reversed scroll direction (default)
            div.overflow-auto
                crosstab(
                :data="data",
                :rows="rows",
                :cols="cols",
                measure="tip",
                aggregator="avg",
                height="300")
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
        rows: [{field: 'day'}, {field: 'time'}],
        cols: [{field: 'sex'}, {field: 'smoker'}]
      }
    }
  }
</script>
