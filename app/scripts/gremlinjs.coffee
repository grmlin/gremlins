goog.provide 'GremlinJS'

#goog.require 'ondomready'
goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'
goog.require 'gremlin.conf.Configuration'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.util.Debug'
goog.require 'gremlin.Application'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.ExtensionRegistry' 

# include the default extensions 
goog.require 'extensions'

class GremlinJS
  app = null

  gremlin.util.ready ->
    app = new gremlin.Application()
    GremlinJS.debug = new gremlin.util.Debug app.configuration.get(gremlin.conf.Configuration.options.DEBUG)

    app.start()
    GremlinJS.debug.console.log "GremlinJS up and running..."


  #@options: gremlin.conf.Configuration.options

  @debug: new gremlin.util.Debug false

  @define: (name, constructor, instanceMembers, staticMembers) ->
    GremlinClass = gremlin.gremlinDefinitions.Pool.getInstance().define name, constructor, instanceMembers, staticMembers
    app?.refresh()
    GremlinClass

  @Helper: gremlin.util.Helper
  
  @registerExtension: (Extension) ->
    gremlin.gremlinDefinitions.ExtensionRegistry.addExtension Extension

window.GremlinJS = GremlinJS

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS