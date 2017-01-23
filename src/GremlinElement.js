const Data = require('./Data');
const uuid = require('./uuid');

const canRegisterElements = typeof document.registerElement === 'function';
const gremlinId = () => `gremlins_${uuid()}`;

if (!canRegisterElements) {
  throw new Error(
    `registerElement not available. Did you include the polyfill for older browsers?`
  );
}

const styleElement = document.createElement('style');
let styleSheet;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register(tagName, Spec) {
    const proto = {
      createdCallback: {
        value() {
          const id = gremlinId();
          this._gid = id;
          this.__gremlinInstance__ = Object.create(Spec, {
            _gid: {
              value: id,
              writable: false,
            },
            el: {
              value: this,
              writable: false,
            },
          });
          Data.addGremlin(id);
          this.__gremlinInstance__.created();
        },
      },
      attachedCallback: {
        value() {
          this.__gremlinInstance__.attached();
        },
      },
      detachedCallback: {
        value() {
          this.__gremlinInstance__.detached();
        },
      },
      attributeChangedCallback: {
        value(name, previousValue, value) {
          this.__gremlinInstance__.attributeDidChange(name, previousValue, value);
        },
      },
    };

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(`${tagName} { display: block }`, 0);

    return document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto),
    });
  },
};
