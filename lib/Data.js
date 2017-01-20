"use strict";

var pendingSearches = [];

var hasId = function hasId(element) {
  return element._gid !== undefined;
};

module.exports = {
  addGremlin: function addGremlin(id) {
    pendingSearches = pendingSearches.filter(function (search) {
      var wasSearchedFor = search.element._gid === id;
      if (wasSearchedFor) {
        search.resolve();
      }

      return !wasSearchedFor;
    });
  },
  getGremlinAsync: function getGremlinAsync(element) {
    var timeout = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return new Promise(function (_resolve) {
      if (hasId(element)) {
        setTimeout(function () {
          return _resolve(element);
        }, 10);
      } else {
        (function () {
          var gremlinNotFoundTimeout = timeout !== null ? setTimeout(function () {
            _resolve(null);
          }, timeout) : null;

          pendingSearches.push({
            element: element,
            resolve: function resolve() {
              clearTimeout(gremlinNotFoundTimeout);
              _resolve(element);
            }
          });
        })();
      }
    });
  }
};