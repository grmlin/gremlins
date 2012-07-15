define ['cs!./gremlinjs/gremlins/LoaderPool', 'cs!./gremlinjs/gremlins/GremlinLair'], (LoaderPool, Lair) ->
  # facade for the most important gremlinjs features
  return create: Lair.create, getLoader: LoaderPool.getInstance
