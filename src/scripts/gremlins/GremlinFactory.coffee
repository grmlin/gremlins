goog.provide 'gremlins.GremlinFactory'

goog.require 'gremlinDefinitions.Pool'
goog.require 'modules.ModuleCollection'
goog.require 'gremlinDefinitions.ExtensionRegistry'


class gremlins.GremlinFactory
# A unique id counter used for gremlin instantiation
  uid = do ->
    i = 0
    return ->
      i++

  addModules =  (name) ->
    return ->
      modules.ModuleCollection.bindGizmo name, @
      #extensions = gremlinDefinitions.ExtensionRegistry.getExtensions()
      #Extension.bind @ for Extension in extensions

  @getInstance : (name, domEl, elData) ->
    GremlinClass = gremlinDefinitions.Pool.getInstance().get name
    if typeof GremlinClass is 'function'
      gremlinInstance = new GremlinClass domEl, elData.toObject(), uid(), addModules(name)
      throw new Error("Abstract gremlin class not called. Did you miss a super in your coffeescript-class?") if gremlinInstance.el is null
      gremlinInstance
    else
      null