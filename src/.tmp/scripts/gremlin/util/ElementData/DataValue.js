//@ sourceMappingURL=DataValue.map
goog.provide('gremlin.util.ElementData.DataValue');

gremlin.util.ElementData.DataValue = (function() {
  var rbrace;

  rbrace = /(?:\{[\s\S]*\}|\[[\s\S]*\])$/;

  function DataValue(_dataString) {
    this._dataString = _dataString;
  }

  DataValue.prototype.parse = function() {
    var data, e, result;

    data = this._dataString;
    result = this._dataString;
    if (typeof this._dataString === "string") {
      try {
        if (data === "true") {
          result = true;
        } else if (data === "false") {
          result = false;
        } else if (data === "null") {
          result = null;
        } else if (+data + "" === data) {
          result = +data;
        } else {
          result = rbrace.test(data) ? JSON.parse(data) : data;
        }
      } catch (_error) {
        e = _error;
      }
    }
    return result;
  };

  return DataValue;

})();
