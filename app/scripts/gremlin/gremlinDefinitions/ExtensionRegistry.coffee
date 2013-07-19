goog.provide 'gremlin.gremlinDefinitions.ExtensionRegistry'

goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'

class gremlin.gremlinDefinitions.ExtensionRegistry
  availableExtensions = []
  
  @addExtension: (Extension) ->
    if Extension.test()
      Extension.extend gremlin.gremlinDefinitions.AbstractGremlin 
      availableExtensions.push Extension
    
  @getExtensions: -> availableExtensions.slice 0 