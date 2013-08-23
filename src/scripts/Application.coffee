goog.provide 'Application'

goog.require 'domObserver.DomObserver'
goog.require 'gremlins.GremlinCollection'
goog.require 'conf.Configuration'

class Application
  GREMLIN_CONFIG_NAME = 'gremlinConfig'

  constructor : ->
    userConfig = new util.ElementData.ElementData(document.body).get(GREMLIN_CONFIG_NAME) ? {}
    @configuration = new conf.Configuration userConfig
    @_observer = new domObserver.DomObserver
    @_coll = new gremlins.GremlinCollection

    @_observer.onNewElements = @_onNew

  _onNew : (elArray, cssClass) =>
    #console.log "found #{elArray.length} new gremlins in the dom"
    #console.dir elArray
    @_coll.add elArray

  start : ->
    @_observer.observe()

  refresh : ->
    @_coll.process()

