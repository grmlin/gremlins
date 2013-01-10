helper            = require "./../helper.coffee"
GremlinCollection = require "./../gremlins/GremlinCollection.coffee"

class DomWalker
  @LEGACY_TAG_SELECTOR : "*"

  _className : null
  _elements  : null
  _isNative  : null

  constructor : (className, doWatch = no) ->
    @_className = className
    @_isNative = helper.isFunction document.getElementsByClassName
    @_elements = if @_isNative then document.getElementsByClassName(className) else document.getElementsByTagName(DomWalker.LEGACY_TAG_SELECTOR)

  _getElements : ->
    coll = new GremlinCollection

    if @_isNative
      coll.addList @_elements
    else
      for gremlin in @_elements
        coll.addGremlin(gremlin) if gremlin.className is @_className


    #console.log "Found #{coll.size()} gremlins in the dom"

    return coll

  getGremlinCollection : ->
    @_getElements()


module.exports = DomWalker