goog.provide 'gremlin.gremlinDefinitions.Pool'
goog.require 'gremlin.util.Helper'
goog.require 'gremlin.gremlinDefinitions.AbstractGremlin'


class gremlin.gremlinDefinitions.Pool
  'use strict'
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
      unless typeof name is 'string'
        throw new Error("The first parameter when defining a gremlin has to be a string, the gremlin definition's name!")

      unless typeof constructor is 'function'
        throw new Error("The second parameter when defining a gremlin has to be the constructor function!")

      unless instanceMembers is undefined or typeof instanceMembers is 'object'
        throw new Error("The third parameter when defining a gremlin has to be an object providing the instance members of the gremlin!")

      unless staticMembers is undefined or typeof staticMembers is 'object'
        throw new Error("The fourth parameter when defining a gremlin has to be an object providing the static members of the gremlin!")


      #constructor = noop if typeof constructor is 'object'

      class Gremlin extends gremlin.gremlinDefinitions.AbstractGremlin
        constructor: ->
          super
          constructor.call this

      Gremlin::klass = Gremlin
      gremlin.util.Helper.mixin Gremlin, instanceMembers
      Gremlin[key] = member for own key, member of staticMembers

      @set name, Gremlin
      return Gremlin
      
  @getInstance : () ->
    instance ?= new Pool
    

