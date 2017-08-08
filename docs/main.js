import Vue from 'vue'
import * as examples from './partials/examples'
import LangSwitcher from './LangSwitcher'
import CrosstabExample from './CrosstabExample'
import Crosstab from 'vue-crosstab'

import './docs.scss'

function calculateNavPositions () {
  sections = Array
    .from(document.querySelectorAll('[data-section]'))
    .map(section => {
      return {
        id: section.id,
        offset: section.getBoundingClientRect().top + window.pageYOffset - 50
      }
    })
}

const SL = ', 100%, 85%'
let sections

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: {
    ...examples,
    CrosstabExample,
    LangSwitcher,
    Crosstab
  },
  data () {
    return {
      markupLangs: ['pug', 'html'],
      markupLanguage: 'pug',
      isNavSticky: false,
      firstColor: Math.floor(Math.random() * 255),
      secondColor: Math.floor(Math.random() * 255),
      currentPosition: ''
    }
  },
  methods: {
    selectLanguage (lang) {
      this.markupLanguage = lang
    },
    adjustNav () {
      this.isNavSticky = window.scrollY > window.innerHeight
      if (!sections) calculateNavPositions()
      for (let i = sections.length - 1; i >= 0; i--) {
        if (window.scrollY > sections[i].offset) {
          this.currentPosition = sections[i].id
          break
        }
      }
    },
    onTagging (newTag) {
      this.source.push({ name: newTag, language: newTag })
      this.value.push({ name: newTag, language: newTag })
    }
  },
  mounted () {
    this.adjustNav()
    window.addEventListener('scroll', this.adjustNav)
    setTimeout(function () {
      calculateNavPositions()
    }, 1000)
  }
})
