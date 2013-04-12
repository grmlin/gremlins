goog.provide 'gremlin.gremlins.GremlinDomElement'
goog.require 'gremlin.util.FeatureDetector'
goog.require 'gremlin.util.ElementData.ElementData'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.gremlins.GremlinFactory'

#helper      = require "./../helper.coffee"
#ElementData = require "././ElementData.coffee"
#Factory     = require "./GremlinFactory.coffee"

isModern = gremlin.util.FeatureDetector.hasGetClientRect

class gremlin.gremlins.GremlinDomElement
  DATA_LAZY = "gremlinLazy"
  CSS_CLASS_LOADING = "gremlin-loading"
  CSS_CLASS_READY = 'gremlin-ready'
  GREMLIN_LAZY_BUFFER = 300

  _gremlinInstance : null

  constructor : (@_el, @_name) ->
    @_data = new gremlin.util.ElementData.ElementData @_el
    @_isLazy = if @_data.get(DATA_LAZY) is yes then yes else no
    gremlin.util.Helper.addClass @_el, CSS_CLASS_LOADING

  check : ->
    @_create() if @_isInViewport()
      
  _isInViewport : ->
    return yes unless @_isLazy and isModern

    clientHeight = document.documentElement.clientHeight
    box = @_el.getBoundingClientRect()
    distance = box.top - clientHeight;
    distance < GREMLIN_LAZY_BUFFER

  _create : ->
    @_gremlinInstance = gremlin.gremlins.GremlinFactory.getInstance @_name, @_el, @_data 
    if @hasGremlin()
      @_gremlinInstance.initialize()
      gremlin.util.Helper.removeClass @_el, CSS_CLASS_LOADING
      gremlin.util.Helper.addClass @_el, CSS_CLASS_READY

  hasGremlin: -> 
    @_gremlinInstance isnt null
