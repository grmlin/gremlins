goog.provide 'extensions'

goog.require 'gremlin.gremlinDefinitions.ExtensionRegistry'
goog.require 'extensions.Interests'
goog.require 'extensions.DomElements'
goog.require 'extensions.JQuery'

do ->
  gremlin.gremlinDefinitions.ExtensionRegistry.addExtension ext for own name,ext of extensions


  
  