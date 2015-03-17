'use strict';

var setPrototypeOf = require('setprototypeof'),
	objectAssign = require('object-assign'),
	Pool = require('./Pool');

var Gremlin = {

	__init__(element) {
		this.el = element;
		// Init plugins

		this.initialize();
	},

	create(Spec) {
		var Parent = this,
			newSpec = objectAssign({}, Spec);

		if (typeof newSpec.name !== 'string') {
			throw new Error('A gremlin spec needs a »name« property! It can\'t be found otherwise');
		}
		if (newSpec.__init__ !== undefined) {
			throw new Error(`The internal constructor »__init__« for the gremlin spec ${newSpec.name} can\'t be overridden`);
		}
		if (newSpec.create !== undefined) {
			console.warn(`You are replacing the original create method for the spec ${newSpec.name}. You know what you're doing, right?`);
		}
		if (typeof newSpec.initialize !== 'function' && typeof Parent.initialize !== 'function') {
			newSpec.initialize = function () {
			};
		}

		// TODO extend with mixins
		// TODO extend with plugins
		setPrototypeOf(newSpec, Parent);
		return Pool.add(Object.create(newSpec));
	}

};

module.exports = Gremlin;
