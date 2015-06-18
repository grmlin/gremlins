'use strict';
var Factory = require('./Factory'),
	Data = require('./Data');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
	throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var addInstance = function (element, Spec) {
	var gremlin = Factory.createInstance(element, Spec);
	Data.addGremlin(gremlin, element);
	gremlin.initialize();
};

var removeInstance = function (element) {
	Data.getGremlin(element).destroy();
};


module.exports = {
	register(tagName, Spec) {
		var proto = {
			attachedCallback: {
				value: function () {
					addInstance(this, Spec);
				}
			},
			detachedCallback: {
				value: function () {
					removeInstance(this);
				}
			}
		};

		var El = document.registerElement(tagName, {
				name: tagName,
				prototype: Object.create(HTMLElement.prototype, proto)
			}
		);
		return El;
	}
};

