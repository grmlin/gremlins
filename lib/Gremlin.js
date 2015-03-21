'use strict';

var objectAssign = require('object-assign'),
	Mixins = require('./Mixins'),
	GremlinElement = require('./GremlinElement');

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
var specMap = {};

var addSpec = (name, Spec) => specMap[name] = Spec;
var hasSpec = name => specMap[name] !== undefined;

var Gremlin = {

	initialize() {
	},

	destroy() {
	},

	create(Spec) {
		var Parent = this,
			NewSpec = Object.create(Parent),
			name = Spec.name;

		if (typeof name !== 'string') {
			throw new Error('A gremlin spec needs a »name« property! It can\'t be found otherwise');
		}
		if (hasSpec(name)) {
			throw new Error(`Trying to add new Gremlin spec, but a spec for ${name} already exists.`);
		}
		if (Spec.create !== undefined) {
			console.warn(`You are replacing the original create method for the spec ${name}. You know what you're doing, right?`);
		}


		// set up the prototype chain
		objectAssign(NewSpec, Spec);
		// extend the spec with it's Mixins
		Mixins.mixinProps(NewSpec);
		// remember this name
		addSpec(name, NewSpec);
		// and create the custom element for it
		GremlinElement.register(NewSpec);
		return NewSpec;
	}

};

module.exports = Gremlin;
