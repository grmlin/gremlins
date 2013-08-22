//@ sourceMappingURL=Event.map
goog.provide("gremlin.event.Event");

gremlin.event.Event = (function() {
  function Event() {
    this._events = new Object();
  }

  Event.prototype.on = function(event, fct) {
    this._events[event] = this._events[event] || [];
    return this._events[event].push(fct);
  };

  Event.prototype.off = function(event, fct) {
    if (event in this._events === false) {
      return;
    }
    return this._events[event].splice(this._events[event].indexOf(fct), 1);
  };

  Event.prototype.emit = function(event) {
    var i, _results;

    this._events = this._events || {};
    if (event in this._events === false) {
      return;
    }
    i = 0;
    _results = [];
    while (i < this._events[event].length) {
      this._events[event][i].apply(this, Array.prototype.slice.call(arguments, 1));
      _results.push(i++);
    }
    return _results;
  };

  return Event;

})();
