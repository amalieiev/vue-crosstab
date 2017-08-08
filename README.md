Probably the most complete *crosstab* solution for Vue.js 2.0, without jQuery.

### Features & characteristics:
* \> 99% test coverage
* Fully configurable

## Install & basic usage

```bash
npm install vue-crosstab
```

```vue
<template>
  <div>
    <crosstab
       :data="data"
       :cols="['country', 'city']"
       :rows="['category', 'product']"
       :aggregator="sum"
       :measure="sales"></crosstab>
  </div>
</template>

<script>
  import Crosstab from 'vue-crosstab'
  export default {
    components: { Crosstab },
    data () {
      return {
        data: [
          {country: 'USA', city: 'Los Angeles', category: 'electronics', product: 'iphone', sales: 1132},
          {country: 'USA', city: 'New York', category: 'electronics', product: 'mackbook', sales: 234},
          {country: 'Mexico', city: 'Acapulco', category: 'furniture', product: 'table', sales: 809}
        ]
      }
    }
  }
</script>
```
## JSFiddle

[Example JSFiddle](https://jsfiddle.net/amalieiev/171kzqL6/2/) – Use this for issue reproduction.

## Contributing

``` bash
# serve with hot reload at localhost:5000
npm run dev

# distribution build with minification
npm run bundle

# build the docs into gh-pages
npm run docs

# run unit tests
npm run test

# run unit tests watch
npm run unit-watch

```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).
