polyfill      = require "./gremlinjs/polyfill.coffee"
LoaderPool    = require "./gremlinjs/loader/LoaderPool.coffee"
Gremlin       = require "./gremlinjs/creator/Gremlin.coffee"
helper        = require "./gremlinjs/helper.coffee"
extensions    = require "./gremlinjs/extensions/constants.coffee"
configuration = require "./gremlinjs/conf/Configuration.coffee"

module.exports =

# Gremlin creation
  Gremlin       :
    extend : Gremlin.extend
    create : Gremlin.extend
  # Loader creation
  Loader        :
    getLoader : LoaderPool.getInstance
  # shortcut to the helper module
  helper        : helper
  # GremlinJS configuration
  configuration :
    get : configuration.get
    set : configuration.set
  # Included GremlinJS extensions
  extensions    : extensions  
  