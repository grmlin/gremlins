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
  CSS_CLASS_PENDING = 'gremlin-definition-pending'

  GREMLIN_LAZY_BUFFER = 300

  _gremlinInstance : null

  constructor : (@_el, @_name) ->
    @_data = new gremlin.util.ElementData.ElementData @_el
    @_isLazy = if @_data.get(DATA_LAZY) is yes then yes else no
    @isLazy = @_isLazy
    @name = @_name
    @_triggeredPending = no
    gremlin.util.Helper.addClass @_el, CSS_CLASS_LOADING
    GremlinJS.debug.registerGremlin @
    GremlinJS.emit GremlinJS.ON_ELEMENT_FOUND, @_el

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
      gremlin.util.Helper.removeClass @_el, CSS_CLASS_LOADING
      gremlin.util.Helper.removeClass @_el, CSS_CLASS_PENDING
      gremlin.util.Helper.addClass @_el, CSS_CLASS_READY
      GremlinJS.emit GremlinJS.ON_GREMLIN_LOADED, @_el

    else
      unless @_triggeredPending
        @_triggeredPending = yes
        gremlin.util.Helper.addClass @_el, CSS_CLASS_PENDING
        GremlinJS.debug.console.info "Gremlin <#{@_name}> found in the dom, but there is no definition for it at the moment." 
        GremlinJS.emit GremlinJS.ON_DEFINITION_PENDING, @_el

  hasGremlin: -> 
    @_gremlinInstance isnt null
