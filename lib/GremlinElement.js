'use strict';

var Factory = require('./Factory');
var Data = require('./Data');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

function addInstance(element, Spec) {
  var gremlin = Factory.createInstance(element, Spec);
  Data.addGremlin(gremlin, element);
  gremlin.initialize();
}

function removeInstance(element) {
  Data.getGremlin(element).destroy();
}

function updateAttr(element, name, previousValue, value) {
  var gremlin = Data.getGremlin(element);

  if (gremlin !== null) {
    gremlin.attributeDidChange(name, previousValue, value);
  }
}

module.exports = {
  register: function register(tagName, Spec) {
    var proto = {
      attachedCallback: {
        value: function value() {
          addInstance(this, Spec);
        }
      },
      detachedCallback: {
        value: function value() {
          removeInstance(this);
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          updateAttr(this, name, previousValue, _value);
        }
      }
    };

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(tagName + ' { display: block }', 0);

    var El = document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto)
    });

    return El;
  }
};