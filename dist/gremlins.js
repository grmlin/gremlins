/*!gremlins.js 0.8.0 - (c) 2013-2015 Andreas Wehr - https://github.com/grmlin/gremlins - Licensed under MIT license*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var watched = require("watched");
var Factory = require("./Factory");

var DATA_NAME = "data-gremlin";
var NAME_SEPARATOR = ",";

function getNames(el) {
	var names = el.getAttribute(DATA_NAME);

	if (names) {
		var nameItems = names.split(NAME_SEPARATOR);
		return nameItems.map(function (name) {
			return name.trim();
		});
	} else {
		// TODO Error message
		return [];
	}
}

function addGremlins(element) {
	var names = getNames(element);
	names.forEach(function (name) {
		return Factory.createInstance(element, name);
	});
}

function checkAdded(addedElements) {
	addedElements.forEach(function (element) {
		return addGremlins(element);
	});
}

function checkRemoved() {}

module.exports = {

	observe: function observe() {
		var list = watched("[" + DATA_NAME + "]");
		list.on("added", checkAdded);
		list.on("removed", checkRemoved);

		// check the current Elements
		var elements = Array.prototype.slice.call(list);
		checkAdded(elements);
	}

};
/*removedElements*/

},{"./Factory":3,"watched":22}],2:[function(require,module,exports){
"use strict";

var uuid = require("./uuid");

var exp = "gremlins_" + uuid(),
    cache = {};

var gremlinId = (function () {
	var id = 1;
	return function () {
		return id++;
	};
})();

var hasId = function (element) {
	return element[exp] !== undefined;
},
    setId = function (element) {
	return element[exp] = gremlinId();
},
    getId = function (element) {
	return hasId(element) ? element[exp] : setId(element);
};

module.exports = {
	hasGremlin: function hasGremlin(element, name) {
		var id = getId(element);
		return cache[id] && cache[id][name] !== undefined;
	},

	addGremlin: function addGremlin(element, name, gremlin) {
		var id = getId(element);
		cache[id] = cache[id] || {};
		cache[id][name] = gremlin;
		//console.log(cache);
	}
};

},{"./uuid":8}],3:[function(require,module,exports){
"use strict";

var Data = require("./Data");
var Pool = require("./Pool");

module.exports = {
	createInstance: function createInstance(element, name) {

		Pool.fetch(name).then(function (Spec) {
			if (Data.hasGremlin(element, name)) {
				console.warn("Element already has a gremlin " + name, element);
			} else {
				console.info("Creating gremlin " + name, element);
				var gremlin = Object.create(Spec);
				Data.addGremlin(element, name, gremlin);

				gremlin.__init__(element);
			}
		}, function () {});
	}
};

// TODO

},{"./Data":2,"./Pool":5}],4:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("setprototypeof"),
    objectAssign = require("object-assign"),
    Pool = require("./Pool");

var Gremlin = {

	__init__: function __init__(element) {
		this.el = element;
		// Init plugins

		this.initialize();
	},

	create: function create(Spec) {
		var Parent = this,
		    newSpec = objectAssign({}, Spec);

		if (typeof newSpec.name !== "string") {
			throw new Error("A gremlin spec needs a »name« property! It can't be found otherwise");
		}
		if (newSpec.__init__ !== undefined) {
			throw new Error("The internal constructor »__init__« for the gremlin spec " + newSpec.name + " can't be overridden");
		}
		if (newSpec.create !== undefined) {
			console.warn("You are replacing the original create method for the spec " + newSpec.name + ". You know what you're doing, right?");
		}
		if (typeof newSpec.initialize !== "function" && typeof Parent.initialize !== "function") {
			newSpec.initialize = function () {};
		}

		// TODO extend with mixins
		// TODO extend with plugins
		setPrototypeOf(newSpec, Parent);
		return Pool.add(Object.create(newSpec));
	}

};

