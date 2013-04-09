AbstractExtension = require "./AbstractExtension.coffee"
requirejsEnv      = require "../conf/requirejsEnv.coffee"
helper            = require "../helper.coffee"

EXTENSIONS_PATH         = "#{requirejsEnv.GREMLINJS_PATH}gremlinjsExtensions/"
EXTENSION_INDEX_FILE    = "/index"
  
getExtension = (name, gremlin, cb) ->
  if typeof name is "string"
    src = "#{EXTENSIONS_PATH}#{name}#{EXTENSION_INDEX_FILE}"
    window.require [src], (extensionMixin) ->
      class Extension extends AbstractExtension
      helper.mixin(Extension, extensionMixin)
      ext = new Extension gremlin
      cb.call null, ext
  else
    throw new TypeError "GremlinJS extension <#{name}> unavailable"

class Factory
  create : (name, gremlin, cb) ->
    # processing extension
    getExtension name, gremlin, (e)=>
      e.onReady = =>
        cb.call null, gremlin

      e.initialize()

module.exports = new Factory