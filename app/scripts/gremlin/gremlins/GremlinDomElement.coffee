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


  # static
  @DATA_GREMLIN_NAME_ATTRIBUTE : "data-gremlin-name"
  @GREMLIN_LOADING_CLASS : "gremlin-loading"
  @GREMLIN_READY_CLASS : "gremlin-ready"
  @GREMLIN_LAZY_BUFFER : 100
  # members
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
    distance < GremlinDomElement.GREMLIN_LAZY_BUFFER

  _create : ->
    @_gremlinInstance = gremlin.gremlins.GremlinFactory.getInstance @_name, @_el, @_data 
    @_gremlinInstance?.initialize()
 
  hasGremlin: -> 
    hasGremlin = @_gremlinInstance isnt null
    if hasGremlin
      console.log "Gremlin for #{@_name} instantiated", @_gremlinInstance
    hasGremlin
    
  _loadGremlin : (name) ->
    helper.removeClass @_el, @_cls
    helper.addClass @_el, GremlinDomElement.GREMLIN_LOADING_CLASS

    name = name.trim()

    if (helper.isString(name) and not helper.isEmptyString(name))
      @_createGremlin(name)

    else
      throw new Error("Can't create a gremlin without a classname defined for it.")

  _createGremlin : (name) ->
    # Call the factory and request a new gremlin
    Factory.getInstance name, @_el, @_data.toObject(), (gremlin) =>
      # - Add the gremlin to the stack
      # - listen to the content change event of each gremlin and rescan the gremlins view for gremlins when it fires
      # - gremlin is loaded now, remove the loading css class
      #allGremlins.push(gremlin)
      @_gremlins.push gremlin
      #gremlin.bind gremlin.NOTIFICATION, (type, data) =>
      #  @load(gremlin.view) if data.interest is gremlin.CONTENT_CHANGED
      helper.removeClass @_el, GremlinDomElement.GREMLIN_LOADING_CLASS
      helper.addClass @_el, GremlinDomElement.GREMLIN_READY_CLASS

      true

  load : ->
    if @_gremlins is null
      @_gremlins = []
      names = @_el.getAttribute GremlinDomElement.DATA_GREMLIN_NAME_ATTRIBUTE
      @_loadGremlin name for name in names.split(GremlinDomElement.GREMLIN_NAME_SEPARATOR)

    