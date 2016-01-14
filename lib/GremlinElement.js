const Factory = require('./Factory');
const Data = require('./Data');

const canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error(
    `registerElement not available. Did you include the polyfill for older browsers?`
  );
}

const styleElement = document.createElement('style');
let styleSheet;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

function addInstance(element, Spec) {
  const gremlin = Factory.createInstance(element, Spec);
  Data.addGremlin(gremlin, element);
  gremlin.initialize();
}

function removeInstance(element) {
  Data.getGremlin(element).destroy();
}

function updateAttr(element, name, previousValue, value) {
  const gremlin = Data.getGremlin(element);

  if (gremlin !== null) {
    gremlin.attributeDidChange(name, previousValue, value);
  }
}


module.exports = {
  register(tagName, Spec) {
    const proto = {
      attachedCallback: {
        value() {
          addInstance(this, Spec);
        },
      },
      detachedCallback: {
        value() {
          removeInstance(this);
        },
      },
      attributeChangedCallback: {
        value(name, previousValue, value) {
          updateAttr(this, name, previousValue, value);
        },
      },
    };

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
