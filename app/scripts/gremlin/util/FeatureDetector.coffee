goog.provide 'gremlin.util.FeatureDetector'

class gremlin.util.FeatureDetector
  @hasQuerySelectorAll : typeof document.querySelectorAll is "function"
  @hasMutationObserver : !!(window.MutationObserver or window.WebKitMutationObserver or window.MozMutationObserver)
  @hasGetClientRect : document.body.getBoundingClientRect isnt undefined
  @hasCssAnimations : do ->
    elm = document.body
    animation = false
    animationstring = "animation"
    keyframeprefix = ""
    domPrefixes = "Webkit Moz O ms Khtml".split(" ")
    pfx = ""
    animation = true  if elm.style.animationName
    if animation is false
      i = 0

      while i < domPrefixes.length
        if elm.style[domPrefixes[i] + "AnimationName"] isnt `undefined`
          pfx = domPrefixes[i]
          animationstring = pfx + "Animation"
          keyframeprefix = "-" + pfx.toLowerCase() + "-"
          animation = true
          break
        i++

    animation