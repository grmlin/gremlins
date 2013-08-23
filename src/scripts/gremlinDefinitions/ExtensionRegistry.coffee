goog.provide 'gremlin.gremlinDefinitions.ExtensionRegistry'

goog.require 'gremlin.gremlinDefinitions.Gizmo'

class gremlin.gremlinDefinitions.ExtensionRegistry
  availableExtensions = []
  
  @addExtension: (Extension) ->
    Extension.extend gremlin.gremlinDefinitions.Gizmo
    availableExtensions.push Extension
    
  @getExtensions: -> availableExtensions.slice 0 