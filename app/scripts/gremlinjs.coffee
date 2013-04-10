goog.provide 'GremlinJS'

goog.require 'gremlin.util.polyfill'
goog.require 'gremlin.util.ready'
goog.require 'gremlin.Application'
goog.require 'gremlin.conf.Configuration'


class GremlinJS
  gremlin.util.ready ->
    gremlin.Application.get().start()

  @options : gremlin.conf.Configuration.options

  @config : (option, value) ->
    gremlin.Application.get().config option, value

  @gremlin : (name, definition) ->


window.GremlinJS = GremlinJS

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS