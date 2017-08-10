<template lang="pug">
div
  label.typo__label Basic Crosstab
  div.overflow-auto
    crosstab(
      :data="data",
      :rows="rows",
      :width="380",
      measure="tip",
      aggregator="sum"
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
      rows: ['sex', 'smoker']
    }
  }
}
</script>
