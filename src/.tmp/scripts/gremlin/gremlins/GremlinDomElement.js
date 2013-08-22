//@ sourceMappingURL=GremlinDomElement.map
var isModern;

goog.provide('gremlin.gremlins.GremlinDomElement');

goog.require('gremlin.util.FeatureDetector');

goog.require('gremlin.util.ElementData.ElementData');

goog.require('gremlin.util.Helper');

goog.require('gremlin.gremlins.GremlinFactory');

isModern = gremlin.util.FeatureDetector.hasGetClientRect;

gremlin.gremlins.GremlinDomElement = (function() {
  var CSS_CLASS_LOADING, CSS_CLASS_PENDING, CSS_CLASS_READY, DATA_LAZY, GREMLIN_LAZY_BUFFER;

  DATA_LAZY = "gremlinLazy";

  CSS_CLASS_LOADING = "gremlin-loading";

  CSS_CLASS_READY = 'gremlin-ready';

  CSS_CLASS_PENDING = 'gremlin-definition-pending';

  GREMLIN_LAZY_BUFFER = 300;

  GremlinDomElement.prototype._gremlinInstance = null;

  function GremlinDomElement(_el, _name) {
    this._el = _el;
    this._name = _name;
    this._data = new gremlin.util.ElementData.ElementData(this._el);
    this._isLazy = this._data.get(DATA_LAZY) === true ? true : false;
    this.isLazy = this._isLazy;
    this.name = this._name;
    this._triggeredPending = false;
    gremlin.util.Helper.addClass(this._el, CSS_CLASS_LOADING);
    GremlinJS.debug.registerGremlin(this);
    GremlinJS.emit(GremlinJS.ON_ELEMENT_FOUND, this._el);
  }

  GremlinDomElement.prototype.check = function() {
    if (this._isInViewport()) {
      return this._create();
    }
  };

  GremlinDomElement.prototype._isInViewport = function() {
    var box, clientHeight, distance;

    if (!(this._isLazy && isModern)) {
      return true;
    }
    clientHeight = document.documentElement.clientHeight;
    box = this._el.getBoundingClientRect();
    distance = box.top - clientHeight;
    return distance < GREMLIN_LAZY_BUFFER;
  };

  GremlinDomElement.prototype._create = function() {
    this._gremlinInstance = gremlin.gremlins.GremlinFactory.getInstance(this._name, this._el, this._data);
    if (this.hasGremlin()) {
      gremlin.util.Helper.removeClass(this._el, CSS_CLASS_LOADING);
      gremlin.util.Helper.removeClass(this._el, CSS_CLASS_PENDING);
      gremlin.util.Helper.addClass(this._el, CSS_CLASS_READY);
      return GremlinJS.emit(GremlinJS.ON_GREMLIN_LOADED, this._el);
    } else {
      if (!this._triggeredPending) {
        this._triggeredPending = true;
        gremlin.util.Helper.addClass(this._el, CSS_CLASS_PENDING);
        GremlinJS.debug.console.info("Gremlin <" + this._name + "> found in the dom, but there is no definition for it at the moment.");
        return GremlinJS.emit(GremlinJS.ON_DEFINITION_PENDING, this._el);
      }
    }
  };

  GremlinDomElement.prototype.hasGremlin = function() {
    return this._gremlinInstance !== null;
  };

  return GremlinDomElement;

})();
