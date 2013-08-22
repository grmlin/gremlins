//@ sourceMappingURL=FeatureDetector.map
goog.provide('gremlin.util.FeatureDetector');

gremlin.util.FeatureDetector = (function() {
  function FeatureDetector() {}

  FeatureDetector.hasQuerySelectorAll = typeof document.querySelectorAll !== "undefined";

  FeatureDetector.hasMutationObserver = !!(window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver);

  FeatureDetector.hasGetClientRect = document.documentElement.getBoundingClientRect !== void 0;

  FeatureDetector.hasCssAnimations = (function() {
    var animation, animationstring, domPrefixes, elm, i, keyframeprefix, pfx;

    elm = document.documentElement;
    animation = false;
    animationstring = "animation";
    keyframeprefix = "";
    domPrefixes = "Webkit Moz O ms Khtml".split(" ");
    pfx = "";
    if (elm.style.animationName) {
      animation = true;
    }
    if (animation === false) {
      i = 0;
      while (i < domPrefixes.length) {
        if (elm.style[domPrefixes[i] + "AnimationName"] !== undefined) {
          pfx = domPrefixes[i];
          animationstring = pfx + "Animation";
          keyframeprefix = "-" + pfx.toLowerCase() + "-";
          animation = true;
          break;
        }
        i++;
      }
    }
    return animation;
  })();

  return FeatureDetector;

})();
