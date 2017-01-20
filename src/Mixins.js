const objectAssign = require('object-assign');

function getMixins(Spec) {
  if (Array.isArray(Spec.mixins)) {
    return Spec.mixins;
  }

  return Spec.mixins ? [Spec.mixins] : [];
}

function decorateProperty(Spec, propertyName, property) {
  const gremlinProperty = Spec[propertyName];
  const moduleProperty = property;
  const gremlinPropertyType = typeof gremlinProperty;
  const modulePropertyType = typeof moduleProperty;
  const isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    Spec[propertyName] = function () { // eslint-disable-line no-param-reassign, func-names
      // call the module first
      const moduleResult = moduleProperty.apply(this, arguments);
      const gremlinResult = gremlinProperty.apply(this, arguments);

      try {
        return objectAssign(moduleResult, gremlinResult);
      } catch (e) {
        return [moduleResult, gremlinResult];
      }
    };
  } else {
    console.warn( // eslint-disable-line no-console
      `Can't decorate gremlin property ` +
      `<${Spec.tagName} />#${propertyName}:${gremlinPropertyType}« ` +
      `with »Module#${propertyName}:${modulePropertyType}«. Only functions can be decorated!`
    );
  }
}

function mixinModule(Spec, Module) {
  Object.keys(Module).forEach(propertyName => {
    const property = Module[propertyName];

    if (Spec[propertyName] === undefined) {
      const descriptor = Object.getOwnPropertyDescriptor(Module, propertyName);
      Object.defineProperty(Spec, propertyName, descriptor);
    } else {
      decorateProperty(Spec, propertyName, property);
    }
  });
}


module.exports = {
  mixinProps(Spec) {
    const modules = getMixins(Spec);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(Module => mixinModule(Spec, Module));
  },
};
