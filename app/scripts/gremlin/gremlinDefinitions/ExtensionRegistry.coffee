goog.provide 'gremlin.gremlinDefinitions.ExtensionRegistry'


class gremlin.gremlinDefinitions.ExtensionRegistry
  availableExtensions = []
  
  @addExtension: (Extension) ->
    
    availableExtensions.push Extension
    
  @getExtensions: -> availableExtensions.slice 0 