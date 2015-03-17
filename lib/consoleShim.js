'use strict';
var noop = function () {
};
var types = ['log', 'info', 'warn'];
module.exports = {
	create() {
		if (console === undefined) {
			global.console = {};
		}
		types.forEach(type=> {
			if (typeof console[type] !== 'function') {
				console[type] = noop();
			}
		});
	}
};
