goog.provide 'gremlinDefinitions.ExtensionRegistry'

goog.require 'gremlinDefinitions.Gizmo'

class gremlinDefinitions.ExtensionRegistry
  availableExtensions = []
  
  @addExtension: (Extension) ->
    Extension.extend gremlinDefinitions.Gizmo
    availableExtensions.push Extension
    
  @getExtensions: -> availableExtensions.slice 0 