Loader = require "./Loader.coffee"

cache = {}

pool =
  DEFAULT_CSS_CLASS : 'gremlin'

  load : (cssClass = pool.DEFAULT_CSS_CLASS ) ->
    pool._getInstance(cssClass).load()
  
  _getInstance : (cssClass) ->
    key = cssClass
    cache[key] = new Loader(cssClass) if cache[key] is undefined
    return cache[key]
    
module.exports = pool
  

