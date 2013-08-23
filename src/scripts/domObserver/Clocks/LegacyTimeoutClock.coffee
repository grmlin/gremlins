goog.provide 'domObserver.clocks.LegacyTimeoutClock'
class domObserver.clocks.LegacyTimeoutClock
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
