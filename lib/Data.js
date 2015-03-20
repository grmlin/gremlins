'use strict';

var uuid = require('./uuid');

var exp = `gremlins_${uuid()}`,
	cache = {};

var gremlinId = (function () {
	var id = 1;
	return ()=>id++;
}());

var hasId = (element)=>element[exp] !== undefined,
	setId = (element) => element[exp] = gremlinId(),
	getId = (element)=> hasId(element) ? element[exp] : setId(element);

module.exports = {
	hasGremlin(element, name) {
		var id = getId(element);
		return cache[id] && cache[id][name] !== undefined;
	},

	addGremlin(gremlin) {
		var element = gremlin.el,
			name = gremlin.name,
			id = getId(element);
		cache[id] = cache[id] || {};
		cache[id][name] = gremlin;
	},

	getGremlins(element) {
		var id = getId(element),
			gremlins = cache[id];

		return typeof gremlins === 'object' ? Object.keys(gremlins).map(name=>gremlins[name]) : [];
	}
};


