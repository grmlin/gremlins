#
# #GremlinJS - `gremlinjs/gremlins/LoaderPool`
#
# This module returns the LoaderPool singleton/object.
# Use the `LoaderPool` to get LoaderInstances. They will be cached by the namespace and css class used

Loader = require "./Loader.coffee"

# The internal cache
cache = {}

# Used css classes, we don't want to use them twice
classes = {}

# ## Public module members

# Get a `gremlinjs/gremlins/Loader` instance
module.exports.getInstance = (namespace, cssClass) ->
  key = "#{namespace}_#{cssClass}"

  if cache[key] is undefined
    if classes[cssClass] is true
      throw new Error "GremlinJS: Trying to use the same css class (#{cssClass}) with multiple namespaces."

    classes[cssClass] = true
    cache[key] = new Loader(namespace, cssClass)

  return cache[key]

