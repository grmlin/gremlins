//@ sourceMappingURL=DomObserver.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.domObserver.DomObserver');

goog.require('gremlin.MutationObserverShim');

goog.require('gremlin.domObserver.ElementList');

goog.require('gremlin.util.Helper');

gremlin.domObserver.DomObserver = (function() {
  var TAG_SELECTOR;

  TAG_SELECTOR = '*';

  function DomObserver() {
    this._handleMutation = __bind(this._handleMutation, this);    this._elementList = new gremlin.domObserver.ElementList;
  }

  DomObserver.prototype._bindMutations = function() {
    var observer;

    observer = gremlin.MutationObserverShim.get();
    observer.on(gremlin.MutationObserverShim.ON_MUTATION, this._handleMutation);
    return observer.observe();
  };

  DomObserver.prototype._handleMutation = function() {
    var elements;

    elements = this._elementList.getList();
    if (elements.length > 0) {
      return this.onNewElements(elements);
    }
  };

  DomObserver.prototype.observe = function() {
    return this._bindMutations();
  };

  DomObserver.prototype.onNewElements = function() {};

  return DomObserver;

})();
