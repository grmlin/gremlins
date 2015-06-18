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

var addSpec = (tagName, Spec) => specMap[tagName] = Spec;
var hasSpec = tagName => specMap[tagName] !== undefined;

var Gremlin = {

	initialize() {
	},

	destroy() {
	},

	create(tagName, Spec = {}) {
		var Parent = this,
			NewSpec = Object.create(Parent, {
				name: {
					value: tagName,
					writable: true
				}
			});

		if (typeof tagName !== 'string') {
			throw new TypeError('Gremlins.create expects the gremlins tag name as a first argument');
		}
		if (hasSpec(tagName)) {
			throw new Error(`Trying to add new Gremlin spec, but a spec for ${tagName} already exists.`);
		}
		if (Spec.create !== undefined) {
			console.warn(`You are replacing the original create method for the spec of ${tagName}. You know what you're doing, right?`);
		}

		// set up the prototype chain
		objectAssign(NewSpec, Spec);
		// extend the spec with it's Mixins
		Mixins.mixinProps(NewSpec);
		// remember this name
		addSpec(tagName, NewSpec);
		// and create the custom element for it
		GremlinElement.register(tagName, NewSpec);
		return NewSpec;
	}

};

module.exports = Gremlin;
