module.exports = {
  createInstance(element, Spec) {
    return Object.create(Spec, {
      el: {
        value: element,
        writable: false,
      },
    });
  },
};
