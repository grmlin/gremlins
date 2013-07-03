goog.provide 'GremlinJS'

goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'
goog.require 'gremlin.util.Debug'
goog.require 'gremlin.Application'
goog.require 'gremlin.conf.Configuration'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.extensions'


class GremlinJS
  gremlin.util.ready ->
    gremlin.Application.get().start()
    gremlin.util.Debug.log "GremlinJS up and running..."


  @options: gremlin.conf.Configuration.options

  @config: (option, value) ->
    gremlin.Application.get().config option, value

  @define: (name, initialize, instanceMembers, staticMembers) ->
    gremlin.gremlinDefinitions.Pool.getInstance().define name, initialize, instanceMembers, staticMembers

  #@extensions: gremlin.gremlinDefinitions.extensions

window.GremlinJS = GremlinJS

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS