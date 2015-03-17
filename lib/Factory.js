'use strict';
var Data = require('./Data');
var Pool = require('./Pool');

module.exports = {
	createInstance(element, name) {

		Pool.fetch(name).then(Spec => {
			if (Data.hasGremlin(element, name)) {
				console.warn(`Element already has a gremlin ${name}`, element);
			} else {
				console.info(`Creating gremlin ${name}`, element);
				let gremlin = Object.create(Spec);
				Data.addGremlin(element, name, gremlin);

				gremlin.__init__(element);
			}
		}, () => {
			// TODO
		});


	}
};
