//@ sourceMappingURL=ElementData.map
var __hasProp = {}.hasOwnProperty;

goog.provide('gremlin.util.ElementData.ElementData');

goog.require('gremlin.util.ElementData.DataValue');

goog.require('gremlin.util.Helper');

gremlin.util.ElementData.ElementData = (function() {
  var camelize, getData;

  camelize = function(string) {
    return string.toLowerCase().replace(/-(.)/g, function(match, group1) {
      return group1.toUpperCase();
    });
  };

  getData = function(element) {
    var data, dataVal, key, resultObj, value;

    resultObj = {};
    if (element.dataset !== void 0) {
      data = element.dataset;
    } else {
      data = {};
      [].filter.call(element.attributes, function(at) {
        var isDataAttr;

        isDataAttr = /^data-/.test(at.name);
        if (isDataAttr) {
          data[camelize(at.name.substring(5))] = element.getAttribute(at.name);
        }
        return isDataAttr;
      });
    }
    for (key in data) {
      if (!__hasProp.call(data, key)) continue;
      value = data[key];
      dataVal = new gremlin.util.ElementData.DataValue(value);
      resultObj[key] = dataVal.parse();
    }
    return resultObj;
  };

  function ElementData(_el) {
    this._el = _el;
    this._obj = getData(this._el);
  }

  ElementData.prototype.get = function(key) {
    var _ref;

    return (_ref = this._obj[key]) != null ? _ref : null;
  };

  ElementData.prototype.toObject = function() {
    return gremlin.util.Helper.clone(this._obj);
  };

  return ElementData;

})();
