goog.provide 'gremlin.MutationObserverShim'
goog.require 'gremlin.event.Event'
goog.require 'gremlin.domObserver.clocks.ClockFactory'

class gremlin.MutationObserverShim
  instance = null

  class MutationObserverShim extends gremlin.event.Event
    @RESCAN_INTERVAL : 500

    constructor : ->
      super
      @_clock = gremlin.domObserver.clocks.ClockFactory.createClock()
      @_clock.onMutation = @_onMutation

    _onMutation : =>
      @emit gremlin.MutationObserverShim.ON_MUTATION

    observe: ->
      @_clock.observe()
      @_onMutation()

  @ON_MUTATION : 'ON_MUTATION'
  @get     : () ->
    instance ?= new MutationObserverShim




