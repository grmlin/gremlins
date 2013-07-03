goog.provide 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'


class gremlin.gremlinDefinitions.Pool
  instance = null
  definitions = {}
  noop = ->

  class Pool
    get: (name) -> 
      definitions[name] ? null
        
    set: (name, definition) ->
      if typeof definitions[name] isnt 'undefined'
        throw new Error("Trying to add new Gremlin definition, but a definition for #{name} already exists.")

      definitions[name] = definition
      
    define: (name, constructor, instanceMembers, staticMembers) ->
      constructor = noop if typeof constructor is 'object'

      class Gremlin extends gremlin.gremlinDefinitions.AbstractGremlin
        constructor: ->
          super
          constructor.call this

      gremlin.util.Helper.mixin Gremlin, instanceMembers
      Gremlin[key] = member for own key, member of staticMembers

      @set name, Gremlin
      return Gremlin
      
  @getInstance : () ->
    instance ?= new Pool
    

