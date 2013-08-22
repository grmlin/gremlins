//@ sourceMappingURL=CssAnimationClock.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.domObserver.clocks.CssAnimationClock');

goog.require('gremlin.domObserver.clocks.cssAnimationStyle');

goog.require('gremlin.util.Helper');

gremlin.domObserver.clocks.CssAnimationClock = (function() {
  var ANIMATION_NAME, EVENT_NAMES;

  ANIMATION_NAME = "gremlinInserted";

  EVENT_NAMES = ['animationstart', 'webkitAnimationStart', 'oanimationstart'];

  function CssAnimationClock() {
    this._onAnimation = __bind(this._onAnimation, this);
    var css;

    css = gremlin.domObserver.clocks.cssAnimationStyle(ANIMATION_NAME);
    gremlin.util.Helper.addStyleSheet(css);
  }

  CssAnimationClock.prototype.observe = function() {
    var name, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = EVENT_NAMES.length; _i < _len; _i++) {
      name = EVENT_NAMES[_i];
      _results.push(document.body.addEventListener(name, this._onAnimation, false));
    }
    return _results;
  };

  CssAnimationClock.prototype._onAnimation = function(event) {
    if (event.animationName === ANIMATION_NAME) {
      return this.onMutation();
    }
  };

  CssAnimationClock.prototype.onMutation = function() {};

  return CssAnimationClock;

})();
