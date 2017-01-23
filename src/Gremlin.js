const Mixins = require('./Mixins');
const GremlinElement = require('./GremlinElement');
const Data = require('./Data');
const uuid = require('./uuid');

const gremlinId = () => `gremlins_${uuid()}`;

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */


function extend(obj, ...sources) {
  sources.forEach(source => {
    if (source) {
      for (const prop in source) {
        if (source.hasOwnProperty(prop)) {
          const descriptor = Object.getOwnPropertyDescriptor(source, prop);
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
}

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
const specMap = {};

const addSpec = (tagName, Spec) => specMap[tagName] = Spec;
const hasSpec = tagName => specMap[tagName] !== undefined;
const gremlinProto = Object.create(HTMLElement.prototype);

const Gremlin = Object.create(gremlinProto, {
  createdCallback: {
    value() {
      this._gid = gremlinId();

      Data.addGremlin(this._gid);
      this.created();
    },
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
  created: {
    value() {
    },
    writable: true,
  },
  attached: {
    value() {
    },
    writable: true,
  },
  detached: {
    value() {
    },
    writable: true,
  },
  attributeDidChange: {
    value() {
    },
    writable: true,
  },
  create: {
    value(tagName, Spec = {}) {
      const Parent = this;

      const NewSpec = Object.create(Parent, {
        name: {
          value: tagName,
          writable: true,
        },
      });

      if (typeof tagName !== 'string') {
        throw new TypeError('Gremlins.create expects the gremlins tag name as a first argument');
      }
      if (hasSpec(tagName)) {
        throw new Error(`Trying to add new Gremlin spec, ` +
          `but a spec for ${tagName} already exists.`);
      }
      if (Spec.create !== undefined) {
        console.warn( // eslint-disable-line no-console
          `You are replacing the original create method for the spec of ${tagName}. ` +
          `You know what you're doing, right?`
        );
      }

      // set up the prototype chain
      extend(NewSpec, Spec);
      // extend the spec with it's Mixins
      Mixins.mixinProps(NewSpec);
      // remember this name
      addSpec(tagName, NewSpec);
      // and create the custom element for it
      GremlinElement.register(tagName, NewSpec);
      return NewSpec;
    },
  },
});

module.exports = Gremlin;
