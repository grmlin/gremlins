'use strict';
var Factory = require('./Factory');
var Data = require('./Data');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
	throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style'),
	styleSheet;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

var addInstance = function (element, Spec) {
	var gremlin = Factory.createInstance(element, Spec);
	Data.addGremlin(gremlin, element);
	gremlin.initialize();
};

var removeInstance = function (element) {
	Data.getGremlin(element).destroy();
};

var updateAttr = function (element, name, previousValue, value) {
	var gremlin = Data.getGremlin(element);

	if (gremlin !== null) {
		gremlin.attributeDidChange(name, previousValue, value);
	}
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
			},
			attributeChangedCallback: {
				value: function (name, previousValue, value) {
					updateAttr(this, name, previousValue, value);
				}
			}
		};

		// insert the rule BEFORE registering the element. This is important because they may be inline otherwise when first initialized.
		styleSheet.insertRule(`${tagName} { display: block }`, 0);

		var El = document.registerElement(tagName, {
				name: tagName,
				prototype: Object.create(HTMLElement.prototype, proto)
			}
		);

		return El;
	}
};

