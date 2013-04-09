###polyfill        = require "./gremlinjs/polyfill.coffee"
AbstractGremlin = require "./gremlinjs/gremlins/AbstractGremlin.coffee"
LoaderPool      = require "./gremlinjs/loader/LoaderPool.coffee"
helper          = require "./gremlinjs/helper.coffee"
extensions      = require "./gremlinjs/extensions/extensionTypes.coffee"
configuration   = require "./gremlinjs/conf/configuration.coffee"
module.exports =
  # Gremlin creation
  AbstractGremlin :
    extend : AbstractGremlin.extend
  # GremlinJS configuration
  configuration   : configuration
  # Included GremlinJS extensions
  extensionTypes  : extensions
  # Loader 
  load            : LoaderPool.load
  # shortcut to the helper module
  helper          : helper     
  
  
###
goog.provide 'GremlinJS'

goog.require 'gremlin.util.ready'
goog.require 'gremlin.Application'
goog.require 'gremlin.conf.Configuration'


class GremlinJS
  gremlin.util.ready ->
    console.log 'dom ready'
    gremlin.Application.get().start()

  @options : gremlin.conf.Configuration.options

  @config : (option, value) ->
    gremlin.Application.get().config option, value

  @gremlin : (name, definition) ->


window.GremlinJS = GremlinJS

if typeof window.define is "function" and window.define.amd
  define "GremlinJS", [], ->
    GremlinJS