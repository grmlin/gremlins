"use strict";

module.exports = {
  createInstance: function createInstance(element, Spec) {
    return Object.create(Spec, {
      el: {
        value: element,
        writable: false
      }
    });
  }
};