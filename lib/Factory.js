'use strict';

module.exports = {
	createInstance(element, Spec) {
		var gremlin = Object.create(Spec, {
			el: {
				value: element,
				writable: false
			}
		});
		return gremlin;
	}
};
