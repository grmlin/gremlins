#
# #GremlinJS - `gremlinjs/gremlins/GremlinLair`
#
# The gremlin's lair. All gremlins should be created with this

# define the requirejs module
define ['cs!../core/helper','cs!./AbstractGremlin'], (helper, AbstractGremlin) ->
  # the exported object
  exports =
    # create a gremlin. Pass in the gremlins name and the mixin describing your gremlin.
    # **Don't forget to provide an `initialize` method. It will be called when the gremlin class is intantiated**
    create: (name, gremlinMixin) ->
      class Newborn extends AbstractGremlin
        name: name
      helper.mixin(Newborn, gremlinMixin)
      return Newborn

