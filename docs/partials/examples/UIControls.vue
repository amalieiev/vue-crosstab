<template lang="pug">
    div
        label.typo__label Cols:
        multiselect(v-model="cols", :options="fields", :multiple="true")
        label.typo__label Rows:
        multiselect(v-model="rows", :options="fields", :multiple="true")
        label.typo__label Measure:
        multiselect(v-model="measure", :options="measures")
        label.typo__label Aggregator:
        multiselect(v-model="aggregator", :options="aggregators")
        br
        crosstab(
          :data="data",
          :rows="rows",
          :cols="cols",
          :aggregator="aggregator",
          :measure="measure",
          :cellWidth="60",
          :fontSize="10",
          height="300")
</template>

<script>
import Crosstab from 'vue-crosstab'
import data from 'data/people.json'
import Multiselect from 'vue-multiselect'
import _ from 'underscore'

export default {
  components: {
    Crosstab,
    Multiselect
  },
  data () {
    return {
      data,
      measure: 'tip',
      aggregator: 'count',
      cols: ['sex', 'smoker'],
      rows: ['time', 'day']
    }
  },
  computed: {
    fields () {
      return _.reduce(this.data[0], (memo, value, key) => {
        if (Number.isNaN(Number.parseFloat(value))) {
          return memo.concat(key)
        }
        return memo
      }, [])
    },
    measures () {
      return _.difference(_.keys(this.data[0]), this.fields)
    },
    aggregators () {
      return ['max', 'min', 'avg', 'sum', 'count']
    }
  }
}
</script>

<style src="vue-multiselect/dist/vue-multiselect.min.css"></style>
<style lang="scss">
</style>
