helper  = require "./../helper.coffee"
Factory = require "./GremlinFactory.coffee"

# string trim polyfill
if not helper.isFunction String.prototype.trim
  String.prototype.trim = ->
    return this.replace(/^\s+|\s+$/g, '')

class GremlinDomElement
  # static
  @DATA_GREMLIN_NAME_ATTRIBUTE : "data-gremlin-name"
  @GREMLIN_NAME_SEPARATOR      : ","
  @GREMLIN_LOADING_CLASS       : "gremlin-loading"
  @GREMLIN_READY_CLASS         : "gremlin-ready"
  # members
  _el                          : null
  _cls                         : null
  _ns                          : null

  constructor : (el, cssClass, namespace) ->
    @_el = el
    @_cls = cssClass
    @_ns = namespace

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
    Factory.create name, @_el, (gremlin) =>
      # - Add the gremlin to the stack
      # - listen to the content change event of each gremlin and rescan the gremlins view for gremlins when it fires
      # - gremlin is loaded now, remove the loading css class
      #allGremlins.push(gremlin)
      #gremlin.bind gremlin.NOTIFICATION, (type, data) =>
      #  @load(gremlin.view) if data.interest is gremlin.CONTENT_CHANGED
      helper.removeClass @_el, GremlinDomElement.GREMLIN_LOADING_CLASS
      helper.addClass @_el, GremlinDomElement.GREMLIN_READY_CLASS

      true

  load : ->
    names = @_el.getAttribute GremlinDomElement.DATA_GREMLIN_NAME_ATTRIBUTE

    @_loadGremlin name for name in names.split(GremlinDomElement.GREMLIN_NAME_SEPARATOR)

module.exports = GremlinDomElement