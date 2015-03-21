'use strict';

function initialize(gremlin, element) {

	function init() {
		this.el = element;
		// call the constructor
		this.initialize();
	}

	init.call(gremlin);

}

module.exports = {
	createInstance(element, Spec) {
		//var Spec = Pool.get(name);
		//var name = Spec.name;
		//console.info(`Creating gremlin ${name}`, element);
		let gremlin = Object.create(Spec);
		initialize(gremlin, element);
		return gremlin;
	}
};