module.exports = Gremlin;

},{"./Pool":5,"object-assign":10,"setprototypeof":11}],5:[function(require,module,exports){
"use strict";

var specMap = {},
    pending = {},
    pendingTimers = {};

var PENDING_TIMEOUT = 3000;

var addSpec = function (name, Spec) {
	return specMap[name] = Spec;
};
var hasSpec = function (name) {
	return specMap[name] !== undefined;
};

function createRequest(name, resolve, reject) {
	var pendingRequest = { name: name, resolve: resolve, reject: reject };

	if (hasSpec(name)) {
		resolveRequest(pendingRequest);
	} else {
		pending[name] = pending[name] || [];
		pending[name].push(pendingRequest);
		pendingTimers[name] = pendingTimers[name] || setTimeout(function () {
			var requests = pending[name];
			if (requests) {
				console.warn("A spec for gremlin " + name + " is still missing. Did you include it?");
			}
		}, PENDING_TIMEOUT);
	}
}

function resolveRequest(_ref) {
	var name = _ref.name;
	var resolve = _ref.resolve;

	var Spec = specMap[name];
	resolve(Object.create(Spec));
}

function resolveAllPendingFor(name) {
	var requests = pending[name];
	clearTimeout(pendingTimers[name]);
	if (requests !== undefined && hasSpec(name)) {
		requests.forEach(resolveRequest);
		delete pending[name];
	}
}

module.exports = {
	add: function add(Spec) {
		var name = Spec.name;

		if (hasSpec(name)) {
			throw new Error("Trying to add new Gremlin spec, but a spec for " + name + " already exists.");
		}

		addSpec(name, Spec);
		resolveAllPendingFor(name);
		return Spec; //easy chaining
	},

	fetch: function fetch(name) {
		return new Promise(function (resolve, reject) {
			setTimeout(function () {
				return createRequest(name, resolve, reject);
			}, 10);
		});
	}
};

},{}],6:[function(require,module,exports){
(function (global){
"use strict";

var noop = function noop() {};
var types = ["log", "info", "warn"];
module.exports = {
	create: function create() {
		if (console === undefined) {
			global.console = {};
		}
		types.forEach(function (type) {
			if (typeof console[type] !== "function") {
				console[type] = noop();
			}
		});
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
"use strict";

var domready = require("domready");
var consoleShim = require("./consoleShim");
var _require = require("./Gremlin");

var create = _require.create;
var _require2 = require("./Collection");

var observe = _require2.observe;

var BRANDING = "gremlins_connected";
consoleShim.create();

module.exports = { create: create };

domready(function () {
	// we don't allow multiple gremlin.js scripts in a single page, strange and hard to debug things will happen otherwise
	if (document.documentElement[BRANDING]) {
		throw new Error("You tried to include gremlin.js multiple times. Don't do that.");
	}

	document.documentElement[BRANDING] = true;
	observe();
});

},{"./Collection":1,"./Gremlin":4,"./consoleShim":6,"domready":9}],8:[function(require,module,exports){
"use strict";

module.exports = function b(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, b);
};
// see https://gist.github.com/jed/982883

},{}],9:[function(require,module,exports){
/*!
  * domready (c) Dustin Diaz 2014 - License MIT
  */
!function (name, definition) {

  if (typeof module != 'undefined') module.exports = definition()
  else if (typeof define == 'function' && typeof define.amd == 'object') define(definition)
  else this[name] = definition()

}('domready', function () {

  var fns = [], listener
    , doc = document
    , hack = doc.documentElement.doScroll
    , domContentLoaded = 'DOMContentLoaded'
    , loaded = (hack ? /^loaded|^c/ : /^loaded|^i|^c/).test(doc.readyState)


  if (!loaded)
  doc.addEventListener(domContentLoaded, listener = function () {
    doc.removeEventListener(domContentLoaded, listener)
    loaded = 1
    while (listener = fns.shift()) listener()
  })

  return function (fn) {
    loaded ? fn() : fns.push(fn)
  }

});

},{}],10:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],11:[function(require,module,exports){
module.exports = Object.setPrototypeOf || {__proto__:[]} instanceof Array ? setProtoOf : mixinProperties;

function setProtoOf(obj, proto) {
	obj.__proto__ = proto;
}

function mixinProperties(obj, proto) {
	for (var prop in proto) {
		obj[prop] = proto[prop];
	}
}

},{}],12:[function(require,module,exports){
(function (global){
var existed = false;
var old;

if ('smokesignals' in global) {
    existed = true;
    old = global.smokesignals;
}

require('./smokesignals');

module.exports = smokesignals;

if (existed) {
    global.smokesignals = old;
}
else {
    delete global.smokesignals;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"./smokesignals":13}],13:[function(require,module,exports){
smokesignals = {
    convert: function(obj, handlers) {
        // we store the list of handlers as a local variable inside the scope
        // so that we don't have to add random properties to the object we are
        // converting. (prefixing variables in the object with an underscore or
        // two is an ugly solution)
        // we declare the variable in the function definition to use two less
        // characters (as opposed to using 'var ').  I consider this an inelegant
        // solution since smokesignals.convert.length now returns 2 when it is
        // really 1, but doing this doesn't otherwise change the functionallity of
        // this module, so we'll go with it for now
        handlers = {};

        // add a listener
        obj.on = function(eventName, handler) {
            // either use the existing array or create a new one for this event
            (handlers[eventName] || (handlers[eventName] = []))
                // add the handler to the array
                .push(handler);

            return obj;
        }

        // add a listener that will only be called once
        obj.once = function(eventName, handler) {
            // create a wrapper listener, that will remove itself after it is called
            function wrappedHandler() {
                // remove ourself, and then call the real handler with the args
                // passed to this wrapper
                handler.apply(obj.off(eventName, wrappedHandler), arguments);
            }
            // in order to allow that these wrapped handlers can be removed by
            // removing the original function, we save a reference to the original
            // function
            wrappedHandler.h = handler;

            // call the regular add listener function with our new wrapper
            return obj.on(eventName, wrappedHandler);
        }

        // remove a listener
        obj.off = function(eventName, handler) {
            // loop through all handlers for this eventName, assuming a handler
            // was passed in, to see if the handler passed in was any of them so
            // we can remove it
            for (var list = handlers[eventName], i = 0; handler && list && list[i]; i++) {
                // either this item is the handler passed in, or this item is a
                // wrapper for the handler passed in.  See the 'once' function
                list[i] != handler && list[i].h != handler ||
                    // remove it!
                    list.splice(i--,1);
            }
            // if i is 0 (i.e. falsy), then there are no items in the array for this
            // event name (or the array doesn't exist)
            if (!i) {
                // remove the array for this eventname (if it doesn't exist then
                // this isn't really hurting anything)
                delete handlers[eventName];
            }
            return obj;
        }

        obj.emit = function(eventName) {
            // loop through all handlers for this event name and call them all
            for(var list = handlers[eventName], i = 0; list && list[i];) {
                list[i++].apply(obj, list.slice.call(arguments, 1));
            }
            return obj;
        }

        return obj;
    }
}

},{}],14:[function(require,module,exports){
var helper = require('./util/helper'),
	constants = require('./util/constants'),
	LiveNodeList = require('./LiveNodeList'),
	QueryStrategyFactory = require('./domQueries/QueryStrategyFactory');


/**
 * @module watched/DomElement
 */




/**
 * Object used as prototype for new DomElement instances.
 * Should be used as a prototype for new `DomElement` instances
 *
 * @namespace module:watched/DomElement~DomElement
 */
var DomElement = {
	__name__: 'DomElement'
};

/**
 * Add all available queries to the DomElement's prototype
 */
constants.AVAILABLE_QUERIES.forEach(function (queryType) {
	DomElement[queryType] = function (selector) {
		// TODO tiny query factory, better do some error handling?
		var queryStrategy = QueryStrategyFactory.create(queryType, this.el, selector);

		return LiveNodeList(queryStrategy);
	};
});


/**
 * See [`querySelectorAll`](http://devdocs.io/dom/document.queryselectorall) for details.
 *
 * @function querySelectorAll
 * @memberof module:watched/DomElement~DomElement
 * @param {String} selector
 * @instance
 * @returns {module:watched/LiveNodeList~LiveNodeList}
 */

/**
 * See [`querySelector`](http://devdocs.io/dom/document.queryselector) for details. The returned object will be always
 * a `LiveNodeList`, not a single element as in the native `querySelector`.
 *
 * @function querySelector
 * @memberof module:watched/DomElement~DomElement
 * @param element
 * @instance
 * @returns {module:watched/LiveNodeList~LiveNodeList}
 */

/**
 * See [`getElementsByTagName`](http://devdocs.io/dom/element.getelementsbytagname) for details. Should be faster than
 * the query selectors, as **watched.js** uses the native live nodelist internally to get the elements you want.
 *
 * @function getElementsByTagName
 * @memberof module:watched/DomElement~DomElement
 * @param {String} selector
 * @instance
 * @returns {module:watched/LiveNodeList~LiveNodeList}
 */


/**
 * See [`getElementsByClassName`](http://devdocs.io/dom/document.getelementsbyclassname) for details. Should be faster
 * than the query selectors, as **watched.js** uses the native live nodelist internally to get the elements you want.
 *
 * @function getElementsByClassName
 * @memberof module:watched/DomElement~DomElement
 * @param {String} selector
 * @instance
 * @returns {module:watched/LiveNodeList~LiveNodeList}
 */


/**
 * factory method to create new `DomElement` instances
 *
 * @param {HTMLElement} element the HTMLElement used as root for all queries
 * @returns {module:watched/DomElement~DomElement}
 * @throws {Error|TypeError}
 * @example
 * var DomElement = require('./DomElement');
 * var domElement = DomElement(document);
 * var nodeList = domElement.querySelectorAll('.foo');
 */
module.exports = function(element){
	if (this instanceof module.exports) {
		throw new Error('The DomElement is a factory function, not a constructor. Don\'t use the new keyword with it');
	}
	if (helper.isInvalidDomElement(element)) {
		throw new TypeError('The element to watch has to be a HTMLElement! The type of the given element is ' + typeof element );
	}

	var domElement = Object.create(DomElement, {
		el : {
			value: element
		}
	});
	return domElement;
};
},{"./LiveNodeList":15,"./domQueries/QueryStrategyFactory":17,"./util/constants":20,"./util/helper":21}],15:[function(require,module,exports){
var smokesignals = require('smokesignals'),
	constants = require('./util/constants'),
	helper = require('./util/helper'),
	DomQuery = require('./domQueries/DomQuery'),
	NativeObserver = require('./observers/NativeObserver'),
	IntervalObserver = require('./observers/IntervalObserver');

// The one and only local instance of a mutation observer
var mutationObserver = Object.create(helper.hasMutationObserver ? NativeObserver : IntervalObserver);
mutationObserver.init();

/**
 * smokesignals event emitter
 *
 * @external {smokesignals}
 * @see https://bitbucket.org/bentomas/smokesignals.js
 */


/**
 * @Module watched/LiveNodeList
 */


/**
 * diffs two arrays, returns the difference
 *
 *  diff([1,2],[2,3,4]); //[1]
 *
 * @param {Array} target
 * @param {Array} other
 * @returns {Array}
 * @private
 */
var diff = function (target, other) {
	return target.filter(function (element) {
		return !helper.arrayContains(other, element);
	});
};


/**
 *
 * A live list of dom elements, always up to date.
 *
 * It's a live list, similar to the list returned by `getElementsBy(Tag|Class)Name`. But other than these queries,
 * the `LiveNodeList` dispatches event on changes!
 *
 * @namespace module:watched/LiveNodeList~LiveNodeList
 * @mixes external:smokesignals
 * @see {@link https://bitbucket.org/bentomas/smokesignals.js|smokesignals} for the event emitter library mixed into
 * `LiveNodeList`.
 * @fires module:watched/LiveNodeList~LiveNodeList#changed
 * @fires module:watched/LiveNodeList~LiveNodeList#added
 * @fires module:watched/LiveNodeList~LiveNodeList#removed
 */
var LiveNodeList = {
	/**
	 * name helper, mainly used for tests
	 * @private
	 * @instance
	 * */
	__name__: 'LiveNodeList',

	/**
	 * Initialize the LiveNodeList
	 * @param {DomQuery} elementQuery
	 * @instance
	 */
	init: function (elementQuery) {
		this._isActive = false;
		this._length = 0;
		this._query = elementQuery;
		this._onMutateHandler = this._onMutate.bind(this);
		this.resume();
	},

	_onMutate: function () {
		var oldElements = this._query.old(),
			currentElements = this._query.current(),
			addedElements, removedElements, wasAdded, wasRemoved;

		// 1. find all the added elements
		addedElements = diff(currentElements, oldElements);

		// 2. find all the removed elements
		removedElements = diff(oldElements, currentElements);

		// 3. update the nodelist array
		this._updateArray(currentElements);

		wasAdded = addedElements.length > 0;
		wasRemoved = removedElements.length > 0;

		if (wasAdded || wasRemoved) {
			/**
			 * LiveNodeList event
			 *
			 * Event called when new elements are added to or removed from the dom
			 *
			 * The event listeners callback will be called with one argument: an array containing all elements currently in the list
			 *
			 * @example
			 * nodeList.on('changed', function(currentElements){
			 *   console.log(currentElements);
			 * });
			 *
			 * @event module:watched/LiveNodeList~LiveNodeList#changed
			 * @param {HTMLElement[]} currentElements current elements. These are the same as in the `LiveNodeList`, but in a
			 * native array
			 */
			this._bubble(constants.CUSTOM_EVENT_ON_ELEMENTS_CHANGED, currentElements);
		}
		if (wasAdded) {
			/**
			 * LiveNodeList event
			 * Event called when new elements are added to the dom
			 *
			 * The event listeners callback will be called with one argument: an array containing the newly found dom elements
			 *
			 * @example
			 * nodeList.on('added', function(newElements){
			 *   console.log(newElements);
			 * });
			 *
			 * @event module:watched/LiveNodeList~LiveNodeList#added
			 * @param {HTMLElement[]} addedElements the added elements
			 */
			this._bubble(constants.CUSTOM_EVENT_ON_ELEMENTS_ADDED, addedElements);
		}
		if (wasRemoved) {
			/**
			 * LiveNodeList event
			 * Event called when elements are removed from the dom
			 *
			 * The event listeners callback will be called with one argument: an array `removedElements` containing the dom elements removed from the list (removed from the dom)
			 *
			 * @example
			 * nodeList.on('removed', function(removedElements){
			 *   console.log(removedElements);
			 * });
			 *
			 * @event module:watched/LiveNodeList~LiveNodeList#removed
			 * @param {HTMLElement[]} removedElements elements removed from the `LiveNodeList`
			 */
			this._bubble(constants.CUSTOM_EVENT_ON_ELEMENTS_REMOVED, removedElements);
		}

	},
	_updateArray: function (currentElements) {
		this._deleteArray();
		this._length = currentElements.length;
		currentElements.forEach(function (el, index) {
			this[index] = el;
		}, this);
	},
	_deleteArray: function () {
		Array.prototype.splice.call(this, 0);
		this._length = 0;
	},
	_bubble: function (eventType, elementList) {
		this.emit(eventType, elementList);
	},

	/**
	 * see the native [`Array.forEach`](http://devdocs.io/javascript/global_objects/array/foreach) for details.
	 *
	 *
	 * @example
	 * nodeList.forEach(function(element){
	 *   element.style.color = "green";
	 * });
	 *
	 * @param {Function} callback
	 * @param {Object} [thisArg] optional context object
	 *
	 * @instance
	 * */
	forEach: function (callback, thisArg) {
		Array.prototype.forEach.apply(this, arguments);
	},

	/**
	 * Freezes the nodelist in it's current form and pauses the dom mutation listener
	 *
	 * @instance
	 * @example
	 * nodeList.pause();
	 */
	pause: function () {
		this._isActive = false;
		mutationObserver.off(constants.CUSTOM_EVENT_ON_MUTATION, this._onMutateHandler);
	},

	/**
	 * Resume the query and listen to dom mutations again.
	 * Creating a LiveNodeList will do that initially for you.
	 *
	 * @example
	 * nodelist.resume();
	 *
	 * @instance
	 */
	resume: function () {
		if (!this._isActive) {
			this._isActive = true;
			this._updateArray(this._query.current());
			mutationObserver.on(constants.CUSTOM_EVENT_ON_MUTATION, this._onMutateHandler);
		}
	}
};

/**
 * The length of the node list.
 *
 * *you can't set the length, so tricks known to work with the native array won't have any effect here*
 *
 * @member length
 * @memberof module:watched/LiveNodeList~LiveNodeList
 * @type {number}
 * @instance
 */

Object.defineProperty(LiveNodeList, 'length', {
	get: function () {
		return this._length;
	},
	set: function (/*length*/) {
		// Don't delete this one. `Array.prototype.slice.call(this, 0)` may call this setter
	}
});

/**
 * Add an event listener to the LiveNodeList
 *
 * @function on
 * @memberof module:watched/LiveNodeList~LiveNodeList
 * @param {string} eventName The name of the event
 * @param {function} handler a callback function
 * @instance
 */

/**
 * Add an event listener to the LiveNodeList that will only be called **once**
 *
 * @function once
 * @memberof module:watched/LiveNodeList~LiveNodeList
 * @param {string} eventName The name of the event
 * @param {function} handler a callback function
 * @instance
 */

/**
 * Removes an event listener from the LiveNodeList
 *
 * @function off
 * @memberof module:watched/LiveNodeList~LiveNodeList
 * @param {string} eventName The name of the event
 * @param {function} [handler] a callback function
 * @instance
 */

/**
 * Emit an event.
 *
 * Normally you don't do that, but it's part of the `LiveNodeList`'s prototype, so it's documented here
 *
 * @function emit
 * @memberof module:watched/LiveNodeList~LiveNodeList
 * @param {string} eventName The name of the event
 * @param {...*} eventData event data passed into the event callbacks
 * @instance
 */

smokesignals.convert(LiveNodeList);

/**
 * factory method to create new `LiveNodeList` objects
 *
 * @param {Function} queryStrategy a query created with {@link module:domQueries/QueryStrategyFactory.create}
 * @returns {module:watched/LiveNodeList~LiveNodeList}
 */
module.exports = function (queryStrategy) {
	if (this instanceof module.exports) {
		throw new Error('The LiveNodeList is a factory function, not a constructor. Don\'t use the new keyword with it');
	}

	var query = Object.create(DomQuery),
		nodeList = Object.create(LiveNodeList);

	query.init(queryStrategy);
	nodeList.init(query);
	return nodeList;
};



},{"./domQueries/DomQuery":16,"./observers/IntervalObserver":18,"./observers/NativeObserver":19,"./util/constants":20,"./util/helper":21,"smokesignals":12}],16:[function(require,module,exports){
var helper = require('../util/helper');

/**
 * A DomQuery, used to store old and new node lists.
 *
 * @module watched/DomQueries/DomQuery
 */

/**
 * The object used to create new DomQueries
 */
module.exports = {
	/**
	 * Initialize the DomQuery
	 *
	 * @param {module:watched/domQueries/QueryStrategyFactory~Strategies} strategy
	 */
	init: function (strategy) {
		this._query = strategy;
		this._old = [];
	},

	/**
	 * Returns the last query result
	 * @returns {Array.<HTMLElement>}
	 */
	old: function () {
		return helper.arrayClone(this._old);
	},

	/**
	 * Returns the current query result.
	 *
	 * This will overwrite the old query.
	 * @returns {Array.<HTMLElement>}
	 */
	current: function () {
		this._old = this._query();
		return helper.arrayClone(this._old);
	}
};
},{"../util/helper":21}],17:[function(require,module,exports){
/**
 * @module watched/domQueries/QueryStrategyFactory
 */


var constants = require('../util/constants'),
	helper = require('../util/helper'),
	/**
	 * @namespace module:watched/domQueries/QueryStrategyFactory~Strategies
	 */
	Strategies = {};


var filterNodesInDocument = function (nodeArray) {
	return nodeArray.filter(function (node) {
		return document.documentElement.contains(node);
	});
};

/**
 * `element.querySelectorAll` strategy
 *
 * @function querySelectorAll
 * @memberof module:watched/domQueries/QueryStrategyFactory~Strategies
 * @param {HTMLElement} element
 * @param {String} selector
 * @returns {Function} wrapped version of `element.querySelectorAll(selector)`
 */
Strategies[constants.queries.QUERY_SELECTOR_ALL] = function (element, selector) {
	return function () {
		var nodeList = element[constants.queries.QUERY_SELECTOR_ALL](selector);
		return filterNodesInDocument(helper.nodeListToArray(nodeList));
	};
};

/**
 * `element.querySelector` strategy
 *
 * @function querySelector
 * @memberof module:watched/domQueries/QueryStrategyFactory~Strategies
 * @param {HTMLElement} element
 * @param {String} selector
 * @returns {Function} wrapped version of `element.querySelector(selector)`
 */
Strategies[constants.queries.QUERY_SELECTOR] = function (element, selector) {
	return function () {
		var node = element[constants.queries.QUERY_SELECTOR](selector);
		return filterNodesInDocument(node === null ? [] : [node]);
	};
};

/**
 * `element.getElementsByTagName` strategy
 *
 * @function getElementsByTagName
 * @memberof module:watched/domQueries/QueryStrategyFactory~Strategies
 * @param {HTMLElement} element
 * @param {String} tagName
 * @returns {Function} wrapped version of `element.getElementsByTagName(tagName)`
 */
Strategies[constants.queries.GET_ELEMENTS_BY_TAG_NAME] = function (element, tagName) {
	// a live list, has to be called once, only
	var nodeList = element[constants.queries.GET_ELEMENTS_BY_TAG_NAME](tagName);
	return function () {
		return filterNodesInDocument(helper.nodeListToArray(nodeList));
	};
};

/**
 * `element.getElementsByClassName` strategy
 *
 * @function getElementsByClassName
 * @memberof module:watched/domQueries/QueryStrategyFactory~Strategies
 * @param {HTMLElement} element
 * @param {String} className
 * @returns {Function} wrapped version of `element.querySelectorAll(className)`
 */
Strategies[constants.queries.GET_ELEMENTS_BY_CLASS_NAME] = function (element, className) {
	// a live list, has to be called once, only
	var nodeList = element[constants.queries.GET_ELEMENTS_BY_CLASS_NAME](className);
	return function () {
		return filterNodesInDocument(helper.nodeListToArray(nodeList));
	};
};

module.exports = {

	/**
	 * Create a query function used with a dom element
	 *
	 * @example
	 * var query = QueryStrategyFactory.create('querySelectorAll', document, '.foo');
	 * query(); // [el1, el2, ...]
	 *
	 * @param {String} strategyType the query type
	 * @param {HTMLElement} element
	 * @param {String} selector
	 * @returns {Function} a wrapped query function for the dom element `element`, query `strategyType` and the selector
	 * `selector`
	 */
	create: function (strategyType, element, selector) {
		//console.time("query");
		//console.log("executing query: ", strategyType + "("+selector+")");
		//var result = Strategies[strategyType](element, selector);
		//console.timeEnd("query");
		//return result;
		return Strategies[strategyType](element, selector);
	}
};
},{"../util/constants":20,"../util/helper":21}],18:[function(require,module,exports){
var smokesignals = require('smokesignals'),
		helper       = require('../util/helper'),
		constants    = require('../util/constants');

/**
 * DomObserver using a timeout. Used if the native Observer is not available
 *
 * @module watched/observers/IntervalObserver
 */

var allElementsLive = document.getElementsByTagName('*'),
		getAllAsArray   = function () {
			return helper.nodeListToArray(allElementsLive);
		},
		hasChanged      = function (oldElements, newElements) {
			if (oldElements.length !== newElements.length) {
				return true;
			}

			// check if the arrays contain
			return oldElements.some(function (element, index) {
				return element !== newElements[index];
			});
		};


var IntervalObserver = {
	init: function () {
		this._currentElements = getAllAsArray();
		this._initialize();
	},
	_initialize: function () {
		var _this = this,
				start = function () {
					setTimeout(tick, constants.INTERVAL_OBSERVER_RESCAN_INTERVAL);
				},
				tick  = function () {
					_this._checkDom();
					start();
				};

		start();
	},
	_checkDom: function () {
		var newElements = getAllAsArray();
		if (hasChanged(this._currentElements, newElements)) {
			this._currentElements = newElements;
			this.emit(constants.CUSTOM_EVENT_ON_MUTATION);
		}

	}
};

smokesignals.convert(IntervalObserver);


module.exports = IntervalObserver;

},{"../util/constants":20,"../util/helper":21,"smokesignals":12}],19:[function(require,module,exports){
/**
 * Native dom observer using {@link external:MutationObserver}
 *
 * @module watched/observers/NativeObserver
 */

var smokesignals      = require('smokesignals'),
		helper = require('../util/helper'),
		constants = require('../util/constants'),
		opts              = {
			childList: true,
			subtree: true
		},
		isElementMutation = function (mutation) {
			return mutation.addedNodes !== null || mutation.removedNodes !== null;
		};

var NativeObserver = {

	init: function(){
		this._observer = new helper.NativeMutationObserver(this._onMutation.bind(this));
		this._observer.observe(document, opts);
	},

	_onMutation: helper.debounce(function (mutations) {
			if (mutations.some(isElementMutation, this)) {
				this.emit(constants.CUSTOM_EVENT_ON_MUTATION);
			}
		}, constants.MUTATION_DEBOUNCE_DELAY)
};

smokesignals.convert(NativeObserver);

module.exports = NativeObserver;
},{"../util/constants":20,"../util/helper":21,"smokesignals":12}],20:[function(require,module,exports){
/**
 * Constants used throughout the library
 *
 * @module watched/util/constants
 */

var constants = {

	MUTATION_DEBOUNCE_DELAY : 20,// bubble dom changes in batches.
	INTERVAL_OBSERVER_RESCAN_INTERVAL : 500,
	CUSTOM_EVENT_ON_MUTATION : 'CUSTOM_EVENT_ON_MUTATION',
	CUSTOM_EVENT_ON_ELEMENTS_ADDED : 'added',
	CUSTOM_EVENT_ON_ELEMENTS_REMOVED : 'removed',
	CUSTOM_EVENT_ON_ELEMENTS_CHANGED : 'changed',
	AVAILABLE_QUERIES: [],
	queries: {
		QUERY_SELECTOR_ALL : 'querySelectorAll',
		QUERY_SELECTOR : 'querySelector',
		GET_ELEMENTS_BY_TAG_NAME : 'getElementsByTagName',
		GET_ELEMENTS_BY_CLASS_NAME : 'getElementsByClassName'
	}

};

//constants.queries
Object.keys(constants.queries).forEach(function(index){
	constants.AVAILABLE_QUERIES.push(constants.queries[index]);
});

module.exports = constants;
},{}],21:[function(require,module,exports){
var constants = require('./constants');

var INDEX_OF_FAIL = -1;

var hasMutationObserver = !!(window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver),
	NativeMutationObserver = hasMutationObserver ? MutationObserver || WebKitMutationObserver || MozMutationObserver : null;

/**
 * @external {MutationObserver}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver
 */

/**
 * @external {HTMLElement}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement
 */

/**
 * @external {NodeList}
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeList
 */

/**
 * Helper methods/properties used with watched.js
 *
 * @module watched/util/helper
 */

module.exports = {

	/**
	 * True, if a native mutation observer exists
	 * @type {boolean}
	 */
	hasMutationObserver: hasMutationObserver,

	/**
	 * Mutation observer object. `null`, if {@link watched/util/helper.hasMutationObserver} is false
	 * @type {MutationObserver}
	 */
	NativeMutationObserver: NativeMutationObserver,

	/**
	 * Checks if `el` isn't a valid dom element
	 * @param el
	 * @returns {boolean}
	 */
	isInvalidDomElement: function (el) {
		if (el) {
			return constants.AVAILABLE_QUERIES.some(function (query) {
				return typeof el[query] !== 'function';
			});
		} else {
			return true;
		}
	},

	/**
	 * Transforms a nodelist you get from native browser queries to an array
	 * @param {NodeList} nodeList
	 * @returns {Array.<HTMLElement>}
	 */
	nodeListToArray: function (nodeList) {
		return Array.prototype.slice.call(nodeList);
	},

	/**
	 * Checks if an array contains an element
	 * @param {Array} list
	 * @param {*} element
	 * @returns {boolean}
	 */
	arrayContains: function (list, element) {
		return list.indexOf(element) !== INDEX_OF_FAIL;
	},

	/**
	 * Clones an array
	 * @param {Array} arr
	 * @returns {Array}
	 */
	arrayClone: function (arr) {
		return arr.slice(0);
	},

	/**
	 * Debounce the call of a function
	 * @param {Function} a the function to debounce
	 * @param {Number} b the debounce delay
	 * @param {boolean} c immediate
	 * @returns {Function}
	 */
	debounce: function (a, b, c) {
		var d;
		return function () {
			var e = this, f = arguments;
			clearTimeout(d), d = setTimeout(function () {
				d = null, c || a.apply(e, f)
			}, b), c && !d && a.apply(e, f);
		}
	}
};
},{"./constants":20}],22:[function(require,module,exports){
var DomElement = require('./src/DomElement');
/**
 * @module watched
 */

/**
 * Creates a `LiveNodeList` directly or a decorated `HTMLElement` as `DomElement` to get lists with
 * different queries by yourself.
 *
 * Use a selector to get a `LiveNodeList` or an `HTMLElement` for complete control
 *
 *
 * @example
 * var foos = watched('.foo'); // LiveNodeList
 * var foos = watched(document).querySelectorAll('.foo'); // DomElement
 *
 *
 * @param {String|HTMLElement} element A selector string to use with `querySelectorAll` on the `document` or a dom
 * element
 * @returns {module:LiveNodeList~LiveNodeList|module:DomElement~DomElement}
 */
module.exports = function (element) {
	if (this instanceof module.exports) {
		throw new Error('watched is a factory function, not a constructor. Don\'t use the new keyword with it');
	}

	// a string will be used as a querySelectorAll shortcut on the document element
	if (typeof element === 'string') {
		return DomElement(document).querySelectorAll(element);
	} else {
		return DomElement(element);
	}
};
},{"./src/DomElement":14}]},{},[7])(7)
});