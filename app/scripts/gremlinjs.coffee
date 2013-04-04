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
goog.provide 'gremlinjs.App'

gremlinjs.App = ->