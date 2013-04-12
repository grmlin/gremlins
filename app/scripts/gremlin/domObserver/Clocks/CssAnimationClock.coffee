goog.provide 'gremlin.domObserver.clocks.CssAnimationClock'
goog.require 'gremlin.domObserver.clocks.cssAnimationStyle'

class gremlin.domObserver.clocks.CssAnimationClock
  ANIMATION_NAME = "gremlinInserted"
  EVENT_NAMES = ['animationend', 'webkitAnimationEnd', 'oanimationend']

  constructor: ->
    head = document.getElementsByTagName('head')[0]
    style = document.createElement 'style'
    style.type = 'text/css'
    css = gremlin.domObserver.clocks.cssAnimationStyle ANIMATION_NAME
    if style.styleSheet
      style.styleSheet.cssText = css
    else
      style.appendChild(document.createTextNode(css))
    head.appendChild(style);

  observe: ->
    document.body.addEventListener name, @_onAnimation, no for name in EVENT_NAMES

  _onAnimation: (event) =>
    @onMutation() if event.animationName is ANIMATION_NAME

  onMutation: ->
