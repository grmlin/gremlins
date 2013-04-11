goog.provide 'gremlin.domObserver.clocks.LegacyTimeoutClock'
class gremlin.domObserver.clocks.LegacyTimeoutClock
  RESCAN_INTERVAL = 500
  constructor: ->

  observe: ->
    @_initiateInterval()

  _initiateInterval: ->
    @_interval = window.setTimeout @_onInterval, RESCAN_INTERVAL

  _onInterval: =>
    @onMutation()
    @_initiateInterval()

  onMutation: ->
