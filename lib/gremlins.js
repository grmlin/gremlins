'use strict';

var domready = require('domready'),
	{create} = require('./Gremlin'),
	{observe} = require('./Collection');

module.exports = {
	create
};

domready(()=>observe());
