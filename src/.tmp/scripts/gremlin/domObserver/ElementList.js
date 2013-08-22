//@ sourceMappingURL=ElementList.map
goog.provide('gremlin.domObserver.ElementList');

goog.require('gremlin.util.FeatureDetector');

goog.require('gremlin.gremlins.NameProvider');

gremlin.domObserver.ElementList = (function() {
  var LegacySelector, NativeQuerySelector, Selector, isNative;

  NativeQuerySelector = (function() {
    function NativeQuerySelector() {}

    NativeQuerySelector.get = function(attributeName) {
      var element, elements, _i, _len, _results;

      elements = document.querySelectorAll("[" + gremlin.gremlins.NameProvider.DATA_NAME_ATTR + "]");
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        _results.push(element);
      }
      return _results;
    };

    return NativeQuerySelector;

  })();

  LegacySelector = (function() {
    function LegacySelector() {}

    LegacySelector.get = function(attributeName) {
      var element, elements, _i, _len, _results;

      elements = document.getElementsByTagName('*');
      _results = [];
      for (_i = 0, _len = elements.length; _i < _len; _i++) {
        element = elements[_i];
        if (gremlin.gremlins.NameProvider.isGremlin(element)) {
          _results.push(element);
        }
      }
      return _results;
    };

    return LegacySelector;

  })();

  isNative = gremlin.util.FeatureDetector.hasQuerySelectorAll;

  Selector = isNative ? NativeQuerySelector : LegacySelector;

  function ElementList(_attributeName) {
    this._attributeName = _attributeName;
  }

  ElementList.prototype.getList = function() {
    return Selector.get(this._attributeName);
  };

  return ElementList;

}).call(this);
