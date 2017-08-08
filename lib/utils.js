"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
var aggregators = exports.aggregators = {
  count: function count(items) {
    return items.length;
  },
  sum: function sum(items, measure) {
    return Math.round(items.reduce(function (memo, item) {
      return memo + item[measure];
    }, 0));
  },
  max: function max(items, measure) {
    return items.reduce(function (max, item) {
      return max > item[measure] ? max : item[measure];
    }, -Infinity);
  },
  min: function min(items, measure) {
    return items.reduce(function (min, item) {
      return min < item[measure] ? min : item[measure];
    }, Infinity);
  },
  avg: function avg(items, measure) {
    return items.reduce(function (total, item) {
      return total + item[measure];
    }, 0) / items.length;
  }
};