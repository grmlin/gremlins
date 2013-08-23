goog.provide 'domObserver.clocks.cssAnimationStyle'
goog.require 'gremlins.NameProvider'

domObserver.clocks.cssAnimationStyle = (animationName) ->
  css = """
      @keyframes {{ANIMATION_NAME}} {
        0%   { opacity: 0.9; }
        100% { opacity: 1; }
      }

      @-moz-keyframes {{ANIMATION_NAME}} {
        0%   { opacity: 0.9; }
        100% { opacity: 1; }
      }

      @-webkit-keyframes {{ANIMATION_NAME}} {
        0%   { opacity: 0.9; }
        100% { opacity: 1; }
      }

      @-o-keyframes {{ANIMATION_NAME}} {
        0%   { opacity: 0.9; }
        100% { opacity: 1; }
      }

      *[{{GREMLIN_ATTRIBUTE}}] {
        animation-duration: 1ms;
        -o-animation-duration: 1ms;
        -moz-animation-duration: 1ms;
        -webkit-animation-duration: 1ms;
        animation-name: {{ANIMATION_NAME}};
        -o-animation-name: {{ANIMATION_NAME}};
        -moz-animation-name: {{ANIMATION_NAME}};
        -webkit-animation-name: {{ANIMATION_NAME}};
      }
  """

  css = css.replace /{{ANIMATION_NAME}}/g, animationName
  css.replace /{{GREMLIN_ATTRIBUTE}}/g, gremlins.NameProvider.DATA_NAME_ATTR