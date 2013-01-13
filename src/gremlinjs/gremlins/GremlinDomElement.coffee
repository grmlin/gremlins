helper      = require "./../helper.coffee"
ElementData = require "./ElementData/ElementData.coffee"
Factory     = require "./GremlinFactory.coffee"

isModern = document.body.getBoundingClientRect isnt undefined

class GremlinDomElement
# static
  @DATA_GREMLIN_NAME_ATTRIBUTE : "data-gremlin-name"
  @GREMLIN_NAME_SEPARATOR      : ","
  @GREMLIN_LOADING_CLASS       : "gremlin-loading"
  @GREMLIN_READY_CLASS         : "gremlin-ready"
  @GREMLIN_LAZY_BUFFER         : 100
  # members
  _el                          : null
  _data                        : null
  _cls                         : null
  _ns                          : null
  _gremlins                    : null
  
  constructor : (el, cssClass, namespace) ->
    @_el = el
    @_cls = cssClass
    @_ns = namespace
    @_data = new ElementData(@_el)

  _loadGremlin : (name) ->
    helper.removeClass @_el, @_cls
    helper.addClass @_el, GremlinDomElement.GREMLIN_LOADING_CLASS

    name = @_ns + name.trim()

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

  isLazy : ->
    @_data.get("lazyLoad")

  isInViewport : (scrollTop) ->
    if isModern
      clientHeight = document.documentElement.clientHeight
      box = @_el.getBoundingClientRect()
      distance = box.top - clientHeight;
    
    else
      distance = 0

    distance < GremlinDomElement.GREMLIN_LAZY_BUFFER
    
module.exports = GremlinDomElement