'use strict';

var domready = require('domready'),
	consoleShim = require('./consoleShim'),
	{create} = require('./Gremlin'),
	{observe} = require('./Collection');

var BRANDING = 'gremlins_connected';
consoleShim.create();

module.exports = {create};

domready(()=> {
	// we don't allow multiple gremlin.js scripts in a single page, strange and hard to debug things will happen otherwise
	if (document.documentElement[BRANDING]) {
		throw new Error('You tried to include gremlin.js multiple times. Don\'t do that.');
	}

	document.documentElement[BRANDING] = true;
	observe();
});
