<template lang="pug">
div
  label.typo__label Custom Theme
  div.overflow-auto
    multiselect(v-model="theme", :options="themes",  label="name", track-by="name")
    br
    br
    crosstab(
      :data="data",
      :rows="rows",
      :cols="cols",
      :width="380",
      :theme="theme"
    )
</template>

<script>
import Crosstab from 'vue-crosstab'
import Multiselect from 'vue-multiselect'
import data from 'data/people.json'

export default {
  components: {
    Crosstab,
    Multiselect
  },
  data () {
    return {
      data,
      rows: [
        {field: 'day'},
        {field: 'time'}
      ],
      cols: [
        {field: 'sex'},
        {field: 'smoker'},
        {field: 'total_bill', aggregate: 'sum'}
      ],
      theme: {name: 'Teal'},
      themes: [
        {name: 'Blue'},
        {name: 'Light Blue'},
        {name: 'Indigo'},
        {name: 'Pink'},
        {name: 'Deep Purple'},
        {name: 'Teal'}
      ]
    }
  }
}
</script>
