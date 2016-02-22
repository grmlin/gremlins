'use strict';

var uuid = require('./uuid');

var exp = 'gremlins_' + uuid();
var cache = {};

var gremlinId = function gremlinId() {
  var id = 1;
  return function () {
    return id++;
  };
}();

var hasId = function hasId(element) {
  return element[exp] !== undefined;
};
var setId = function setId(element) {
  return element[exp] = gremlinId();
}; // eslint-disable-line no-param-reassign
var getId = function getId(element) {
  return hasId(element) ? element[exp] : setId(element);
};

module.exports = {
  addGremlin: function addGremlin(gremlin, element) {
    var id = getId(element);

    if (cache[id] !== undefined) {
      console.warn('You can\'t add another gremlin to this element, it already uses one!', element); // eslint-disable-line no-console, max-len
    } else {
        cache[id] = gremlin;
      }
  },
  getGremlin: function getGremlin(element) {
    var id = getId(element);
    var gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
  }
};