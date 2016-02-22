const uuid = require('./uuid');

const exp = `gremlins_${uuid()}`;
const cache = {};

const gremlinId = (function gremlinId() {
  let id = 1;
  return () => id++;
}());

const hasId = (element) => element[exp] !== undefined;
const setId = (element) => element[exp] = gremlinId(); // eslint-disable-line no-param-reassign
const getId = (element) => hasId(element) ? element[exp] : setId(element);

module.exports = {
  addGremlin(gremlin, element) {
    const id = getId(element);

    if (cache[id] !== undefined) {
      console.warn(`You can't add another gremlin to this element, it already uses one!`, element); // eslint-disable-line no-console, max-len
    } else {
      cache[id] = gremlin;
    }
  },

  getGremlin(element) {
    const id = getId(element);
    const gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
  },
};
