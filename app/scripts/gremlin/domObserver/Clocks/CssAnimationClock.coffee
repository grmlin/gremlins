goog.provide 'gremlin.domObserver.clocks.CssAnimationClock'
goog.require 'gremlin.domObserver.clocks.cssAnimationStyle'
goog.require 'gremlin.util.Helper'

class gremlin.domObserver.clocks.CssAnimationClock
  ANIMATION_NAME = "gremlinInserted"
  EVENT_NAMES = ['animationend', 'webkitAnimationEnd', 'oanimationend']

  constructor: ->
    css = gremlin.domObserver.clocks.cssAnimationStyle ANIMATION_NAME
    gremlin.util.Helper.addStyleSheet css

  observe: ->
    document.body.addEventListener name, @_onAnimation, no for name in EVENT_NAMES

  _onAnimation: (event) =>
    @onMutation() if event.animationName is ANIMATION_NAME

  onMutation: ->
