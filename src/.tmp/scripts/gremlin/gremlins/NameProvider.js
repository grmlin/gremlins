//@ sourceMappingURL=NameProvider.map
goog.provide('gremlin.gremlins.NameProvider');

goog.require('gremlin.util.Helper');

gremlin.gremlins.NameProvider = (function() {
  var CSS_CLASS_GREMLIN_BROKEN, DATA_NAME, DATA_NAME_PROCESSED, DATA_NAME_SEARCHING, NAME_SEPARATOR, hasAttribute, isNameString;

  function NameProvider() {}

  DATA_NAME = 'data-gremlin';

  DATA_NAME_PROCESSED = 'data-gremlin-found';

  DATA_NAME_SEARCHING = 'data-gremlin-pending';

  NAME_SEPARATOR = ",";

  CSS_CLASS_GREMLIN_BROKEN = 'gremlin-error';

  hasAttribute = function(el, name) {
    var node;

    if (typeof el.hasAttribute === 'function') {
      return el.hasAttribute(name);
    } else {
      node = el.getAttributeNode(name);
      return !!(node && (node.specified || node.nodeValue));
    }
  };

  isNameString = function(names) {
    return typeof names === 'string';
  };

  NameProvider.DATA_NAME_ATTR = DATA_NAME;

  NameProvider.isGremlin = function(el) {
    return hasAttribute(el, DATA_NAME);
  };

  NameProvider.getNames = function(el) {
    var html, name, nameList, names, _ref;

    names = el.getAttribute(DATA_NAME);
    if (names === "") {
      html = (_ref = el.outerHTML) != null ? _ref : "";
      gremlin.gremlins.NameProvider.flagBrokenElement(el);
      GremlinJS.debug.console.log(("Couldn't process gremlin element, no gremlin names available, '" + DATA_NAME + "' is empty!\n") + html);
      return [];
    } else {
      return nameList = (function() {
        var _i, _len, _ref1, _results;

        _ref1 = names.split(NAME_SEPARATOR);
        _results = [];
        for (_i = 0, _len = _ref1.length; _i < _len; _i++) {
          name = _ref1[_i];
          _results.push(name.trim());
        }
        return _results;
      })();
    }
  };

  NameProvider.flagBrokenElement = function(el) {
    gremlin.util.Helper.addClass(el, CSS_CLASS_GREMLIN_BROKEN);
    gremlin.gremlins.NameProvider.flagProcessedElement(el);
    return GremlinJS.debug.reportBrokenGremlin(el);
  };

  NameProvider.flagProcessedElement = function(el) {
    var names;

    names = el.getAttribute(DATA_NAME);
    el.removeAttribute(DATA_NAME);
    return el.setAttribute(DATA_NAME_PROCESSED, names);
  };

  return NameProvider;

})();
