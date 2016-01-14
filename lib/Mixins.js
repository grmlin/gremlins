const objectAssign = require('object-assign');

const getMixins = gremlin => {
  if (Array.isArray(gremlin.mixins)) {
    return gremlin.mixins;
  }

  return gremlin.mixins ? [gremlin.mixins] : [];
};

function decorateProperty(gremlin, propertyName, property) {
  const gremlinProperty = gremlin[propertyName];
  const moduleProperty = property;
  const gremlinPropertyType = typeof gremlinProperty;
  const modulePropertyType = typeof moduleProperty;
  const isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    gremlin[propertyName] = () => { // eslint-disable-line no-param-reassign
      // call the module first
      const moduleResult = moduleProperty.apply(gremlin, arguments);
      const gremlinResult = gremlinProperty.apply(gremlin, arguments);

      try {
        return objectAssign(moduleResult, gremlinResult);
      } catch (e) {
        return [moduleResult, gremlinResult];
      }
    };
  } else {
    console.warn( // eslint-disable-line no-console
      `Can't decorate gremlin property ` +
      `<${gremlin.tagName} />#${propertyName}:${gremlinPropertyType}« ` +
      `with »Module#${propertyName}:${modulePropertyType}«. Only functions can be decorated!`
    );
  }
}

function mixinModule(gremlin, Module) {
  Object.keys(Module).forEach(propertyName => {
    const property = Module[propertyName];

    if (gremlin[propertyName] === undefined) {
      gremlin[propertyName] = property; // eslint-disable-line no-param-reassign
    } else {
      decorateProperty(gremlin, propertyName, property);
    }
  });
}


module.exports = {
  mixinProps(gremlin) {
    const modules = getMixins(gremlin);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(Module => mixinModule(gremlin, Module));
  },
};
