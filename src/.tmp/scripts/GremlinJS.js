//@ sourceMappingURL=GremlinJS.map
var GremlinJS,
  __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

goog.provide('GremlinJS');

goog.require('gremlin.util.polyfill');

goog.require('gremlin.util.ready');

goog.require('gremlin.event.Event');

goog.require('gremlin.conf.Configuration');

goog.require('gremlin.util.Helper');

goog.require('gremlin.util.Debug');

goog.require('gremlin.Application');

goog.require('gremlin.gremlinDefinitions.AbstractGremlin');

goog.require('gremlin.gremlinDefinitions.Pool');

goog.require('gremlin.gremlinDefinitions.ExtensionRegistry');

GremlinJS = (function() {
  var GremlinAdapter, app, g;

  app = null;
  GremlinAdapter = (function(_super) {
    __extends(GremlinAdapter, _super);

    GremlinAdapter.prototype.ON_ELEMENT_FOUND = 'elementfound';

    GremlinAdapter.prototype.ON_DEFINITION_PENDING = 'definitionpending';

    GremlinAdapter.prototype.ON_GREMLIN_LOADED = 'gremlinloaded';

    function GremlinAdapter() {
      GremlinAdapter.__super__.constructor.apply(this, arguments);
      this.debug = new gremlin.util.Debug(false);
    }

    GremlinAdapter.prototype.define = function(name, constructor, instanceMembers, staticMembers) {
      var Gremlin;

      Gremlin = gremlin.gremlinDefinitions.Pool.getInstance().define(name, constructor, instanceMembers, staticMembers);
      if (app != null) {
        app.refresh();
      }
      return Gremlin;
    };

    GremlinAdapter.prototype.add = function(name, GremlinClass) {
      gremlin.gremlinDefinitions.Pool.getInstance().addClass(name, GremlinClass);
      return app != null ? app.refresh() : void 0;
    };

    GremlinAdapter.prototype.Gremlin = gremlin.gremlinDefinitions.AbstractGremlin;

    GremlinAdapter.prototype.Helper = gremlin.util.Helper;

    GremlinAdapter.prototype.registerExtension = function(Extension) {
      return gremlin.gremlinDefinitions.ExtensionRegistry.addExtension(Extension);
    };

    return GremlinAdapter;

  })(gremlin.event.Event);
  g = new GremlinAdapter;
  gremlin.util.ready(function() {
    var isDebug;

    app = new gremlin.Application();
    isDebug = app.configuration.get(gremlin.conf.Configuration.options.DEBUG);
    if (isDebug) {
      g.debug = new gremlin.util.Debug(isDebug);
    }
    app.start();
    return g.debug.console.log("GremlinJS up and running...");
  });
  return g;
})();

window.GremlinJS = GremlinJS;

if (window.G === void 0) {
  window.G = window.GremlinJS;
}

if (typeof window.define === "function" && window.define.amd) {
  define("GremlinJS", [], function() {
    return GremlinJS;
  });
}
