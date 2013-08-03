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
    Extension.bind @ for Extension in extensions

  @getInstance : (name, domEl, elData) ->
    GremlinClass = gremlin.gremlinDefinitions.Pool.getInstance().get name
    if typeof GremlinClass is 'function'
      gremlinInstance = new GremlinClass domEl, elData.toObject(), uid(), addExtensions
      throw new Error("Abstract gremlin class not called. Did you miss a super in your coffeescript-class?") if gremlinInstance.el is null
      gremlinInstance
    else
      null