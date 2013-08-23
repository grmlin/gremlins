goog.provide 'gremlinDefinitions.Gizmo'

class gremlinDefinitions.Gizmo
  # @property [Object] the data object holding the dom element's data attributes
  data: null
  el: null
  id: null
  klass: null
  
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



