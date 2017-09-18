<template lang="pug">
div
  label.typo__label Filters
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows",
      :bars="true",
      :cellWidth="150",
      :transform="transform"
    )
</template>

<script>
  import Crosstab from 'vue-crosstab'
  import data from 'data/salary.json'

  export default {
    components: {
      Crosstab
    },
    data () {
      return {
        data,
        transform: [],
        rows: [
          {field: 'programming_language', label: 'Speciality'}
        ],
        cols: [
          {field: 'salary_per_month', label: 'Salary', aggregate: 'max', formatter: 'currency'}
        ]
      }
    }
  }
</script>
