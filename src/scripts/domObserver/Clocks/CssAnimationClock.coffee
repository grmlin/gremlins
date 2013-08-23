goog.provide 'domObserver.clocks.CssAnimationClock'
goog.require 'domObserver.clocks.cssAnimationStyle'
goog.require 'util.Helper'

class domObserver.clocks.CssAnimationClock
  ANIMATION_NAME = "gremlinInserted"
  EVENT_NAMES = ['animationstart', 'webkitAnimationStart', 'oanimationstart']

  constructor: ->
    css = domObserver.clocks.cssAnimationStyle ANIMATION_NAME
    util.Helper.addStyleSheet css

  observe: ->
    document.body.addEventListener name, @_onAnimation, no for name in EVENT_NAMES

  _onAnimation: (event) =>
    @onMutation() if event.animationName is ANIMATION_NAME

  onMutation: ->
