import Vue from 'vue/dist/vue.js'
import Crosstab from 'src/Crosstab.vue'
import data from 'src/../docs/data/people.json'

describe('Crosstab.vue', () => {
  it('should create instance of rows only crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: [
          {field: 'sex'},
          {field: 'smoker'},
          {aggregate: 'count'}
        ]
      }
    }).$mount()
  })
  it('should create instance of cols only crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :cols="cols"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        cols: [
          {field: 'sex'},
          {field: 'smoker'},
          {field: 'tip', aggregate: 'sum'}
        ]
      }
    }).$mount()
  })
  it('should create instance of basic crosstab', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: [
          {field: 'sex'},
          {field: 'smoker'},
          {field: 'total_bill', aggregate: 'max'}
        ],
        cols: [
          {field: 'day'},
          {field: 'time'}
        ]
      }
    }).$mount()
  })
  it('should work with min aggregation function', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: [
          {field: 'sex'},
          {field: 'smoker'},
          {field: 'total_bill', aggregate: 'min'}
        ],
        cols: [
          {field: 'day'},
          {field: 'time'}
        ]
      }
    }).$mount()
  })
  it('should work with avg aggregation function', () => {
    new Vue({
      template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            ></crosstab></div>
        `,
      components: { Crosstab },
      data: {
        data,
        rows: [
          {field: 'sex'},
          {field: 'smoker'},
          {field: 'total_bill', aggregate: 'avg'}
        ],
        cols: [
          {field: 'day'},
          {field: 'time'}
        ]
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
            :fontSize="50"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: [
            {field: 'sex'},
            {field: 'smoker'},
            {field: 'total_bill', aggregate: 'max'}
          ],
          cols: [
            {field: 'day'},
            {field: 'time'}
          ]
        }
      }).$mount()
    })
    it('should work with width and height', () => {
      new Vue({
        template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            :width="300"
            :heigth="200"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: [
            {field: 'sex'},
            {field: 'smoker'},
            {field: 'total_bill', aggregate: 'max'}
          ],
          cols: [
            {field: 'day'},
            {field: 'time'}
          ]
        }
      }).$mount()
    })
    it('should work with cellWidth and cellHeight', () => {
      new Vue({
        template: `<div><crosstab
            :data="data"
            :rows="rows"
            :cols="cols"
            :cellWidth="100"
            :cellHeigth="50"
            ></crosstab></div>
        `,
        components: { Crosstab },
        data: {
          data,
          rows: [
            {field: 'sex'},
            {field: 'smoker'},
            {field: 'total_bill', aggregate: 'max'}
          ],
          cols: [
            {field: 'day'},
            {field: 'time'}
          ]
        }
      }).$mount()
    })
  })
})
