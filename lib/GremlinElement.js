'use strict';

var Data = require('./Data');
var uuid = require('./uuid');

var canRegisterElements = typeof document.registerElement === 'function';
var gremlinId = function gremlinId() {
  return 'gremlins_' + uuid();
};

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register: function register(tagName, Spec) {
    var proto = {
      createdCallback: {
        value: function value() {
          var id = gremlinId();
          this._gid = id;
          this.__gremlinInstance__ = Object.create(Spec, {
            _gid: {
              value: id,
              writable: false
            },
            el: {
              value: this,
              writable: false
            }
          });
          Data.addGremlin(id);
          this.__gremlinInstance__.created();
        }
      },
      attachedCallback: {
        value: function value() {
          this.__gremlinInstance__.attached();
        }
      },
      detachedCallback: {
        value: function value() {
          this.__gremlinInstance__.detached();
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          this.__gremlinInstance__.attributeDidChange(name, previousValue, _value);
        }
      }
    };

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(tagName + ' { display: block }', 0);

    return document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto)
    });
  }
};