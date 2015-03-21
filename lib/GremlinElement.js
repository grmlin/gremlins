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
};

var removeInstance = function (element) {
	Data.getGremlin(element).destroy();
};


module.exports = {
	register(Spec) {
		var name = Spec.name,
			tagName = Spec.tagName,
			hasTagName = typeof tagName === 'string',
			proto = {
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

		tagName = hasTagName ? tagName : name.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase() + '-gremlin';

		var El = document.registerElement(tagName, {
				name: tagName,
				prototype: Object.create(HTMLElement.prototype, proto)
			}
		);
		return El;
	}
};

