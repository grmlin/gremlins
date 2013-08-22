//@ sourceMappingURL=ClockFactory.map
goog.provide('gremlin.domObserver.clocks.ClockFactory');

goog.require('gremlin.util.FeatureDetector');

goog.require('gremlin.domObserver.clocks.MutationObserverClock');

goog.require('gremlin.domObserver.clocks.CssAnimationClock');

goog.require('gremlin.domObserver.clocks.LegacyTimeoutClock');

gremlin.domObserver.clocks.ClockFactory = (function() {
  var hasAnimations, hasMutationObserver;

  function ClockFactory() {}

  hasAnimations = gremlin.util.FeatureDetector.hasCssAnimations;

  hasMutationObserver = gremlin.util.FeatureDetector.hasMutationObserver;

  ClockFactory.createClock = function() {
    var Clock;

    if (hasAnimations) {
      Clock = gremlin.domObserver.clocks.CssAnimationClock;
    } else {
      Clock = gremlin.domObserver.clocks.LegacyTimeoutClock;
    }
    return new Clock;
  };

  return ClockFactory;

})();
