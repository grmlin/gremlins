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

function createInstance(element, Spec) {
  const existingGremlins = Data.getGremlin(element);

  if (existingGremlins === null) {
    const gremlin = Factory.createInstance(element, Spec);
    Data.addGremlin(gremlin, element);

    if (typeof gremlin.initialize === 'function') {
      console.warn(
        `<${element.tagName} />\n` +
        'the use of the `initialize` callback of a gremlin component is deprecated. ' +
        'Use the `created` callback instead.');
      gremlin.initialize();
    } else {
      gremlin.created();
    }
  } else {
    // console.warn('exisiting gremlin found');
  }
}

function attachInstance(element) {
  const gremlin = Data.getGremlin(element);
  gremlin.attached();
}

function detachInstance(element) {
  const gremlin = Data.getGremlin(element);

  if (typeof gremlin.destroy === 'function') {
    console.warn(
      `<${element.tagName} />\n` +
      'the use of the `destroy` callback of a gremlin component is deprecated. Use ' +
      'the `detached` callback instead.');
    gremlin.destroy();
  } else {
    gremlin.detached();
  }
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
      createdCallback: {
        value() {
          createInstance(this, Spec);
        },
      },
      attachedCallback: {
        value() {
          attachInstance(this);
        },
      },
      detachedCallback: {
        value() {
          detachInstance(this);
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
