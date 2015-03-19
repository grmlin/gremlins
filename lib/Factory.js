'use strict';
var Data = require('./Data'),
	Pool = require('./Pool');

function initialize(gremlin, element) {

	function init() {
		this.el = element;
		// call the constructor
		this.initialize();
	}

	init.call(gremlin);

}

module.exports = {
	createInstance(element, name) {

		Pool.fetch(name, Spec => {
			if (Data.hasGremlin(element, name)) {
				console.warn(`Element already has a gremlin ${name}`, element);
			} else {
				console.info(`Creating gremlin ${name}`, element);
				let gremlin = Object.create(Spec);
				initialize(gremlin, element);
				Data.addGremlin(gremlin);
			}
		});


	}
};
