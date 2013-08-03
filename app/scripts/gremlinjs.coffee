goog.provide 'GremlinJS'

#goog.require 'ondomready'
goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'
goog.require 'gremlin.conf.Configuration'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.util.Debug'
goog.require 'gremlin.Application'
goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.ExtensionRegistry' 

# The globally available `GremlinJS` namespace
# 
# @example how to access GremlinJS
#   var localCopy = window.GremlinJS;
class GremlinJS
  app = null

  gremlin.util.ready ->
    app = new gremlin.Application()
    isDebug = app.configuration.get gremlin.conf.Configuration.options.DEBUG
    GremlinJS.debug = new gremlin.util.Debug isDebug if isDebug 

    app.start()
    GremlinJS.debug.console.log "GremlinJS up and running..."

  # Instance of {gremlin.util.Debug}
  # Used for console logging and gremlin highlighting in the document. With activated debugging, all gremlins
  # will be highlighted visually by GremlinJS, listing components that are ready, pending or broken.
  #
  # @example Enable debug mode
  @debug: new gremlin.util.Debug false
  
  # @property [Stringz]
  debug: 'moo'
  
   
  
  @define: (name, constructor, instanceMembers, staticMembers) ->
    Gremlin = gremlin.gremlinDefinitions.Pool.getInstance().define name, constructor, instanceMembers, staticMembers
    app?.refresh()
    Gremlin
  
  #@derive: (parentName, name, constructor, instanceMembers, staticMembers) ->
    
  @add : (name, GremlinClass) ->
    Gremlin = gremlin.gremlinDefinitions.Pool.getInstance().addClass name, GremlinClass
    app?.refresh()
    Gremlin    

  @Gremlin : gremlin.gremlinDefinitions.AbstractGremlin
     
  # @property [gremlin.util.Helper] The person name
  # @see gremlin.util.Helper
  @Helper: gremlin.util.Helper
  
  @registerExtension: (Extension) ->
    gremlin.gremlinDefinitions.ExtensionRegistry.addExtension Extension

window.GremlinJS = GremlinJS
window.G = GremlinJS if window.G is undefined

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS