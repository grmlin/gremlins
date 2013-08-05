goog.provide 'GremlinJS'

goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'          
goog.require 'gremlin.event.Event'
goog.require 'gremlin.conf.Configuration'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.util.Debug'
goog.require 'gremlin.Application'
goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.ExtensionRegistry' 

GremlinJS = do ->
  # The globally available `GremlinJS` namespace
  # 
  # @example how to access GremlinJS
  #   var localCopy = window.GremlinJS;
  class GremlinAdapter extends gremlin.event.Event
    app = null
  
    ON_ELEMENT_FOUND: 'elementfound'
    ON_DEFINITION_PENDING : 'definitionpending'
    ON_GREMLIN_LOADED : 'gremlinloaded'
    
    constructor : ->
      super
      @debug = new gremlin.util.Debug false
    
    define: (name, constructor, instanceMembers, staticMembers) ->
      Gremlin = gremlin.gremlinDefinitions.Pool.getInstance().define name, constructor, instanceMembers, staticMembers
      app?.refresh()
      Gremlin
    
    #derive: (parentName, name, constructor, instanceMembers, staticMembers) ->
      
    add : (name, GremlinClass) ->
      Gremlin = gremlin.gremlinDefinitions.Pool.getInstance().addClass name, GremlinClass
      app?.refresh()
      Gremlin

    Gremlin : gremlin.gremlinDefinitions.AbstractGremlin
       
    # @property [gremlin.util.Helper] The person name
    # @see gremlin.util.Helper
    Helper: gremlin.util.Helper
    
    registerExtension: (Extension) ->
      gremlin.gremlinDefinitions.ExtensionRegistry.addExtension Extension
  
      
      
  g = new GremlinAdapter
  
  gremlin.util.ready ->
    app = new gremlin.Application()
    isDebug = app.configuration.get gremlin.conf.Configuration.options.DEBUG
    g.debug = new gremlin.util.Debug isDebug if isDebug

    app.start()
    g.debug.console.log "GremlinJS up and running..." 
    
  return g

window.GremlinJS = GremlinJS
window.G = window.GremlinJS if window.G is undefined

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS 