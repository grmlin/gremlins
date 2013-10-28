goog.provide 'Gremlin'

goog.require 'util.polyfill'
goog.require 'util.ready'
goog.require 'EventDispatcher'
goog.require 'conf.Configuration'
goog.require 'util.Helper'
goog.require 'util.Debug'
goog.require 'namespace'
goog.require 'packages.Package'
goog.require 'modules.Module'
goog.require 'Application'
goog.require 'gremlinDefinitions.Gizmo'
goog.require 'gremlinDefinitions.Pool'

Gremlin = do ->
  app = null

  # The globally available `GremlinJS` namespace
  # 
  # @example how to access GremlinJS
  #   var localCopy = window.GremlinJS;
  class GremlinAdapter extends EventDispatcher
  
    ON_ELEMENT_FOUND: 'elementfound'
    ON_DEFINITION_PENDING : 'definitionpending'
    ON_GREMLIN_LOADED : 'gremlinloaded'
    
    constructor : ->
      super
      @debug = new util.Debug false

    add : (name, GremlinClass) ->
      GremlinClass = gremlinDefinitions.Pool.getInstance().addClass name, GremlinClass
      app?.refresh()
      GremlinClass

    define: (name, constructor, instanceMembers, staticMembers) ->
      GremlinClass = gremlinDefinitions.Pool.getInstance().define name, constructor, instanceMembers, staticMembers
      app?.refresh()
      GremlinClass

    #derive: (parentName, name, constructor, instanceMembers, staticMembers) ->

    Gizmo : gremlinDefinitions.Gizmo
       
    # @property [util.Helper] The person name
    # @see util.Helper
    Helper: util.Helper

    namespace: namespace
    ns : namespace
    Package: packages.Package

    Module: modules.Module

      
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