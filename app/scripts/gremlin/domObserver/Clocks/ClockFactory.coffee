goog.provide 'gremlin.domObserver.clocks.ClockFactory'
goog.require 'gremlin.util.FeatureDetector'
goog.require 'gremlin.domObserver.clocks.MutationObserverClock'
goog.require 'gremlin.domObserver.clocks.CssAnimationClock'
goog.require 'gremlin.domObserver.clocks.LegacyTimeoutClock'

class gremlin.domObserver.clocks.ClockFactory
  hasAnimations = gremlin.util.FeatureDetector.hasCssAnimations
  hasMutationObserver = gremlin.util.FeatureDetector.hasMutationObserver

  @createClock: ->
    if hasAnimations
      Clock = gremlin.domObserver.clocks.CssAnimationClock
    else if hasMutationObserver
      Clock = gremlin.domObserver.clocks.MutationObserverClock
    else
      Clock = gremlin.domObserver.clocks.LegacyTimeoutClock

    #console.log "MutationObserverFactory uses clock:", Clock.name

    new Clock


