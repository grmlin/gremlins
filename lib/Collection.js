'use strict';
var watched = require('watched');
var Factory = require('./Factory');

var DATA_NAME = 'data-gremlin';
var NAME_SEPARATOR = ',';

function getNames(el) {
	var names = el.getAttribute(DATA_NAME);

	if (names) {
		var nameItems = names.split(NAME_SEPARATOR);
		return nameItems.map(name => name.trim());
	} else {
		// TODO Error message
		return [];
	}
}

function addGremlins(element) {
	var names = getNames(element);
	names.forEach(name => Factory.createInstance(element, name));
}

function checkAdded(addedElements) {
	addedElements.forEach(element => addGremlins(element));
}

function checkRemoved(/*removedElements*/) {

}

module.exports = {

	observe() {
		var list = watched(`[${DATA_NAME}]`);
		list.on('added', checkAdded);
		list.on('removed', checkRemoved);

		// check the current Elements
		var elements = Array.prototype.slice.call(list);
		checkAdded(elements);
	}


};
