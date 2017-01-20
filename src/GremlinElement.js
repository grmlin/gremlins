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

module.exports = {
  register(tagName, Spec) {
    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(`${tagName} { display: block }`, 0);

    const El = document.registerElement(tagName, {
      name: tagName,
      prototype: Spec,
    });

    return El;
  },
};
