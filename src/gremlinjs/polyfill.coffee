# string trim polyfill
if typeof String.prototype.trim isnt "function"
  String.prototype.trim = ->
    return this.replace(/^\s+|\s+$/g, '')