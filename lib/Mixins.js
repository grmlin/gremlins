'use strict';

var getMixins = gremlin => Array.isArray(gremlin.mixins) ? gremlin.mixins : (gremlin.mixins ? [gremlin.mixins] : []);

function mixinModule(gremlin, Module) {

	Object.keys(Module).forEach(propertyName => {
		let property = Module[propertyName];

		if (gremlin[propertyName] === undefined) {
			gremlin[propertyName] = property;
		} else {
			decorateProperty(gremlin, propertyName, property);
		}
	});
}
function decorateProperty(gremlin, propertyName, property) {
	var gremlinProperty = gremlin[propertyName],
		moduleProperty = property,
		gremlinPropertyType = typeof gremlinProperty,
		modulePropertyType = typeof moduleProperty,
		isSamePropType = gremlinPropertyType === modulePropertyType;

	if (isSamePropType && modulePropertyType === 'function') {
		gremlin[propertyName] = function () {
			// call the module first
			return [moduleProperty.apply(this, arguments), gremlinProperty.apply(this, arguments)];
		};
	} else {
		console.warn(`Can't decorate gremlin property »${gremlin.name}#${propertyName}:${gremlinPropertyType}« with »Module#${propertyName}:${modulePropertyType}«.
		Only functions can be decorated!`);
	}
}

module.exports = {
	mixinProps(gremlin) {
		var modules = getMixins(gremlin);
		// reverse the modules array to call decorated functions in the right order
		modules.reverse().forEach(Module => mixinModule(gremlin, Module));
	}
};
