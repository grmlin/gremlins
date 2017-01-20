'use strict';

var Data = require('./Data');
var uuid = require('./uuid');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var gremlinId = function gremlinId() {
  return 'gremlins_' + uuid();
};
var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register: function register(tagName, Spec) {
    // TODO test for reserved function names ['createdCallback', 'attachedCallback', '']

    var proto = {
      createdCallback: {
        value: function value() {
          this._gid = gremlinId();

          Data.addGremlin(this._gid);
          this.created();
        },

        writable: false
      },
      attachedCallback: {
        value: function value() {
          this.attached();
        }
      },
      detachedCallback: {
        value: function value() {
          this.detached();
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          this.attributeDidChange(name, previousValue, _value);
        }
      }
    };

    for (var key in Spec) {
      // eslint-disable-line guard-for-in
      proto[key] = {
        value: Spec[key]
      };
    }

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