//@ sourceMappingURL=Pool.map
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

goog.provide('gremlin.gremlinDefinitions.Pool');

goog.require('gremlin.util.Helper');

goog.require('gremlin.gremlinDefinitions.AbstractGremlin');

gremlin.gremlinDefinitions.Pool = (function() {
  'use strict';
  var Pool, definitions, instance, nameRe, noop;

  function Pool() {}

  nameRe = /function\s*([\w\$]*)\s*\(/;

  instance = null;

  definitions = {};

  noop = function() {};

  Pool = (function() {
    function Pool() {}

    Pool.prototype.get = function(name) {
      var _ref;

      return (_ref = definitions[name]) != null ? _ref : null;
    };

    Pool.prototype.set = function(name, definition) {
      if (typeof definitions[name] !== 'undefined') {
        throw new Error("Trying to add new Gremlin definition, but a definition for " + name + " already exists.");
      }
      return definitions[name] = definition;
    };

    Pool.prototype.define = function(name, constructor, instanceMembers, staticMembers) {
      var Gremlin, key, member;

      if (typeof name !== 'string') {
        throw new Error("The first parameter when defining a gremlin has to be a string, the gremlin definition's name!");
      }
      if (typeof constructor !== 'function') {
        throw new Error("The second parameter when defining a gremlin has to be the constructor function!");
      }
      if (!(instanceMembers === void 0 || typeof instanceMembers === 'object')) {
        throw new Error("The third parameter when defining a gremlin has to be an object providing the instance members of the gremlin!");
      }
      if (!(staticMembers === void 0 || typeof staticMembers === 'object')) {
        throw new Error("The fourth parameter when defining a gremlin has to be an object providing the static members of the gremlin!");
      }
      Gremlin = (function(_super) {
        __extends(Gremlin, _super);

        function Gremlin() {
          Gremlin.__super__.constructor.apply(this, arguments);
          constructor.call(this);
        }

        return Gremlin;

      })(gremlin.gremlinDefinitions.AbstractGremlin);
      Gremlin.prototype.klass = Gremlin;
      gremlin.util.Helper.mixin(Gremlin, instanceMembers);
      for (key in staticMembers) {
        if (!__hasProp.call(staticMembers, key)) continue;
        member = staticMembers[key];
        Gremlin[key] = member;
      }
      this.set(name, Gremlin);
      return Gremlin;
    };

    Pool.prototype.addClass = function(name, Gremlin) {
      if (typeof name !== 'string') {
        throw new Error("Please provide the name of the gremlin ");
      }
      if (typeof Gremlin !== 'function') {
        throw new Error("When adding a gremlin, you have to provide a constructor function!");
      }
      Gremlin.prototype.klass = Gremlin;
      this.set(name, Gremlin);
      return Gremlin;
    };

    return Pool;

  })();

  Pool.getInstance = function() {
    return instance != null ? instance : instance = new Pool;
  };

  return Pool;

})();
