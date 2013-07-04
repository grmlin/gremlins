goog.provide 'gremlin.gremlinDefinitions.AbstractGremlin'

goog.require 'gremlin.util.Debug'

class gremlin.gremlinDefinitions.AbstractGremlin


  # #### constructor

  # The constructor function of each gremlin will get three parameters passed in:
  #
  # * `view` - The dom element of the gremlin
  # * `data` - all custom data attributes (`data-...`) of the gremlin's dom element wrapped in an object
  # * `id` - a unique id assigned to this gremlin instance
  #
  # than
  #
  # * jQuery elements and events are bound
  # * interests list is prepared
  # * the gremlin is registered in the Switchboard
  # * the pseudo constructor is called
  constructor: (@el, @data, @id, init) ->
    init.call @



