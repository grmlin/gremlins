//@ sourceMappingURL=Application.map
var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

goog.provide('gremlin.Application');

goog.require('gremlin.domObserver.DomObserver');

goog.require('gremlin.gremlins.GremlinCollection');

goog.require('gremlin.conf.Configuration');

gremlin.Application = (function() {
  var GREMLIN_CONFIG_NAME;

  GREMLIN_CONFIG_NAME = 'gremlinConfig';

  function Application() {
    this._onNew = __bind(this._onNew, this);
    var userConfig, _ref;

    userConfig = (_ref = new gremlin.util.ElementData.ElementData(document.body).get(GREMLIN_CONFIG_NAME)) != null ? _ref : {};
    this.configuration = new gremlin.conf.Configuration(userConfig);
    this._observer = new gremlin.domObserver.DomObserver;
    this._coll = new gremlin.gremlins.GremlinCollection;
    this._observer.onNewElements = this._onNew;
  }

  Application.prototype._onNew = function(elArray, cssClass) {
    return this._coll.add(elArray);
  };

  Application.prototype.start = function() {
    return this._observer.observe();
  };

  Application.prototype.refresh = function() {
    return this._coll.process();
  };

  return Application;

})();
