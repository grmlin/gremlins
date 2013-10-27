goog.provide 'util.polyfill'

# string trim polyfill
unless typeof String.prototype.trim is "function"
  String.prototype.trim = ->
    return this.replace(/^\s+|\s+$/g, '')

unless Array::filter
  Array::filter = (fun) ->
    "use strict"
    throw new TypeError()  unless this?
    t = Object(this)
    len = t.length >>> 0
    throw new TypeError()  unless typeof fun is "function"
    res = []
    thisp = arguments[1]
    i = 0

    while i < len
      if i of t
        val = t[i]
        res.push val  if fun.call(thisp, val, i, t)
      i++
    res

`if(!Array.isArray) {
  Array.isArray = function (vArg) {
    return Object.prototype.toString.call(vArg) === "[object Array]";
  };
}`

`if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function (searchElement /*, fromIndex */ ) {
    'use strict';
    if (this == null) {
      throw new TypeError();
    }
    var n, k, t = Object(this),
        len = t.length >>> 0;

    if (len === 0) {
      return -1;
    }
    n = 0;
    if (arguments.length > 1) {
      n = Number(arguments[1]);
      if (n != n) { // shortcut for verifying if it's NaN
        n = 0;
      } else if (n != 0 && n != Infinity && n != -Infinity) {
        n = (n > 0 || -1) * Math.floor(Math.abs(n));
      }
    }
    if (n >= len) {
      return -1;
    }
    for (k = n >= 0 ? n : Math.max(len - Math.abs(n), 0); k < len; k++) {
      if (k in t && t[k] === searchElement) {
        return k;
      }
    }
    return -1;
  };
}`