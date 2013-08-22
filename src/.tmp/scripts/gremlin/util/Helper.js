//@ sourceMappingURL=Helper.map
var __hasProp = {}.hasOwnProperty,
  __slice = [].slice;

goog.provide('gremlin.util.Helper');

gremlin.util.Helper = (function() {
  var mixin;

  function Helper() {}

  mixin = function(target, mixinObject) {
    var name, val;

    for (name in mixinObject) {
      if (!__hasProp.call(mixinObject, name)) continue;
      val = mixinObject[name];
      target[name] = val;
    }
    return target;
  };

  Helper.extend = function() {
    var key, obj, objects, target, value, _i, _len;

    target = arguments[0], objects = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
    for (_i = 0, _len = objects.length; _i < _len; _i++) {
      obj = objects[_i];
      for (key in obj) {
        value = obj[key];
        target[key] = value;
      }
    }
    return target;
  };

  Helper.mixin = function(targetClass, mixinObject) {
    return mixin(targetClass.prototype, mixinObject);
  };

  Helper.clone = function(obj) {
    var flags, key, newInstance;

    if ((obj == null) || typeof obj !== 'object') {
      return obj;
    }
    if (obj instanceof Date) {
      return new Date(obj.getTime());
    }
    if (obj instanceof RegExp) {
      flags = '';
      if (obj.global != null) {
        flags += 'g';
      }
      if (obj.ignoreCase != null) {
        flags += 'i';
      }
      if (obj.multiline != null) {
        flags += 'm';
      }
      if (obj.sticky != null) {
        flags += 'y';
      }
      return new RegExp(obj.source, flags);
    }
    newInstance = new obj.constructor();
    for (key in obj) {
      newInstance[key] = gremlin.util.Helper.clone(obj[key]);
    }
    return newInstance;
  };

  Helper.hasClass = function(element, className) {
    return element.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
  };

  Helper.addClass = function(element, className) {
    if (!gremlin.util.Helper.hasClass(element, className)) {
      element.className += " " + className;
    }
    return element.className = element.className.trim();
  };

  Helper.removeClass = function(element, className) {
    var reg;

    if (gremlin.util.Helper.hasClass(element, className)) {
      reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
      element.className = element.className.replace(reg, ' ');
      return element.className = element.className.trim();
    }
  };

  Helper.addStyleSheet = function(cssText) {
    var head, style;

    head = document.getElementsByTagName('head')[0];
    style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) {
      style.styleSheet.cssText = cssText;
    } else {
      style.appendChild(document.createTextNode(cssText));
    }
    return head.appendChild(style);
  };

  return Helper;

})();
