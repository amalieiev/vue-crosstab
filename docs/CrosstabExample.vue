<template>
  <crosstab
    dataUrl="https://raw.githubusercontent.com/amalieiev/vue-crosstab/master/docs/data/salary.json"
    :rows="rows"
    :cols="cols"
    :transform="transform"
    height="250"
  ></crosstab>
</template>

<script>
import Crosstab from '../src/Crosstab.vue'
import _ from 'underscore'
import data from '../docs/data/salary.json'

export default {
  components: {
    Crosstab
  },
  data () {
    return {
      data,
      transform: [
        {calculate: 'sex', value: record => record.sex === 'm' ? 'Male' : 'Female'},
        {filter: 'city', isOneOf: ['Kiev', 'Kharkiv', 'Lviv', 'Odessa', 'Zaporozhye']}
      ],
      cols: [
        {field: 'date', type: 'temporal', timeUnit: 'year', label: 'Year'},
        {field: 'city', label: 'City'},
        {field: 'sex', label: 'Sex'},
        {field: 'salary_per_month', label: 'Salary', aggregate: 'avg', formatter: 'currency'}
      ],
      rows: [
        {field: 'programming_language', label: 'Language'},
        {field: 'position', label: 'Position'}
      ]
    }
  }
}
</script>

<style lang="scss">
  #app .start .typo__h1 {
    padding-top: 0;
  }
</style>
