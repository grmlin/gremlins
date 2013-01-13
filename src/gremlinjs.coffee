polyfill        = require "./gremlinjs/polyfill.coffee"
AbstractGremlin = require "./gremlinjs/gremlins/AbstractGremlin.coffee"
LoaderPool      = require "./gremlinjs/loader/LoaderPool.coffee"
helper          = require "./gremlinjs/helper.coffee"
extensions      = require "./gremlinjs/extensions/extensionTypes.coffee"
configuration   = require "./gremlinjs/conf/Configuration.coffee"

module.exports =
  # Gremlin creation
  AbstractGremlin :
    extend : AbstractGremlin.extend
  # GremlinJS configuration
  configuration   :
    get : configuration.get
    set : configuration.set
  # Included GremlinJS extensions
  extensionTypes  : extensions
  # Loader creation
  getLoader       : LoaderPool.getInstance
  # shortcut to the helper module
  helper          : helper