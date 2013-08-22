//@ sourceMappingURL=LegacyTimeoutClock.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.domObserver.clocks.LegacyTimeoutClock');

gremlin.domObserver.clocks.LegacyTimeoutClock = (function() {
  var RESCAN_INTERVAL;

  RESCAN_INTERVAL = 500;

  function LegacyTimeoutClock() {
    this._onInterval = __bind(this._onInterval, this);
  }

  LegacyTimeoutClock.prototype.observe = function() {
    return this._initiateInterval();
  };

  LegacyTimeoutClock.prototype._initiateInterval = function() {
    return this._interval = window.setTimeout(this._onInterval, RESCAN_INTERVAL);
  };

  LegacyTimeoutClock.prototype._onInterval = function() {
    this.onMutation();
    return this._initiateInterval();
  };

  LegacyTimeoutClock.prototype.onMutation = function() {};

  return LegacyTimeoutClock;

})();
