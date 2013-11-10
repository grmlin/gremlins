goog.provide 'gremlinDefinitions.Gizmo'

goog.require 'util.Helper'

class gremlinDefinitions.Gizmo

  define = (Parent, constructor, instanceMembers, staticMembers) ->
    unless typeof constructor is 'function'
      throw new Error("The second parameter when defining a gremlin has to be the constructor function!")

    unless typeof instanceMembers is 'undefined' or typeof instanceMembers is 'object'
      throw new Error("The third parameter when defining a gremlin has to be an object providing the instance members of the gremlin!")

    unless typeof staticMembers is 'undefined' or typeof staticMembers is 'object'
      throw new Error("The fourth parameter when defining a gremlin has to be an object providing the static members of the gremlin!")


    class Gremlin extends Parent
      constructor: ->
        super
        constructor.call this

    util.Helper.mixin Gremlin, instanceMembers
    Gremlin[key] = member for own key, member of staticMembers

    return Gremlin

  @extend: (constructor, instanceMembers, staticMembers) ->
    define @, constructor, instanceMembers, staticMembers

  # @property [Object] the data object holding the dom element's data attributes
  data: null
  el: null
  id: null

  # The constructor function used internally to instantiate gremlins.
  # 
  # 
  # @param [Object] el The dom element the gremlin is bound to
  # @param [Object] data The elements data attributes
  # @param [Number] id A unique id for every gremlin in the page
  # @param [Function] init A init function called inside the constructor. Here, the extensions will be bound to the newly created instance
  # 
  constructor: (@el, @data, @id, init) ->
    init.call @



