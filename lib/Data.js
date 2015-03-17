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
	addGremlin(element, name) {
		var id = getId(element);
		cache[id] = cache[id] || {};
		cache[id][name] = {};
		console.log(cache);
	}
};


