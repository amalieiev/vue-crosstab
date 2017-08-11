<template lang="pug">
div
  label.typo__label Cols Only
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      aggregator="count",
      :width="380"
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
      cols: ['sex', 'smoker']
    }
  }
}
</script>
