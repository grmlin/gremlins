goog.provide 'gremlin.Application'
goog.require 'gremlin.domObserver.DomObserver'
goog.require 'gremlin.gremlins.GremlinCollection'
goog.require 'gremlin.conf.Configuration'

class gremlin.Application
  GREMLIN_CONFIG_NAME = 'gremlinConfig'

  constructor : ->
    userConfig = new gremlin.util.ElementData.ElementData(document.body).get(GREMLIN_CONFIG_NAME) ? {}
    @configuration = new gremlin.conf.Configuration userConfig
    @_observer = new gremlin.domObserver.DomObserver
    @_coll = new gremlin.gremlins.GremlinCollection

    @_observer.onNewElements = @_onNew

  _onNew : (elArray, cssClass) =>
    #console.log "found #{elArray.length} new gremlins in the dom"
    #console.dir elArray
    @_coll.add elArray

  start : ->
    @_observer.observe()

  refresh : ->
    @_coll.process()

