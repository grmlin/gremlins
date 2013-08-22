//@ sourceMappingURL=MutationObserverClock.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.domObserver.clocks.MutationObserverClock');

gremlin.domObserver.clocks.MutationObserverClock = (function() {
  var MutationObserver, mutationTypes;

  MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver || null;

  mutationTypes = {
    CHILD_LIST: 'childList'
  };

  function MutationObserverClock() {
    this._onMutation = __bind(this._onMutation, this);    if (MutationObserver === null) {
      throw new Error("Mutation Observer not available");
    }
  }

  MutationObserverClock.prototype.observe = function() {
    var observer;

    observer = new MutationObserver(this._onMutation);
    return observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  };

  MutationObserverClock.prototype._onMutation = function(mutations) {
    var mutation, _i, _len, _results;

    _results = [];
    for (_i = 0, _len = mutations.length; _i < _len; _i++) {
      mutation = mutations[_i];
      if (mutation.type === mutationTypes.CHILD_LIST) {
        this.onMutation();
        break;
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  MutationObserverClock.prototype.onMutation = function() {};

  return MutationObserverClock;

})();
