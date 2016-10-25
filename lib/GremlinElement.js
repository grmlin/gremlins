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

function createInstance(element, Spec) {
  var existingGremlins = Data.getGremlin(element);

  if (existingGremlins === null) {
    var gremlin = Factory.createInstance(element, Spec);
    Data.addGremlin(gremlin, element);

    if (typeof gremlin.initialize === 'function') {
      console.warn('<' + element.tagName + ' />\n' + 'the use of the `initialize` callback of a gremlin component is deprecated. ' + 'Use the `created` callback instead.');
      gremlin.initialize();
    } else {
      gremlin.created();
    }
  } else {
    // console.warn('exisiting gremlin found');
  }
}

function attachInstance(element) {
  var gremlin = Data.getGremlin(element);
  gremlin.attached();
}

function detachInstance(element) {
  var gremlin = Data.getGremlin(element);

  if (typeof gremlin.destroy === 'function') {
    console.warn('<' + element.tagName + ' />\n' + 'the use of the `destroy` callback of a gremlin component is deprecated. Use ' + 'the `detached` callback instead.');
    gremlin.destroy();
  } else {
    gremlin.detached();
  }
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
      createdCallback: {
        value: function value() {
          createInstance(this, Spec);
        }
      },
      attachedCallback: {
        value: function value() {
          attachInstance(this);
        }
      },
      detachedCallback: {
        value: function value() {
          detachInstance(this);
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