'use strict';


/**
 * # gremlin.js
 * dead simple web components
 *
 * ## `gremlins`
 * The gremlin.js public namespace/module
 *
 */
/*!
 * Dependencies
 */
var consoleShim = require('./consoleShim'),
	Gremlin = require('./Gremlin');

// let's add a branding so we can't include more than one instance of gremlin.js
var BRANDING = 'gremlins_connected';

if (document.documentElement[BRANDING]) {
	throw new Error('You tried to include gremlin.js multiple times. This will not work');
}
consoleShim.create();


document.documentElement[BRANDING] = true;

/**
 * Creates a new gremlin specification.
 *
 * ### Example
 *     var gremlins = require('gremlins');
 *
 *     gremlins.create({
 *       name: 'Foo'
 *     });
 *
 * @param {Object} Spec The gremlin specification
 * @return {Object} The final spec created, later used as a prototype for new components of this type
 * @method create
 * @api public
 */
exports.create = Gremlin.create;

