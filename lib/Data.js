"use strict";

var pendingSearches = [];

var hasComponent = function hasComponent(element) {
  return element.__gremlinInstance__ !== undefined;
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
      if (hasComponent(element)) {
        setTimeout(function () {
          return _resolve(element.__gremlinInstance__);
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
              _resolve(element.__gremlinInstance__);
            }
          });
        })();
      }
    });
  }
};