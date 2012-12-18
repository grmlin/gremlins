extensionTypes = require "./../extensions/constants.coffee"

getExtension = (name, gremlin) ->
  ext = null
  switch name
    when extensionTypes.JQUERY
      E = require "./../extensions/JQuery.coffee"
      ext = new E "jquery", gremlin
    when extensionTypes.ZEPTO
      E = require "./../extensions/JQuery.coffee"
      ext = new E "zepto", gremlin
    else
      throw new TypeError "GremlinJS extension <#{name}> unavailable"
      
  return ext
    
class Factory
  create: (gremlin, cb) ->
    # processing extensions
    extensions = []
    available  = gremlin.__settings.extensions
    length     = available.length
    
    for name in available
      do (name) ->
        e = getExtension name, gremlin
        e.onLoad = =>
          extensions.push e
          if extensions.length is length
            cb.call null, gremlin

        e.load()
        
module.exports = new Factory