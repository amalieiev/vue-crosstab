<template lang="pug">
    div
        label.typo__label Cols:
        multiselect(v-model="cols", :options="fields", :multiple="true", label="field", track-by="field")
        label.typo__label Rows:
        multiselect(v-model="rows", :options="fields", :multiple="true", label="field", track-by="field")
        br
        crosstab(
          :data="data",
          :rows="rows",
          :cols="cols",
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
      cols: [
        {field: 'sex'},
        {field: 'smoker'}
      ],
      rows: [
        {field: 'time'},
        {field: 'day'}
      ]
    }
  },
  computed: {
    fields () {
      return _.reduce(this.data[0], (memo, value, key) => {
        if (Number.isNaN(Number.parseFloat(value))) {
          return memo.concat({field: key})
        }
        return memo
      }, [])
    },
    measures () {
      return _.reduce(this.data[0], (memo, value, key) => {
        if (!Number.isNaN(Number.parseFloat(value))) {
          return memo.concat({field: key})
        }
        return memo
      }, [])
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
