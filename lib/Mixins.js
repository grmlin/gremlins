'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');

function getMixins(gremlin) {
  if (Array.isArray(gremlin.mixins)) {
    return gremlin.mixins;
  }

  return gremlin.mixins ? [gremlin.mixins] : [];
}

function decorateProperty(gremlin, propertyName, property) {
  var gremlinProperty = gremlin[propertyName];
  var moduleProperty = property;
  var gremlinPropertyType = typeof gremlinProperty === 'undefined' ? 'undefined' : _typeof(gremlinProperty);
  var modulePropertyType = typeof moduleProperty === 'undefined' ? 'undefined' : _typeof(moduleProperty);
  var isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    gremlin[propertyName] = function () {
      // eslint-disable-line no-param-reassign, func-names
      // call the module first
      var moduleResult = moduleProperty.apply(this, arguments);
      var gremlinResult = gremlinProperty.apply(this, arguments);

      try {
        return objectAssign(moduleResult, gremlinResult);
      } catch (e) {
        return [moduleResult, gremlinResult];
      }
    };
  } else {
    console.warn( // eslint-disable-line no-console
    'Can\'t decorate gremlin property ' + ('<' + gremlin.tagName + ' />#' + propertyName + ':' + gremlinPropertyType + '« ') + ('with »Module#' + propertyName + ':' + modulePropertyType + '«. Only functions can be decorated!'));
  }
}

function mixinModule(gremlin, Module) {
  Object.keys(Module).forEach(function (propertyName) {
    var property = Module[propertyName];

    if (gremlin[propertyName] === undefined) {
      var descriptor = Object.getOwnPropertyDescriptor(Module, propertyName);
      Object.defineProperty(gremlin, propertyName, descriptor);
    } else {
      decorateProperty(gremlin, propertyName, property);
    }
  });
}

module.exports = {
  mixinProps: function mixinProps(gremlin) {
    var modules = getMixins(gremlin);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(function (Module) {
      return mixinModule(gremlin, Module);
    });
  }
};