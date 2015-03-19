'use strict';

var setPrototypeOf = require('setprototypeof'),
	objectAssign = require('object-assign'),
	Pool = require('./Pool');

var Gremlin = {

	create(Spec) {
		var Parent = this,
			newSpec = objectAssign({}, Spec);

		if (typeof newSpec.name !== 'string') {
			throw new Error('A gremlin spec needs a »name« property! It can\'t be found otherwise');
		}
		if (newSpec.create !== undefined) {
			console.warn(`You are replacing the original create method for the spec ${newSpec.name}. You know what you're doing, right?`);
		}
		if (typeof newSpec.initialize !== 'function' && typeof Parent.initialize !== 'function') {
			newSpec.initialize = function () {
			};
		}

		setPrototypeOf(newSpec, Parent);
		return Pool.add(newSpec);
	}

};

module.exports = Gremlin;
