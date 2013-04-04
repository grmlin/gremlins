#
# #GremlinJS - `gremlinjs/gremlins/GremlinFactory`
#
# Factory singleton, that loads gremlin classes using *requirejs* and instantiates them

GID_ATTR       = 'data-gid'
TRAILING_SLASH = '/'

helper            = require "./../helper.coffee"
ElementData       = require "./ElementData/ElementData.coffee"
ExtensionFactory  = require "./../extensions/ExtensionFactory.coffee"
AbstractExtension = require "./../extensions/AbstractExtension.coffee"
configuration     = require "./../conf/configuration.coffee"

# defininge the GremlinFactory module for requirejs
# A unique id counter used for gremlin instantiation
uid = do ->
  i = 0
  return ->
    i++

# ## Public module members

# the exported module object
module.exports =
# error handler
  onError : (name) ->
    throw new TypeError "GremlinFactory#createGremlin> The gremlin module #{name} didn't return a (constructor) function and will not work!"

  # Create a gremlin
  getInstance  : (name, element, elementData, successCallback) ->
    # Use requirejs to load the gremlin class dynamically
    gid = uid()

    # TODO add check for trailing /
    name = configuration.get(configuration.PATH) + name
    name += TRAILING_SLASH if name.charAt(name.length - 1) isnt TRAILING_SLASH
    window.require [name], (Gremlin) ->
      return module.exports.onError name unless helper.isFunction Gremlin

      # call the constructor function passing in the jQuery object of the dom element, the gremlin's data retrieved with
      # `.data()` and a new unique id
      gremlin = new Gremlin element, elementData, gid

      # hook up all extensions for this gremlin and initialize it afterwards
      available  = gremlin.__settings.extensions
      length     = available.length
      count      = 0
      
      for name in available
        do (name) ->
          ExtensionFactory.create name, gremlin, =>
            count += 1
            if count is length
              gremlin.initialize()
              successCallback.call null, gremlin

      return yes
