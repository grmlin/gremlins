Hound             = require "./Hound.coffee"
GremlinDomElement = require "./GremlinDomElement.coffee"
helper            = require "./../helper.coffee"


class Loader
  

  _hound           : null
  _namespace       : null
  _gremlinCssClass : null

  constructor : (@_namespace = "", @_gremlinCssClass = "gremlin") ->
    @_hound = new Hound @_gremlinCssClass

  _processElement: (element) ->
    gElement = new GremlinDomElement element, @_gremlinCssClass, @_namespace
    gElement.load() # TODO lazy loading
    
  load : () ->
    @_processElement element for element in @_hound.seek().toArray()
      

  resetLazyGremlins : ->


module.exports = Loader
    