<template lang="pug">
div
  label.typo__label Filters
  div.overflow-auto
    crosstab(
      :data="data",
      :cols="cols",
      :rows="rows",
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
          {field: 'Язык программирования', label: 'Speciality'}
        ],
        cols: [
          {field: 'Зарплата в месяц', label: 'Salary', aggregate: 'max', formatter: 'currency'}
        ]
      }
    }
  }
</script>
