#
# #GremlinJS - `gremlinjs/gremlins/GremlinLair`
#
# The gremlin's lair. All gremlins should be created with this

helper          = require "./../helper.coffee"
AbstractGremlin = require "./AbstractGremlin.coffee"

# the exported object
module.exports =
  # create a gremlin class. Pass in the gremlins name and the mixin describing your gremlin.
  # **Don't forget to provide an `initialize` method if you need a constructor.
  # It will be called when the gremlin class is intantiated**
  extend: (name, gremlinMixin, options) ->
    throw new TypeError "GremlinLair#create called with wrong parameters!" unless (helper.isString(name) and helper.isObject(gremlinMixin))
    class Newborn extends AbstractGremlin
      name: name
    helper.mixin(Newborn, gremlinMixin)
    return Newborn
  # alias for exend
  create: @extend
    

