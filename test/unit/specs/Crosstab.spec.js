import Vue from 'vue/dist/vue.js'
import Crosstab from 'src/Crosstab.vue'
import data from 'src/../docs/data/people.json'

describe('Crosstab.vue', () => {
  it('should create instance of rows only crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            aggregator="count"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: ['sex', 'smoker']
      }
    }).$mount()
  })
  it('should create instance of cols only crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :cols="cols"
            aggregator="sum"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        cols: ['sex', 'smoker']
      }
    }).$mount()
  })
  it('should create instance of basic crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="max"
            measure="tip"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: ['sex', 'smoker'],
        cols: ['day', 'time']
      }
    }).$mount()
  })
  it('should work with min aggregation function', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="min"
            measure="tip"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: ['sex', 'smoker'],
        cols: ['day', 'time']
      }
    }).$mount()
  })
  it('should work with avg aggregation function', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="avg"
            measure="tip"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: ['sex', 'smoker'],
        cols: ['day', 'time']
      }
    }).$mount()
  })
  describe('custom configuraiton', () => {
    it('should work with fontSize', () => {
      new Vue({
        template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="count"
            :fontSize="50"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: ['sex', 'smoker'],
          cols: ['day', 'time']
        }
      }).$mount()
    })
    it('should work with width and height', () => {
      new Vue({
        template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="count"
            :width="300"
            :heigth="200"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: ['sex', 'smoker'],
          cols: ['day', 'time']
        }
      }).$mount()
    })
    it('should work with cellWidth and cellHeight', () => {
      new Vue({
        template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            aggregator="count"
            :cellWidth="100"
            :cellHeigth="50"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: ['sex', 'smoker'],
          cols: ['day', 'time']
        }
      }).$mount()
    })
  })
})
