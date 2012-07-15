#
# #GremlinJS - `gremlinjs/gremlins/LoaderPool`
#
# This module returns the LoaderPool singleton/object.
# Use the `LoaderPool` to get LoaderInstances. They will be cached by the namespace and css class used

# Defining requirejs module for the Loader Pool
define  ["cs!./Loader"], (Loader) ->
    # ## Private module members

    # The internal cache
    cache = {}

    # ## Public module members

    # the exported object
    exports =
      # Get a `gremlinjs/gremlins/Loader` instance
      getInstance: (namespace, cssClass) ->
        key = "#{namespace}_#{cssClass}"
        cache[key] or (cache[key] = new Loader(namespace, cssClass))

