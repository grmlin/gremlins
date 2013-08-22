//@ sourceMappingURL=ExtensionRegistry.map
goog.provide('gremlin.gremlinDefinitions.ExtensionRegistry');

goog.require('gremlin.gremlinDefinitions.AbstractGremlin');

gremlin.gremlinDefinitions.ExtensionRegistry = (function() {
  var availableExtensions;

  function ExtensionRegistry() {}

  availableExtensions = [];

  ExtensionRegistry.addExtension = function(Extension) {
    Extension.extend(gremlin.gremlinDefinitions.AbstractGremlin);
    return availableExtensions.push(Extension);
  };

  ExtensionRegistry.getExtensions = function() {
    return availableExtensions.slice(0);
  };

  return ExtensionRegistry;

})();
