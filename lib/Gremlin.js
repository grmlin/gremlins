'use strict';

var setPrototypeOf = require('setprototypeof');
var Gremlin = {

	create(spec) {
		var parent = this;

		if (typeof spec.name !== 'string'){
			throw new Error('A gremlin spec needs a »name« property! I won\'t be found otherwise');
		}
		if (typeof spec.initialize !== 'function' && typeof parent.initialize !== 'function') {
			spec.initialize = function(){};
		}
		setPrototypeOf(spec, parent);
		return Object.create(spec);
	}

};

module.exports = Gremlin;
