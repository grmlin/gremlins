const Data = require('./Data');
const uuid = require('./uuid');

const canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error(
    `registerElement not available. Did you include the polyfill for older browsers?`
  );
}

const gremlinId = () => `gremlins_${uuid()}`;
const styleElement = document.createElement('style');
let styleSheet;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

module.exports = {
  register(tagName, Spec) {
    // TODO test for reserved function names ['createdCallback', 'attachedCallback', '']

    const proto = {
      createdCallback: {
        value() {
          this._gid = gremlinId();

          Data.addGremlin(this._gid);
          this.created();
        },
        writable: false,
      },
      attachedCallback: {
        value() {
          this.attached();
        },
      },
      detachedCallback: {
        value() {
          this.detached();
        },
      },
      attributeChangedCallback: {
        value(name, previousValue, value) {
          this.attributeDidChange(name, previousValue, value);
        },
      },
    };

    for (const key in Spec) { // eslint-disable-line guard-for-in
      proto[key] = {
        value: Spec[key],
      };
    }


    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(`${tagName} { display: block }`, 0);

    const El = document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto),
    });

    return El;
  },
};
