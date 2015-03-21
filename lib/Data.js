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
	addGremlin(gremlin, element) {
		var id = getId(element);

		if (cache[id] !== undefined) {
			console.warn(`You can't add another gremlin to this element, it already uses one!`, element);
		} else{
			cache[id] = gremlin;
		}
	},

	getGremlin(element) {
		var id = getId(element),
			gremlin = cache[id];

		if (gremlin === undefined) {
			console.warn(`This dom element does not use any gremlins!`, element);
		}
		return gremlin;
	}
};


