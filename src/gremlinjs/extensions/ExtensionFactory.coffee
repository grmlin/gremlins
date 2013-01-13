extensionTypes = require "./../extensions/constants.coffee"

getExtension = (name, gremlin, cb) ->
  if typeof name is "string"
    base = requirejs.s.contexts._.config.baseUrl
    grmlinSrc = requirejs.s.contexts._.config.paths.gremlinjs.replace("gremlin.min","")
    src = "#{grmlinSrc}gremlinExtensions/#{name}/index"
    window.require [src], (E) ->
      ext = new E gremlin
      cb.call null, ext
  else
    throw new TypeError "GremlinJS extension <#{name}> unavailable"

class Factory
  create : (gremlin, cb) ->
    # processing extensions
    extensions = []
    available  = gremlin.__settings.extensions
    length     = available.length

    for name in available
      do (name) ->
        getExtension name, gremlin, (e)=>
          e.onLoad = =>
            extensions.push e
            if extensions.length is length
              cb.call null, gremlin

          e.load()

module.exports = new Factory