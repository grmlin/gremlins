goog.provide 'gremlins.GremlinDomElement'

goog.require 'util.FeatureDetector'
goog.require 'util.ElementData.ElementData'
goog.require 'util.Helper'
goog.require 'gremlins.GremlinFactory'

#helper      = require "./../helper.coffee"
#ElementData = require "././ElementData.coffee"
#Factory     = require "./GremlinFactory.coffee"

isModern = util.FeatureDetector.hasGetClientRect

class gremlins.GremlinDomElement
  DATA_LAZY = "gremlinLazy"
  CSS_CLASS_LOADING = "gremlin-loading"
  CSS_CLASS_READY = 'gremlin-ready'
  CSS_CLASS_PENDING = 'gremlin-definition-pending'

  GREMLIN_LAZY_BUFFER = 300

  _gremlinInstance : null

  constructor : (@_el, @_name) ->
    @_data = new util.ElementData.ElementData @_el
    @_isLazy = if @_data.get(DATA_LAZY) is yes then yes else no
    @isLazy = @_isLazy
    @name = @_name
    @_triggeredPending = no
    util.Helper.addClass @_el, CSS_CLASS_LOADING
    gremlin.debug.registerGremlin @
    gremlin.emit gremlin.ON_ELEMENT_FOUND, @_el

  check : ->
    @_create() if @_isInViewport()


  _isInViewport : ->
    return yes unless @_isLazy and isModern

    clientHeight = document.documentElement.clientHeight
    box = @_el.getBoundingClientRect()
    distance = box.top - clientHeight;
    distance < GREMLIN_LAZY_BUFFER

  _create : ->
    @_gremlinInstance = gremlins.GremlinFactory.getInstance @_name, @_el, @_data
    if @hasGremlin()
      util.Helper.removeClass @_el, CSS_CLASS_LOADING
      util.Helper.removeClass @_el, CSS_CLASS_PENDING
      util.Helper.addClass @_el, CSS_CLASS_READY
      gremlin.emit gremlin.ON_GREMLIN_LOADED, @_el

    else
      unless @_triggeredPending
        @_triggeredPending = yes
        util.Helper.addClass @_el, CSS_CLASS_PENDING
        gremlin.debug.console.info "Gremlin <#{@_name}> found in the dom, but there is no definition for it at the moment."
        gremlin.emit gremlin.ON_DEFINITION_PENDING, @_el

  hasGremlin: -> 
    @_gremlinInstance isnt null
