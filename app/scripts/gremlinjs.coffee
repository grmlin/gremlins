goog.provide 'GremlinJS'

goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'
goog.require 'gremlin.conf.Configuration'
goog.require 'gremlin.util.Debug'
goog.require 'gremlin.Application'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.extensions'


class GremlinJS
  gremlin.util.ready ->
    gremlin.Application.get().start()
    GremlinJS.debug.console.log "GremlinJS up and running..."


  @options: gremlin.conf.Configuration.options

  @config: gremlin.conf.Configuration.get()

  @debug: new gremlin.util.Debug GremlinJS.config.get(gremlin.conf.Configuration.options.DEBUG)

  @define: (name, initialize, instanceMembers, staticMembers) ->
    gremlin.gremlinDefinitions.Pool.getInstance().define name, initialize, instanceMembers, staticMembers
    gremlin.Application.get().refresh()


  @extensions: gremlin.gremlinDefinitions.extensions

window.GremlinJS = GremlinJS

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS