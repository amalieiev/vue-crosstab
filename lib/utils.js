'use strict';

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
    return Math.round(items.reduce(function (max, item) {
      return max > item[measure] ? max : item[measure];
    }, -Infinity));
  },
  min: function min(items, measure) {
    return Math.round(items.reduce(function (min, item) {
      return min < item[measure] ? min : item[measure];
    }, Infinity));
  },
  avg: function avg(items, measure) {
    return Math.round(items.reduce(function (total, item) {
      return total + item[measure];
    }, 0) / items.length);
  }
};

var temporalMixin = exports.temporalMixin = function temporalMixin(datum, item) {
  var timeUnit = item.timeUnit;
  var fieldName = item.field;
  var date = new Date(datum[fieldName]);

  if (timeUnit === 'year') {
    datum['year_' + fieldName] = date.getFullYear();
  }
  if (timeUnit === 'quarter') {
    var month = date.getMonth();

    datum['quarter_' + fieldName] = month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4';
  }
  if (timeUnit === 'month') {
    datum['month_' + fieldName] = date.toLocaleString('en-us', { month: 'long' });
  }
  if (timeUnit === 'day') {
    datum['day_' + fieldName] = date.toLocaleString('en-us', { weekday: 'long' });
  }
};