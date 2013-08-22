//@ sourceMappingURL=GremlinCollection.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.gremlins.GremlinCollection');

goog.require('gremlin.gremlins.NameProvider');

goog.require('gremlin.gremlins.GremlinDomElement');

gremlin.gremlins.GremlinCollection = (function() {
  GremlinCollection.prototype._queue = null;

  function GremlinCollection() {
    this._scrollHandler = __bind(this._scrollHandler, this);    this._queue = [];
    this._bindScroll();
    this._didScroll = false;
    this._scrollTimer = false;
  }

  GremlinCollection.prototype._bindScroll = function() {
    if (window.addEventListener) {
      return window.addEventListener('scroll', this._scrollHandler, false);
    } else if (window.attachEvent) {
      return window.attachEvent('onscroll', this._scrollHandler);
    }
  };

  GremlinCollection.prototype.add = function(elArray) {
    var el, _i, _len;

    for (_i = 0, _len = elArray.length; _i < _len; _i++) {
      el = elArray[_i];
      this._addGremlinElements(el);
    }
    return this._processQueue();
  };

  GremlinCollection.prototype._addGremlinElements = function(el) {
    var name, names, _i, _len, _results;

    names = gremlin.gremlins.NameProvider.getNames(el);
    gremlin.gremlins.NameProvider.flagProcessedElement(el);
    _results = [];
    for (_i = 0, _len = names.length; _i < _len; _i++) {
      name = names[_i];
      _results.push(this._queue.push(new gremlin.gremlins.GremlinDomElement(el, name)));
    }
    return _results;
  };

  GremlinCollection.prototype._processQueue = function() {
    var element, remaining, _i, _len, _ref;

    remaining = [];
    _ref = this._queue;
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      element = _ref[_i];
      element.check();
      if (!element.hasGremlin()) {
        remaining.push(element);
      }
    }
    this._queue = remaining;
    return GremlinJS.debug.updateGremlinLog();
  };

  GremlinCollection.prototype.process = function() {
    return this._processQueue();
  };

  GremlinCollection.prototype._scrollHandler = function() {
    var _this = this;

    if (this._queue.length === 0) {
      return true;
    }
    if (!this._didScroll) {
      this._scrollTimer = setInterval(function() {
        if (_this._didScroll) {
          _this._didScroll = false;
          clearTimeout(_this._scrollTimer);
          return _this.process();
        }
      }, 250);
    }
    return this._didScroll = true;
  };

  return GremlinCollection;

})();
