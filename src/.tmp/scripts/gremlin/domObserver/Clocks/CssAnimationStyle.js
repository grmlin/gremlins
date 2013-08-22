//@ sourceMappingURL=CssAnimationStyle.map
goog.provide('gremlin.domObserver.clocks.cssAnimationStyle');

goog.require('gremlin.gremlins.NameProvider');

gremlin.domObserver.clocks.cssAnimationStyle = function(animationName) {
  var css;

  css = "@keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-moz-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-webkit-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n@-o-keyframes {{ANIMATION_NAME}} {\n  0%   { opacity: 0.9; }\n  100% { opacity: 1; }\n}\n\n*[{{GREMLIN_ATTRIBUTE}}] {\n  animation-duration: 1ms;\n  -o-animation-duration: 1ms;\n  -moz-animation-duration: 1ms;\n  -webkit-animation-duration: 1ms;\n  animation-name: {{ANIMATION_NAME}};\n  -o-animation-name: {{ANIMATION_NAME}};\n  -moz-animation-name: {{ANIMATION_NAME}};\n  -webkit-animation-name: {{ANIMATION_NAME}};\n}";
  css = css.replace(/{{ANIMATION_NAME}}/g, animationName);
  return css.replace(/{{GREMLIN_ATTRIBUTE}}/g, gremlin.gremlins.NameProvider.DATA_NAME_ATTR);
};
