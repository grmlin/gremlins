#
# #GremlinJS - `gremlinjs/gremlins/GremlinFactory`
#
# Factory singleton, that loads gremlin classes using *requirejs* and instantiates them

GID_ATTR = "data-gid"

helper            = require "./../helper.coffee"
ElementData       = require "./ElementData/ElementData.coffee"
ExtensionFactory  = require "./../extensions/Factory.coffee"
AbstractExtension = require "./../extensions/AbstractExtension.coffee"

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
  create  : (name, element, elementData, successCallback) ->
    # Use requirejs to load the gremlin class dynamically
    gid = uid()
    extensions = []
    
    window.require [name], (Gremlin) ->
      return module.exports.onError name unless helper.isFunction Gremlin

      # call the constructor function passing in the jQuery object of the dom element, the gremlin's data retrieved with
      # `.data()` and a new unique id
      gremlin = new Gremlin element, elementData, gid

      ExtensionFactory.create gremlin, =>
        gremlin.initialize()
        successCallback.call null, gremlin   
        
      return yes
