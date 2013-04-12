goog.provide 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'


class gremlin.gremlinDefinitions.Pool
  instance = null
  definitions = {}
  
  class Pool
    get: (name) -> 
      definitions[name] ? null
        
    set: (name, definition) ->
      if typeof definitions[name] isnt 'undefined'
        throw new Error("Trying to add new Gremlin definition, but a definition for #{name} already exists.")

      definitions[name] = definition
      
    define: (name, definition) ->

      class Gremlin extends gremlin.gremlinDefinitions.AbstractGremlin
      #name       : name
      #__settings : opt
  
      gremlin.util.Helper.mixin Gremlin, definition
  
      @set name, Gremlin
      
  @getInstance : () ->
    instance ?= new Pool
    

