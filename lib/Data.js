'use strict';

var uuid = require('./uuid');

var exp = 'gremlins_' + uuid();
var cache = {};
var pendingSearches = [];

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

    pendingSearches = pendingSearches.filter(function (search) {
      var wasSearchedFor = search.element === element;
      if (wasSearchedFor) {
        search.created(gremlin);
      }

      return !wasSearchedFor;
    });
  },
  getGremlin: function getGremlin(element) {
    var id = getId(element);
    var gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
  },
  getGremlinAsync: function getGremlinAsync(element) {
    var _this = this;

    var timeout = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return new Promise(function (resolve) {
      var currentGremlin = _this.getGremlin(element);

      if (currentGremlin !== null) {
        resolve(currentGremlin);
      } else {
        (function () {
          var gremlinNotFoundTimeout = timeout !== null ? setTimeout(function () {
            resolve(null);
          }, timeout) : null;

          pendingSearches.push({
            element: element,
            created: function created(createdGremlin) {
              clearTimeout(gremlinNotFoundTimeout);
              resolve(createdGremlin);
            }
          });
        })();
      }
    });
  }
};