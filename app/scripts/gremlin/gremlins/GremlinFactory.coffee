goog.provide 'gremlin.gremlins.GremlinFactory'
goog.require 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.gremlinDefinitions.ExtensionRegistry'


class gremlin.gremlins.GremlinFactory
# A unique id counter used for gremlin instantiation
  uid = do ->
    i = 0
    return ->
      i++

  addExtensions =  ->
    extensions = gremlin.gremlinDefinitions.ExtensionRegistry.getExtensions()
    
    extension.bind @ for extension in extensions when extension.test()

  # TODO bind gremlin extensions outside the abstract gremlins constructor
  @getInstance : (name, domEl, elData) ->
    GremlinClass = gremlin.gremlinDefinitions.Pool.getInstance().get name
    if typeof GremlinClass is 'function'
      gremlinInstance = new GremlinClass domEl, elData.toObject(), uid(), addExtensions
      gremlinInstance
    else
      null