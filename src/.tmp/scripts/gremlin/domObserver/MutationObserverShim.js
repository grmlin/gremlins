//@ sourceMappingURL=MutationObserverShim.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

goog.provide('gremlin.MutationObserverShim');

goog.require('gremlin.event.Event');

goog.require('gremlin.domObserver.clocks.ClockFactory');

gremlin.MutationObserverShim = (function() {
  var MutationObserverShim, instance;

  function MutationObserverShim() {}

  instance = null;

  MutationObserverShim = (function(_super) {
    __extends(MutationObserverShim, _super);

    function MutationObserverShim() {
      this._onMutation = __bind(this._onMutation, this);      MutationObserverShim.__super__.constructor.apply(this, arguments);
      this._clock = gremlin.domObserver.clocks.ClockFactory.createClock();
      this._clock.onMutation = this._onMutation;
    }

    MutationObserverShim.prototype._onMutation = function() {
      return this.emit(gremlin.MutationObserverShim.ON_MUTATION);
    };

    MutationObserverShim.prototype.observe = function() {
      this._clock.observe();
      return this._onMutation();
    };

    return MutationObserverShim;

  })(gremlin.event.Event);

  MutationObserverShim.ON_MUTATION = 'ON_MUTATION';

  MutationObserverShim.get = function() {
    return instance != null ? instance : instance = new MutationObserverShim;
  };

  return MutationObserverShim;

}).call(this);
