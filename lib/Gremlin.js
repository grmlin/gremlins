'use strict';

var Gremlin = {

	create(spec) {
		var parent = this;
		Object.setPrototypeOf(spec, parent);
		return Object.create(spec);
	}

};

module.exports = Gremlin;