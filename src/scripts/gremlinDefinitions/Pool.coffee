goog.provide 'gremlinDefinitions.Pool'

goog.require 'util.Helper'
goog.require 'gremlinDefinitions.Gizmo'
goog.require 'modules.ModuleCollection'


class gremlinDefinitions.Pool
  'use strict'
  nameRe = /function\s*([\w\$]*)\s*\(/
  instance = null
  definitions = {}
  noop = ->

  class Pool
    get: (name) -> 
      definitions[name] ? null
        
    set: (name, Definition) ->
      if typeof definitions[name] isnt 'undefined'
        throw new Error("Trying to add new Gremlin definition, but a definition for #{name} already exists.")

      modules.ModuleCollection.extendGizmo name, Definition
      definitions[name] = Definition
      
    addClass: (name, Gremlin) ->
      unless typeof name is 'string'
        throw new Error("Please provide the name of the gremlin!")
        
      unless typeof Gremlin is 'function'
        throw new Error("When adding a gremlin, you have to provide a constructor function!")

      @set name, Gremlin
      return Gremlin

  @getInstance : () ->
    instance ?= new Pool
    

