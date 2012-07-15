#
# #GremlinJS - `gremlinjs/gremlins/GremlinFactory`
#
# Factory singleton, that loads gremlin classes using *requirejs* and instantiates them

# defininge the GremlinFactory module for requirejs
define ['cs!../core/helper'], (helper) ->
  # ## Private module members

  # A unique id counter used for gremlin instantiation
  uid = 0
  # ## Public module members

  # the exported module object
  exports =
  # Create a gremlin
    createGremlin: (name, $element, successCallback) ->
      # Use requirejs to load the gremlin class dynamically
      require [name], (Gremlin) ->
        # check, if the loaded module is a function and instantiate the gremlin
        if helper.isFunction(Gremlin)
          # call the constructor function passing in the jQuery object of the dom element, the gremlin's data retrieved with
          # `.data()` and a new unique id
          gremlin = new Gremlin($element, $element.data(), uid += 1)
          successCallback.apply(null, [gremlin])
        else
          helper.warn("gremlinjs/gremlins/GremlinFactory#createGremlin> The gremlin module #{name} didn't return a (constructor) function and will not work!")