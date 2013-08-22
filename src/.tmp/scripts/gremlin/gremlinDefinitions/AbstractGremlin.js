//@ sourceMappingURL=AbstractGremlin.map
goog.provide('gremlin.gremlinDefinitions.AbstractGremlin');

gremlin.gremlinDefinitions.AbstractGremlin = (function() {
  AbstractGremlin.prototype.data = null;

  AbstractGremlin.prototype.el = null;

  AbstractGremlin.prototype.id = null;

  AbstractGremlin.prototype.klass = null;

  function AbstractGremlin(el, data, id, init) {
    this.el = el;
    this.data = data;
    this.id = id;
    init.call(this);
  }

  return AbstractGremlin;

})();
