goog.provide 'gremlin.util.polyfill'

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