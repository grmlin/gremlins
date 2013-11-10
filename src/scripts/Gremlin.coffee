goog.provide 'Gremlin'

goog.require 'util.polyfill'
goog.require 'util.ready'
goog.require 'EventDispatcher'
goog.require 'conf.Configuration'
goog.require 'util.Helper'
goog.require 'util.Debug'
goog.require 'packages.Package'
goog.require 'modules.Module'
goog.require 'Application'
goog.require 'gremlinDefinitions.Gizmo'
goog.require 'gremlinDefinitions.Pool'

Gremlin = do ->
  app = null

  class GremlinAdapter extends EventDispatcher

    ON_ELEMENT_FOUND: 'elementfound'
    ON_DEFINITION_PENDING: 'definitionpending'
    ON_GREMLIN_LOADED: 'gremlinloaded'

    constructor: ->
      super
      @debug = new util.Debug false

    add: (name, GremlinClass) ->
      GremlinClass = gremlinDefinitions.Pool.getInstance().addClass name, GremlinClass
      app?.refresh()
      GremlinClass

    Gizmo: gremlinDefinitions.Gizmo

    Helper: util.Helper
    Module: modules.Module
    Package: packages.Package

  g = new GremlinAdapter

  util.ready ->
    app = new Application()
    isDebug = app.configuration.get conf.Configuration.options.DEBUG
    g.debug = new util.Debug isDebug if isDebug

    app.start()
    g.debug.console.log "gremlin.js up and running..."

  return g

window.Gremlin = Gremlin
window.G = window.Gremlin if window.G is undefined

if typeof window.define is "function" and window.define.amd
  define "Gremlin", [], ->
    Gremlin