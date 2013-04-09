goog.provide 'gremlin.Application'
goog.require 'gremlin.domObserver.DomObserver'
goog.require 'gremlin.conf.Configuration'

class gremlin.Application
  instance = null

  class Application
    _observer: null
    constructor: ->
      @_observer = new gremlin.domObserver.DomObserver gremlin.conf.Configuration.gremlinClassname
      @_observer.onNewElements = @_onNew

    _onNew: (elArray) =>
      console.log "found #{elArray.length} new elements for .#{@cssClassName}"
      el.className = el.className.replace(gremlin.conf.Configuration.gremlinClassname, "") for el in elArray

    start: ->
      @_observer.observe()

  @get: () ->
    instance ?= new Application

