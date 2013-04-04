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
goog.provide 'Gremlinjs'

goog.require 'gremlin.helper'

Gremlinjs =
  create: ->

  watch: (cssClassName) ->
    console.log "searching for gremlins now, using selector '#{cssClassName}'"

window.Gremlinjs = Gremlinjs

if typeof window.define is "function" and window.define.amd
  define "gremlinjs", [], ->
    Gremlinjs