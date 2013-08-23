goog.provide 'MutationObserverShim'
goog.require 'event.Event'
goog.require 'domObserver.clocks.ClockFactory'

class MutationObserverShim
  instance = null

  class MutationObserverShim extends event.Event
    constructor : ->
      super
      @_clock = domObserver.clocks.ClockFactory.createClock()
      @_clock.onMutation = @_onMutation

    _onMutation : =>
      @emit MutationObserverShim.ON_MUTATION

    observe: ->
      @_clock.observe()
      @_onMutation()

  @ON_MUTATION : 'ON_MUTATION'
  @get     : () ->
    instance ?= new MutationObserverShim




