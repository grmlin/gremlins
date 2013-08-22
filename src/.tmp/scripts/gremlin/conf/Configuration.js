//@ sourceMappingURL=Configuration.map
goog.provide('gremlin.conf.Configuration');

goog.require('gremlin.util.Helper');

goog.require('gremlin.event.Event');

gremlin.conf.Configuration = (function() {
  var defaultOptions, instance;

  instance = null;

  defaultOptions = {
    debug: false
  };

  function Configuration(customOptions) {
    this._options = gremlin.util.Helper.extend({}, defaultOptions, customOptions);
  }

  Configuration.prototype.get = function(key) {
    var _ref;

    return (_ref = this._options[key]) != null ? _ref : null;
  };

  Configuration.options = {
    DEBUG: 'debug',
    AUTOLOAD: 'autoload'
  };

  return Configuration;

})();
