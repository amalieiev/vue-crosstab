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
      return memo + Number.parseFloat(item[measure]);
    }, 0));
  },
  max: function max(items, measure) {
    return Math.round(items.reduce(function (max, item) {
      return max > Number.parseFloat(item[measure]) ? max : Number.parseFloat(item[measure]);
    }, -Infinity));
  },
  min: function min(items, measure) {
    return Math.round(items.reduce(function (min, item) {
      return min < Number.parseFloat(item[measure]) ? min : Number.parseFloat(item[measure]);
    }, Infinity));
  },
  avg: function avg(items, measure) {
    return Math.round(items.reduce(function (total, item) {
      return total + Number.parseFloat(item[measure]);
    }, 0) / items.length);
  }
};

var formatters = exports.formatters = {
  currency: function currency(value) {
    return '$' + Number.parseFloat(value).toLocaleString();
  }
};

var temporalMixin = exports.temporalMixin = function temporalMixin(datum, item) {
  var timeUnit = item.timeUnit;
  var fieldName = item.field;
  var date = new Date(datum[fieldName]);

  if (timeUnit === 'year') {
    datum[fieldName + '_year'] = date.getFullYear();
  }
  if (timeUnit === 'quarter') {
    var month = date.getMonth();

    datum[fieldName + '_quarter'] = month < 3 ? 'Q1' : month < 6 ? 'Q2' : month < 9 ? 'Q3' : 'Q4';
  }
  if (timeUnit === 'month') {
    datum[fieldName + '_month'] = date.toLocaleString('en-us', { month: 'long' });
  }
  if (timeUnit === 'day') {
    datum[fieldName + '_day'] = date.toLocaleString('en-us', { weekday: 'long' });
  }
};

var csvJSON = exports.csvJSON = function csvJSON(csv) {
  var lines = csv.split('\n');
  var result = [];

  var headers = lines[0].split(',').map(function (header) {
    return normalize(header);
  });

  for (var i = 1; i < lines.length; i++) {
    var obj = {};
    var currentline = lines[i].split(',');

    for (var j = 0; j < headers.length; j++) {
      obj[headers[j]] = normalize(currentline[j]);
    }

    result.push(obj);
  }

  return JSON.parse(JSON.stringify(result));
};

function normalize(value) {
  if (/^['|"]/.test(value) && /['|"]$/.test(value)) {
    return value.slice(1, -1);
  }
  return value;
}