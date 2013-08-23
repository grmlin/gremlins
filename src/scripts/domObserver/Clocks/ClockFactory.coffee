goog.provide 'domObserver.clocks.ClockFactory'
goog.require 'util.FeatureDetector'
goog.require 'domObserver.clocks.MutationObserverClock'
goog.require 'domObserver.clocks.CssAnimationClock'
goog.require 'domObserver.clocks.LegacyTimeoutClock'

class domObserver.clocks.ClockFactory
  hasAnimations = util.FeatureDetector.hasCssAnimations
  hasMutationObserver = util.FeatureDetector.hasMutationObserver

  @createClock: ->
    
    #if hasMutationObserver
    #  Clock = domObserver.clocks.MutationObserverClock
    ##else
    if hasAnimations
      Clock = domObserver.clocks.CssAnimationClock
    else
      Clock = domObserver.clocks.LegacyTimeoutClock

    #console.log "MutationObserverFactory uses clock:", Clock.name

    new Clock


