LoaderPool = require "./gremlinjs/loader/LoaderPool.coffee"
Gremlin    = require "./gremlinjs/creator/Gremlin.coffee"
helper     = require "./gremlinjs/helper.coffee"
extensions = require "./gremlinjs/extensions/constants.coffee"

module.exports =

  # Gremlin creation
  Gremlin    :
    extend : Gremlin.extend
    create : Gremlin.extend
  # Loader creation
  Loader     :
    getLoader : LoaderPool.getInstance
  # Available extensions
  extensions : extensions  
  