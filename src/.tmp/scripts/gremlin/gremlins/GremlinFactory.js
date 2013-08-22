//@ sourceMappingURL=GremlinFactory.map
goog.provide('gremlin.gremlins.GremlinFactory');

goog.require('gremlin.gremlinDefinitions.Pool');

goog.require('gremlin.gremlinDefinitions.ExtensionRegistry');

gremlin.gremlins.GremlinFactory = (function() {
  var addExtensions, uid;

  function GremlinFactory() {}

  uid = (function() {
    var i;

    i = 0;
    return function() {
      return i++;
    };
  })();

  addExtensions = function() {
    var Extension, extensions, _i, _len, _results;

    extensions = gremlin.gremlinDefinitions.ExtensionRegistry.getExtensions();
    _results = [];
    for (_i = 0, _len = extensions.length; _i < _len; _i++) {
      Extension = extensions[_i];
      _results.push(Extension.bind(this));
    }
    return _results;
  };

  GremlinFactory.getInstance = function(name, domEl, elData) {
    var GremlinClass, gremlinInstance;

    GremlinClass = gremlin.gremlinDefinitions.Pool.getInstance().get(name);
    if (typeof GremlinClass === 'function') {
      gremlinInstance = new GremlinClass(domEl, elData.toObject(), uid(), addExtensions);
      if (gremlinInstance.el === null) {
        throw new Error("Abstract gremlin class not called. Did you miss a super in your coffeescript-class?");
      }
      return gremlinInstance;
    } else {
      return null;
    }
  };

  return GremlinFactory;

})();
