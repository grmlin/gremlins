/* eslint-disable no-console */
function noop() {}
const types = ['log', 'info', 'warn'];

module.exports = {
  create() {
    if (console === undefined) {
      global.console = {};
    }
    types.forEach(type => {
      if (typeof console[type] !== 'function') {
        console[type] = noop();
      }
    });
  },
};
