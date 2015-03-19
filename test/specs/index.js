(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/gremlins");

},{"./lib/gremlins":13}],2:[function(require,module,exports){
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

},{"./Factory":4,"watched":28}],3:[function(require,module,exports){
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

	addGremlin: function addGremlin(gremlin) {
		var element = gremlin.el,
		    name = gremlin.name,
		    id = getId(element);
		cache[id] = cache[id] || {};
		cache[id][name] = gremlin;
	}
};

},{"./uuid":14}],4:[function(require,module,exports){
"use strict";

var Data = require("./Data"),
    Pool = require("./Pool");

function initialize(gremlin, element) {

	function init() {
		this.el = element;
		// call the constructor
		this.initialize();
	}

	init.call(gremlin);
}

module.exports = {
	createInstance: function createInstance(element, name) {

		Pool.fetch(name, function (Spec) {
			if (Data.hasGremlin(element, name)) {
				console.warn("Element already has a gremlin " + name, element);
			} else {
				console.info("Creating gremlin " + name, element);
				var gremlin = Object.create(Spec);
				initialize(gremlin, element);
				Data.addGremlin(gremlin);
			}
		});
	}
};

},{"./Data":3,"./Pool":7}],5:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("setprototypeof"),
    objectAssign = require("object-assign"),
    Pool = require("./Pool");

var Gremlin = {

	create: function create(Spec) {
		var Parent = this,
		    newSpec = objectAssign({}, Spec);

		if (typeof newSpec.name !== "string") {
			throw new Error("A gremlin spec needs a »name« property! It can't be found otherwise");
		}
		if (newSpec.create !== undefined) {
			console.warn("You are replacing the original create method for the spec " + newSpec.name + ". You know what you're doing, right?");
		}
		if (typeof newSpec.initialize !== "function" && typeof Parent.initialize !== "function") {
			newSpec.initialize = function () {};
		}

		setPrototypeOf(newSpec, Parent);
		return Pool.add(newSpec);
	}

};

module.exports = Gremlin;

},{"./Pool":7,"object-assign":16,"setprototypeof":17}],6:[function(require,module,exports){
"use strict";

var getMixins = function (gremlin) {
	return Array.isArray(gremlin.mixins) ? gremlin.mixins : gremlin.mixins ? [gremlin.mixins] : [];
};

function mixinModule(gremlin, Module) {

	Object.keys(Module).forEach(function (propertyName) {
		var property = Module[propertyName];

		if (gremlin[propertyName] === undefined) {
			gremlin[propertyName] = property;
		} else {
			decorateProperty(gremlin, propertyName, property);
		}
	});
}
function decorateProperty(gremlin, propertyName, property) {
	var gremlinProperty = gremlin[propertyName],
	    moduleProperty = property,
	    gremlinPropertyType = typeof gremlinProperty,
	    modulePropertyType = typeof moduleProperty,
	    isSamePropType = gremlinPropertyType === modulePropertyType;

	if (isSamePropType && modulePropertyType === "function") {
		gremlin[propertyName] = function () {
			// call the module first
			return [moduleProperty.apply(this, arguments), gremlinProperty.apply(this, arguments)];
		};
	} else {
		console.warn("Can't decorate gremlin property »" + gremlin.name + "#" + propertyName + ":" + gremlinPropertyType + "« with »Module#" + propertyName + ":" + modulePropertyType + "«.\n\t\tOnly functions can be decorated!");
	}
}

module.exports = {
	mixinProps: function mixinProps(gremlin) {
		var modules = getMixins(gremlin);
		// reverse the modules array to call decorated functions in the right order
		modules.reverse().forEach(function (Module) {
			return mixinModule(gremlin, Module);
		});
	}
};

},{}],7:[function(require,module,exports){
"use strict";

var Mixins = require("./Mixins");

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

function createRequest(name, callback) {
	var pendingRequest = { name: name, callback: callback };

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
	var callback = _ref.callback;

	var Spec = specMap[name];
	callback(Spec);
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

		// extend the spec with it's Mixins
		Mixins.mixinProps(Spec);
		addSpec(name, Spec);
		resolveAllPendingFor(name);
		return Spec; //easy chaining
	},

	fetch: function fetch(name, cb) {
		setTimeout(function () {
			return createRequest(name, cb);
		}, 10);
	}
};

},{"./Mixins":6}],8:[function(require,module,exports){
"use strict";

var Gremlin = require("../Gremlin");

describe("Gremlin", function () {
	var Gizmo = Gremlin.create({
		name: "Gizmo",
		foo: function foo() {
			return "foo";
		}
	});

	it("can create gremlins", function () {
		expect(Gizmo.create).to.be.a("function");
		expect(Gizmo.foo).to.be.a("function");
	});

	// TODO: not in IE<11
	it("sets up a prototype chain", function () {
		var proto = {
			name: "Stripe",
			bar: function bar() {
				return this.foo() + " bar";
			}
		};
		var Stripe = Gizmo.create(proto);
		var g = Object.create(Stripe);

		expect(proto.isPrototypeOf(Stripe));
		expect(proto.isPrototypeOf(g));
	});

	it("inheritance works", function () {
		var Stripe2 = Gizmo.create({
			name: "Stripe2",
			bar: function bar() {
				return this.foo() + " bar";
			}
		});

		expect(Stripe2.bar()).to.equal("foo bar");
		expect(Stripe2.create).to.be.a("function");
	});

	it("uses an initializer", function () {
		function initialize() {}

		var G1 = Gizmo.create({
			name: "G1",
			initialize: initialize
		});

		expect(Gizmo.initialize).to.be.a("function");
		expect(G1.initialize).to.be.equal(initialize);
	});

	it("expects a name", function () {

		var proto = {};
		expect(function () {
			Gremlin.create(proto);
		}).to["throw"]();
	});

	it("uses modules", function (done) {
		var called = 0;

		var Module = {
			initialize: function initialize() {},
			foo: function foo() {
				called++;
			},
			module1: "Module1"
		};
		var Module2 = {
			initialize: function initialize() {},
			foo: function foo() {
				called++;
			},
			module2: "Module2"
		};
		Gremlin.create({
			mixins: [Module, Module2],
			name: "G2",
			foo: function foo() {
				called++;
				if (called !== 3) {
					done(new Error("Modules not called correctly"));
				} else {
					done();
				}
			},
			initialize: function initialize() {
				this.foo();
			}
		});

		var el = document.createElement("div");
		el.setAttribute("data-gremlin", "G2");
		document.body.appendChild(el);
	});

	it("binds the correct dom element", function (done) {

		Gremlin.create({
			name: "G3",
			initialize: function initialize() {
				try {
					expect(this.el).to.equal(el);
					done();
				} catch (e) {
					done(e);
				}
			}
		});

		var el = document.createElement("div");
		el.setAttribute("data-gremlin", "G3");
		document.body.appendChild(el);
	});

	setTimeout(function () {
		Gremlin.create({
			name: "Foo"
		});
	}, 5000);
});

},{"../Gremlin":5}],9:[function(require,module,exports){
"use strict";

var Modules = require("../Mixins");

describe("Modules", function () {

	it("mixes modules into objects", function () {
		var Module = {
			foo: function foo() {
				return "foo";
			}
		};
		var G = {
			mixins: Module };

		Modules.mixinProps(G);

		expect(G).to.have.property("foo");
		expect(G.foo()).to.equal("foo");
	});

	it("decorates exiting functions", function () {
		var fooCount = 0;

		var Module = {
			foo: function foo() {
				fooCount++;
			}
		};
		var G = {
			mixins: Module,
			foo: function foo() {
				fooCount++;
			}
		};

		Modules.mixinProps(G);

		expect(G).to.have.property("foo");
		G.foo();
		expect(fooCount).to.equal(2);
	});

	it("does not change existing properties that are not functions", function () {
		var Module = {
			foo: "foo2"
		};
		var G = {
			mixins: Module,
			foo: "foo"
		};

		Modules.mixinProps(G);

		expect(G).to.have.property("foo");
		expect(G.foo).to.equal("foo");
	});

	it("respects the order modules are included", function () {
		var fooStr = "";
		var Module = {
			foo: function foo() {
				fooStr += "module1";
			}
		};
		var Module2 = {
			foo: function foo() {
				fooStr += "module2";
			}
		};

		var G = {
			mixins: [Module, Module2],
			foo: function foo() {
				fooStr += "gremlin";
			}
		};

		Modules.mixinProps(G);
		G.foo();
		expect(fooStr).to.equal("module1module2gremlin");
	});
});

},{"../Mixins":6}],10:[function(require,module,exports){
"use strict";

var gremlins = require("../../index");
var Gizmo = require("../Gremlin");

describe("gremlins", function () {

	it("the namespace should exist", function () {
		expect(gremlins).to.be.an("object");
		expect(gremlins.create).to.be(Gizmo.create);
		//expect(G).to.be.an('object');
		//expect(G).to.equal(Gremlin);
	});

	/*
  it('should expose the main gremlin.js API', function () {
  expect(G).to.have.property('add')
  expect(G.add).to.be.a('function');
 	 expect(G).to.have.property('debug');
  expect(G.debug).to.be.a(util.Debug);
 	 expect(G).to.have.property('Module');
  expect(G.Module).to.be.a('function');
 	 expect(G).to.have.property('Package');
  expect(G.Package).to.be.a('function');
 	 expect(G).to.have.property('Gizmo');
  expect(G.Gizmo).to.equal(gremlinDefinitions.Gizmo);
 	 expect(G).to.have.property('Helper')
  expect(G.Helper).to.equal(util.Helper);
 	 expect(G).to.have.property('on');
  expect(G.on).to.be.a('function');
 	 expect(G).to.have.property('ON_ELEMENT_FOUND');
  expect(G.ON_ELEMENT_FOUND).to.be.a('string');
 	 expect(G).to.have.property('ON_DEFINITION_PENDING');
  expect(G.ON_DEFINITION_PENDING).to.be.a('string');
 	 expect(G).to.have.property('ON_GREMLIN_LOADED');
  expect(G.ON_GREMLIN_LOADED).to.be.a('string');
  });
 	 it('can add new gremlin classes', function () {
 	 expect(function () {
  G.add(AddTest)
  }).to.throwError(Error);
 	 expect(function () {
  G.add('AddTest')
  }).to.throwError(Error);
 	 var TestGremlin = G.add('AddTest', AddTest);
  expect(TestGremlin).to.equal(AddTest);
 	 expect(function () {
  G.add('AddTest', AddTest);
  }).to.throwError(Error);
 	 expect(gremlinDefinitions.Pool.getInstance().get('AddTest')).to.be(AddTest);
 	 });
 	 it('can inherit from gremlin classes', function (done) {
 	 var elChild = document.createElement('div'),
  elChildCoffee = document.createElement('div');
  elChild.setAttribute('data-gremlin', 'InheritChild');
  elChildCoffee.setAttribute('data-gremlin', 'InheritChild2');
 	 document.body.appendChild(elChild);
  document.body.appendChild(elChildCoffee);
 	 var Parent = G.Gizmo.extend(function () {
  },
  {
  foo: 'bar'
  }, {
  FOO: "BAR"
  });
 	 var Child = Parent.extend(function () {
  try {
  expect(this.el).to.equal(elChild);
  expect(this.constructor).to.equal(Child);
  done();
  } catch (e) {
  done(e);
  }
  },
  {
 	 }, {
 	 });
 	 G.add('InheritParent', Parent);
  G.add('InheritChild', Child);
 	 expect(Child).to.have.property('FOO');
  expect(Child.FOO).to.equal('BAR');
 	 expect(Child.prototype).to.have.property('foo');
  expect(Child.prototype.foo).to.equal('bar');
 	 expect(InheritTestChild).to.have.property('FOO');
  expect(InheritTestChild.FOO).to.equal('FOO');
 	 expect(InheritTestChild.prototype).to.have.property('foo');
  expect(InheritTestChild.prototype).to.have.property('bar');
  expect(InheritTestChild.prototype.foo).to.be.a('function');
  expect(InheritTestChild.prototype.bar).to.equal('bar');
 	 })
 	 it('can create new gremlin classes without coffeescript', function () {
  expect(function () {
  G.add('DefineTest');
  }).to.throwError(Error);
 	 expect(function () {
  G.Gizmo.extend();
  }).to.throwError(Error);
 	 expect(function () {
  G.Gizmo.extend(function () {
  }, 'foo', 'foo');
  }).to.throwError(Error);
 	 expect(function () {
  G.Gizmo.extend(function () {
  }, function () {
  });
  }).to.throwError(Error);
 
  var TestGremlin = G.Gizmo.extend(function () {
  }, {
  foo: 'bar'
  }, {
  FOO: "BAR"
  });
 	 expect(TestGremlin).to.have.property('FOO');
  expect(TestGremlin.FOO).to.equal('BAR');
 	 expect(TestGremlin.prototype).to.have.property('foo');
  expect(TestGremlin.prototype.foo).to.equal('bar');
 	 });
 	 it('instantiates new gremlins', function (done) {
  var el = document.createElement('div'),
  elCoffee = document.createElement('div');
  el.setAttribute('data-gremlin', 'CreateTest');
  elCoffee.setAttribute('data-gremlin', 'CreateTestCoffee');
 	 document.body.appendChild(el);
  document.body.appendChild(elCoffee);
 	 var TestGremlin = G.Gizmo.extend(function () {
  try {
  expect(this.el).to.equal(el);
  expect(this.constructor).to.equal(TestGremlin);
  expect(this.id).to.be.a('number');
  expect(this.data).to.be.an('object');
  //done();
  } catch (e) {
  done(e);
  }
  });
 
  TestGremlin = G.add('CreateTest', TestGremlin);
  var CreateTestGremlin = G.add('CreateTestCoffee', CreateTest);
 	 window.setTimeout(function () {
  try {
  var g = elCoffee.__gremlin;
  expect(elCoffee.className).to.equal('gremlin-ready');
  expect(g.el).to.equal(elCoffee);
  expect(g.constructor).to.equal(CreateTestGremlin);
  expect(g.id).to.be.a('number');
  expect(g.data).to.be.an('object');
  done();
  } catch (e) {
  done(e);
  }
  }, 600)
  });
 	 it('instantiates multiple gremlins on a singe element');
 	 it('handles data attributes correctly', function (done) {
  var el = document.createElement('div'),
  complex = {
  foo: 'bar',
  deep: {
  foo: 'bar'
  }
  };
  el.setAttribute('data-gremlin', 'DataTest');
  el.setAttribute('data-string', 'foo');
  el.setAttribute('data-number', "42");
  el.setAttribute('data-yes', 'true');
  el.setAttribute('data-no', 'false');
  el.setAttribute('data-object', JSON.stringify(complex));
  el.setAttribute('data-with-long-name', 'foo');
 	 document.body.appendChild(el);
  var TestGremlin = G.Gizmo.extend(function () {
  try {
  expect(this.data).to.have.property('string')
  expect(this.data.string).to.be('foo');
 	 expect(this.data).to.have.property('number');
  expect(this.data.number).to.be(42);
 	 expect(this.data).to.have.property('yes');
  expect(this.data.yes).to.be.ok();
 	 expect(this.data).to.have.property('no');
  expect(this.data.no).not.to.be.ok();
 	 expect(this.data).to.have.property('object');
  expect(this.data.object).to.eql(complex);
 	 expect(this.data).to.have.property('withLongName');
  expect(this.data.withLongName).to.be('foo');
 	 done();
  } catch (e) {
  done(e);
  }
  });
 	 G.add('DataTest', TestGremlin);
  });
 	 it('puts unavailble gremlins into a queue', function (done) {
  var el = document.createElement('div');
  el.setAttribute('data-gremlin', 'PendingTest');
  document.body.appendChild(el);
 	 window.setTimeout(function () {
  try {
  expect(el.className).to.equal('gremlin-loading gremlin-definition-pending');
  done();
  } catch (e) {
  done(e);
  }
  }, 600)
 	 });
 	 it('highlights gremlins without a name', function (done) {
  var el = document.createElement('div');
  el.setAttribute('data-gremlin', '');
  document.body.appendChild(el);
 	 window.setTimeout(function () {
  try {
  expect(el.className).to.equal('gremlin-error');
  done();
  } catch (e) {
  done(e);
  }
  }, 600)
 	 });
 	 it('lazy loads gremlin elements', function (done) {
  var el = document.createElement('div');
  el.setAttribute('data-gremlin', 'LazyTest');
  el.setAttribute('data-gremlin-lazy', 'true');
  el.style.marginTop = "3000px";
  document.body.appendChild(el);
 	 var LazyTest = G.Gizmo.extend(function () {
  try {
  expect(this.el).to.equal(el);
  done();
  el.parentNode.removeChild(el);
  window.scrollTo(0, 0);
  } catch (e) {
  done(e);
  }
  });
  G.add('LazyTest', LazyTest);
 	 window.setTimeout(function () {
  try {
  expect(el.className).to.equal('gremlin-loading');
  window.scrollTo(0, document.body.scrollHeight);
  } catch (e) {
  done(e);
  }
  }, 600);
 	 });
 	 it('dispatches event when gremlin element was found', function (done) {
  var el = document.createElement('div'),
  onFound = function (foundEl) {
  try {
  expect(foundEl).to.equal(el);
  done();
  } catch (e) {
  done(e);
  }
 	 G.off(G.ON_ELEMENT_FOUND, onFound);
  el.parentNode.removeChild(el);
  };
  el.setAttribute('data-gremlin', 'EventOnFoundTest');
 	 G.on(G.ON_ELEMENT_FOUND, onFound);
  document.body.appendChild(el);
  });
 	 it('dispatches event when gremlin definition is pending', function (done) {
  var el = document.createElement('div'),
  onPending = function (foundEl) {
  try {
  expect(foundEl).to.equal(el);
  done();
  } catch (e) {
  done(e);
  }
 	 G.off(G.ON_DEFINITION_PENDING, onPending);
  el.parentNode.removeChild(el);
  };
  el.setAttribute('data-gremlin', 'EventOnPendingTest');
 	 G.on(G.ON_DEFINITION_PENDING, onPending);
  document.body.appendChild(el);
  });
 	 it('dispatches event when gremlin instance was created', function (done) {
  var el = document.createElement('div'),
  onCreated = function (foundEl) {
  try {
  expect(foundEl).to.equal(el);
  done();
  } catch (e) {
  done(e);
  }
 	 G.off(G.ON_GREMLIN_LOADED, onCreated);
  el.parentNode.removeChild(el);
  };
  el.setAttribute('data-gremlin', 'EventOnLoadedTest');
  G.on(G.ON_GREMLIN_LOADED, onCreated);
  document.body.appendChild(el);
 	 var EventOnLoadedTest = G.Gizmo.extend(function () {
 	 });
 	 G.add('EventOnLoadedTest', EventOnLoadedTest);
  });
 	 */
});

},{"../../index":1,"../Gremlin":5}],11:[function(require,module,exports){
"use strict";

require("./gremlins-tests");
require("./Gremlin-tests");
require("./Mixins-tests");

},{"./Gremlin-tests":8,"./Mixins-tests":9,"./gremlins-tests":10}],12:[function(require,module,exports){
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

},{}],13:[function(require,module,exports){
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

},{"./Collection":2,"./Gremlin":5,"./consoleShim":12,"domready":15}],14:[function(require,module,exports){
"use strict";

module.exports = function b(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, b);
};
// see https://gist.github.com/jed/982883

},{}],15:[function(require,module,exports){
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

},{}],16:[function(require,module,exports){
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

},{}],17:[function(require,module,exports){
module.exports = Object.setPrototypeOf || {__proto__:[]} instanceof Array ? setProtoOf : mixinProperties;

function setProtoOf(obj, proto) {
	obj.__proto__ = proto;
}

function mixinProperties(obj, proto) {
	for (var prop in proto) {
		obj[prop] = proto[prop];
	}
}

},{}],18:[function(require,module,exports){
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

},{"./smokesignals":19}],19:[function(require,module,exports){
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

},{}],20:[function(require,module,exports){
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
},{"./LiveNodeList":21,"./domQueries/QueryStrategyFactory":23,"./util/constants":26,"./util/helper":27}],21:[function(require,module,exports){
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



},{"./domQueries/DomQuery":22,"./observers/IntervalObserver":24,"./observers/NativeObserver":25,"./util/constants":26,"./util/helper":27,"smokesignals":18}],22:[function(require,module,exports){
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
},{"../util/helper":27}],23:[function(require,module,exports){
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
},{"../util/constants":26,"../util/helper":27}],24:[function(require,module,exports){
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

},{"../util/constants":26,"../util/helper":27,"smokesignals":18}],25:[function(require,module,exports){
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
},{"../util/constants":26,"../util/helper":27,"smokesignals":18}],26:[function(require,module,exports){
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
},{}],27:[function(require,module,exports){
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
},{"./constants":26}],28:[function(require,module,exports){
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
},{"./src/DomElement":20}]},{},[11])(11)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2luZGV4LmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvQ29sbGVjdGlvbi5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL0RhdGEuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9GYWN0b3J5LmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvR3JlbWxpbi5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL01peGlucy5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL1Bvb2wuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9fX3Rlc3RzX18vR3JlbWxpbi10ZXN0cy5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL19fdGVzdHNfXy9NaXhpbnMtdGVzdHMuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9fX3Rlc3RzX18vZ3JlbWxpbnMtdGVzdHMuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9fX3Rlc3RzX18vaW5kZXguanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9jb25zb2xlU2hpbS5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL2dyZW1saW5zLmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvdXVpZC5qcyIsIm5vZGVfbW9kdWxlcy9kb21yZWFkeS9yZWFkeS5qcyIsIm5vZGVfbW9kdWxlcy9vYmplY3QtYXNzaWduL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3NldHByb3RvdHlwZW9mL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoZWQvbm9kZV9tb2R1bGVzL3Ntb2tlc2lnbmFscy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGVkL25vZGVfbW9kdWxlcy9zbW9rZXNpZ25hbHMvc21va2VzaWduYWxzLmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoZWQvc3JjL0RvbUVsZW1lbnQuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hlZC9zcmMvTGl2ZU5vZGVMaXN0LmpzIiwibm9kZV9tb2R1bGVzL3dhdGNoZWQvc3JjL2RvbVF1ZXJpZXMvRG9tUXVlcnkuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hlZC9zcmMvZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeS5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGVkL3NyYy9vYnNlcnZlcnMvSW50ZXJ2YWxPYnNlcnZlci5qcyIsIm5vZGVfbW9kdWxlcy93YXRjaGVkL3NyYy9vYnNlcnZlcnMvTmF0aXZlT2JzZXJ2ZXIuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hlZC9zcmMvdXRpbC9jb25zdGFudHMuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hlZC9zcmMvdXRpbC9oZWxwZXIuanMiLCJub2RlX21vZHVsZXMvd2F0Y2hlZC93YXRjaGVkLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQSxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7OztBQ0QzQyxJQUFJLE9BQU8sR0FBRyxPQUFPLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDakMsSUFBSSxPQUFPLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVuQyxJQUFJ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O0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3JHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2dyZW1saW5zJyk7XG4iLCIndXNlIHN0cmljdCc7XG52YXIgd2F0Y2hlZCA9IHJlcXVpcmUoJ3dhdGNoZWQnKTtcbnZhciBGYWN0b3J5ID0gcmVxdWlyZSgnLi9GYWN0b3J5Jyk7XG5cbnZhciBEQVRBX05BTUUgPSAnZGF0YS1ncmVtbGluJztcbnZhciBOQU1FX1NFUEFSQVRPUiA9ICcsJztcblxuZnVuY3Rpb24gZ2V0TmFtZXMoZWwpIHtcblx0dmFyIG5hbWVzID0gZWwuZ2V0QXR0cmlidXRlKERBVEFfTkFNRSk7XG5cblx0aWYgKG5hbWVzKSB7XG5cdFx0dmFyIG5hbWVJdGVtcyA9IG5hbWVzLnNwbGl0KE5BTUVfU0VQQVJBVE9SKTtcblx0XHRyZXR1cm4gbmFtZUl0ZW1zLm1hcChuYW1lID0+IG5hbWUudHJpbSgpKTtcblx0fSBlbHNlIHtcblx0XHQvLyBUT0RPIEVycm9yIG1lc3NhZ2Vcblx0XHRyZXR1cm4gW107XG5cdH1cbn1cblxuZnVuY3Rpb24gYWRkR3JlbWxpbnMoZWxlbWVudCkge1xuXHR2YXIgbmFtZXMgPSBnZXROYW1lcyhlbGVtZW50KTtcblx0bmFtZXMuZm9yRWFjaChuYW1lID0+IEZhY3RvcnkuY3JlYXRlSW5zdGFuY2UoZWxlbWVudCwgbmFtZSkpO1xufVxuXG5mdW5jdGlvbiBjaGVja0FkZGVkKGFkZGVkRWxlbWVudHMpIHtcblx0YWRkZWRFbGVtZW50cy5mb3JFYWNoKGVsZW1lbnQgPT4gYWRkR3JlbWxpbnMoZWxlbWVudCkpO1xufVxuXG5mdW5jdGlvbiBjaGVja1JlbW92ZWQoLypyZW1vdmVkRWxlbWVudHMqLykge1xuXG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdG9ic2VydmUoKSB7XG5cdFx0dmFyIGxpc3QgPSB3YXRjaGVkKGBbJHtEQVRBX05BTUV9XWApO1xuXHRcdGxpc3Qub24oJ2FkZGVkJywgY2hlY2tBZGRlZCk7XG5cdFx0bGlzdC5vbigncmVtb3ZlZCcsIGNoZWNrUmVtb3ZlZCk7XG5cblx0XHQvLyBjaGVjayB0aGUgY3VycmVudCBFbGVtZW50c1xuXHRcdHZhciBlbGVtZW50cyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGxpc3QpO1xuXHRcdGNoZWNrQWRkZWQoZWxlbWVudHMpO1xuXHR9XG5cblxufTtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIHV1aWQgPSByZXF1aXJlKCcuL3V1aWQnKTtcblxudmFyIGV4cCA9IGBncmVtbGluc18ke3V1aWQoKX1gLFxuXHRjYWNoZSA9IHt9O1xuXG52YXIgZ3JlbWxpbklkID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIGlkID0gMTtcblx0cmV0dXJuICgpPT5pZCsrO1xufSgpKTtcblxudmFyIGhhc0lkID0gKGVsZW1lbnQpPT5lbGVtZW50W2V4cF0gIT09IHVuZGVmaW5lZCxcblx0c2V0SWQgPSAoZWxlbWVudCkgPT4gZWxlbWVudFtleHBdID0gZ3JlbWxpbklkKCksXG5cdGdldElkID0gKGVsZW1lbnQpPT4gaGFzSWQoZWxlbWVudCkgPyBlbGVtZW50W2V4cF0gOiBzZXRJZChlbGVtZW50KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGhhc0dyZW1saW4oZWxlbWVudCwgbmFtZSkge1xuXHRcdHZhciBpZCA9IGdldElkKGVsZW1lbnQpO1xuXHRcdHJldHVybiBjYWNoZVtpZF0gJiYgY2FjaGVbaWRdW25hbWVdICE9PSB1bmRlZmluZWQ7XG5cdH0sXG5cblx0YWRkR3JlbWxpbihncmVtbGluKSB7XG5cdFx0dmFyIGVsZW1lbnQgPSBncmVtbGluLmVsLFxuXHRcdFx0bmFtZSA9IGdyZW1saW4ubmFtZSxcblx0XHRcdGlkID0gZ2V0SWQoZWxlbWVudCk7XG5cdFx0Y2FjaGVbaWRdID0gY2FjaGVbaWRdIHx8IHt9O1xuXHRcdGNhY2hlW2lkXVtuYW1lXSA9IGdyZW1saW47XG5cdH1cbn07XG5cblxuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIERhdGEgPSByZXF1aXJlKCcuL0RhdGEnKSxcblx0UG9vbCA9IHJlcXVpcmUoJy4vUG9vbCcpO1xuXG5mdW5jdGlvbiBpbml0aWFsaXplKGdyZW1saW4sIGVsZW1lbnQpIHtcblxuXHRmdW5jdGlvbiBpbml0KCkge1xuXHRcdHRoaXMuZWwgPSBlbGVtZW50O1xuXHRcdC8vIGNhbGwgdGhlIGNvbnN0cnVjdG9yXG5cdFx0dGhpcy5pbml0aWFsaXplKCk7XG5cdH1cblxuXHRpbml0LmNhbGwoZ3JlbWxpbik7XG5cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdGNyZWF0ZUluc3RhbmNlKGVsZW1lbnQsIG5hbWUpIHtcblxuXHRcdFBvb2wuZmV0Y2gobmFtZSwgU3BlYyA9PiB7XG5cdFx0XHRpZiAoRGF0YS5oYXNHcmVtbGluKGVsZW1lbnQsIG5hbWUpKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgRWxlbWVudCBhbHJlYWR5IGhhcyBhIGdyZW1saW4gJHtuYW1lfWAsIGVsZW1lbnQpO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5pbmZvKGBDcmVhdGluZyBncmVtbGluICR7bmFtZX1gLCBlbGVtZW50KTtcblx0XHRcdFx0bGV0IGdyZW1saW4gPSBPYmplY3QuY3JlYXRlKFNwZWMpO1xuXHRcdFx0XHRpbml0aWFsaXplKGdyZW1saW4sIGVsZW1lbnQpO1xuXHRcdFx0XHREYXRhLmFkZEdyZW1saW4oZ3JlbWxpbik7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblxuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCdzZXRwcm90b3R5cGVvZicpLFxuXHRvYmplY3RBc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyksXG5cdFBvb2wgPSByZXF1aXJlKCcuL1Bvb2wnKTtcblxudmFyIEdyZW1saW4gPSB7XG5cblx0Y3JlYXRlKFNwZWMpIHtcblx0XHR2YXIgUGFyZW50ID0gdGhpcyxcblx0XHRcdG5ld1NwZWMgPSBvYmplY3RBc3NpZ24oe30sIFNwZWMpO1xuXG5cdFx0aWYgKHR5cGVvZiBuZXdTcGVjLm5hbWUgIT09ICdzdHJpbmcnKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ0EgZ3JlbWxpbiBzcGVjIG5lZWRzIGEgwrtuYW1lwqsgcHJvcGVydHkhIEl0IGNhblxcJ3QgYmUgZm91bmQgb3RoZXJ3aXNlJyk7XG5cdFx0fVxuXHRcdGlmIChuZXdTcGVjLmNyZWF0ZSAhPT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRjb25zb2xlLndhcm4oYFlvdSBhcmUgcmVwbGFjaW5nIHRoZSBvcmlnaW5hbCBjcmVhdGUgbWV0aG9kIGZvciB0aGUgc3BlYyAke25ld1NwZWMubmFtZX0uIFlvdSBrbm93IHdoYXQgeW91J3JlIGRvaW5nLCByaWdodD9gKTtcblx0XHR9XG5cdFx0aWYgKHR5cGVvZiBuZXdTcGVjLmluaXRpYWxpemUgIT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIFBhcmVudC5pbml0aWFsaXplICE9PSAnZnVuY3Rpb24nKSB7XG5cdFx0XHRuZXdTcGVjLmluaXRpYWxpemUgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHR9O1xuXHRcdH1cblxuXHRcdHNldFByb3RvdHlwZU9mKG5ld1NwZWMsIFBhcmVudCk7XG5cdFx0cmV0dXJuIFBvb2wuYWRkKG5ld1NwZWMpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JlbWxpbjtcbiIsIid1c2Ugc3RyaWN0JztcblxudmFyIGdldE1peGlucyA9IGdyZW1saW4gPT4gQXJyYXkuaXNBcnJheShncmVtbGluLm1peGlucykgPyBncmVtbGluLm1peGlucyA6IChncmVtbGluLm1peGlucyA/IFtncmVtbGluLm1peGluc10gOiBbXSk7XG5cbmZ1bmN0aW9uIG1peGluTW9kdWxlKGdyZW1saW4sIE1vZHVsZSkge1xuXG5cdE9iamVjdC5rZXlzKE1vZHVsZSkuZm9yRWFjaChwcm9wZXJ0eU5hbWUgPT4ge1xuXHRcdGxldCBwcm9wZXJ0eSA9IE1vZHVsZVtwcm9wZXJ0eU5hbWVdO1xuXG5cdFx0aWYgKGdyZW1saW5bcHJvcGVydHlOYW1lXSA9PT0gdW5kZWZpbmVkKSB7XG5cdFx0XHRncmVtbGluW3Byb3BlcnR5TmFtZV0gPSBwcm9wZXJ0eTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0ZGVjb3JhdGVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5KTtcblx0XHR9XG5cdH0pO1xufVxuZnVuY3Rpb24gZGVjb3JhdGVQcm9wZXJ0eShncmVtbGluLCBwcm9wZXJ0eU5hbWUsIHByb3BlcnR5KSB7XG5cdHZhciBncmVtbGluUHJvcGVydHkgPSBncmVtbGluW3Byb3BlcnR5TmFtZV0sXG5cdFx0bW9kdWxlUHJvcGVydHkgPSBwcm9wZXJ0eSxcblx0XHRncmVtbGluUHJvcGVydHlUeXBlID0gdHlwZW9mIGdyZW1saW5Qcm9wZXJ0eSxcblx0XHRtb2R1bGVQcm9wZXJ0eVR5cGUgPSB0eXBlb2YgbW9kdWxlUHJvcGVydHksXG5cdFx0aXNTYW1lUHJvcFR5cGUgPSBncmVtbGluUHJvcGVydHlUeXBlID09PSBtb2R1bGVQcm9wZXJ0eVR5cGU7XG5cblx0aWYgKGlzU2FtZVByb3BUeXBlICYmIG1vZHVsZVByb3BlcnR5VHlwZSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdGdyZW1saW5bcHJvcGVydHlOYW1lXSA9IGZ1bmN0aW9uICgpIHtcblx0XHRcdC8vIGNhbGwgdGhlIG1vZHVsZSBmaXJzdFxuXHRcdFx0cmV0dXJuIFttb2R1bGVQcm9wZXJ0eS5hcHBseSh0aGlzLCBhcmd1bWVudHMpLGdyZW1saW5Qcm9wZXJ0eS5hcHBseSh0aGlzLCBhcmd1bWVudHMpXTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdGNvbnNvbGUud2FybihgQ2FuJ3QgZGVjb3JhdGUgZ3JlbWxpbiBwcm9wZXJ0eSDCuyR7Z3JlbWxpbi5uYW1lfSMke3Byb3BlcnR5TmFtZX06JHtncmVtbGluUHJvcGVydHlUeXBlfcKrIHdpdGggwrtNb2R1bGUjJHtwcm9wZXJ0eU5hbWV9OiR7bW9kdWxlUHJvcGVydHlUeXBlfcKrLlxuXHRcdE9ubHkgZnVuY3Rpb25zIGNhbiBiZSBkZWNvcmF0ZWQhYCk7XG5cdH1cbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cdG1peGluUHJvcHMoZ3JlbWxpbikge1xuXHRcdHZhciBtb2R1bGVzID0gZ2V0TWl4aW5zKGdyZW1saW4pO1xuXHRcdC8vIHJldmVyc2UgdGhlIG1vZHVsZXMgYXJyYXkgdG8gY2FsbCBkZWNvcmF0ZWQgZnVuY3Rpb25zIGluIHRoZSByaWdodCBvcmRlclxuXHRcdG1vZHVsZXMucmV2ZXJzZSgpLmZvckVhY2goTW9kdWxlID0+IG1peGluTW9kdWxlKGdyZW1saW4sIE1vZHVsZSkpO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgTWl4aW5zID0gcmVxdWlyZSgnLi9NaXhpbnMnKTtcblxudmFyIHNwZWNNYXAgPSB7fSxcblx0cGVuZGluZyA9IHt9LFxuXHRwZW5kaW5nVGltZXJzID0ge307XG5cbnZhciBQRU5ESU5HX1RJTUVPVVQgPSAzMDAwO1xuXG52YXIgYWRkU3BlYyA9IChuYW1lLCBTcGVjKSA9PiBzcGVjTWFwW25hbWVdID0gU3BlYztcbnZhciBoYXNTcGVjID0gbmFtZSA9PiBzcGVjTWFwW25hbWVdICE9PSB1bmRlZmluZWQ7XG5cbmZ1bmN0aW9uIGNyZWF0ZVJlcXVlc3QobmFtZSwgY2FsbGJhY2spIHtcblx0bGV0IHBlbmRpbmdSZXF1ZXN0ID0ge25hbWUsIGNhbGxiYWNrfTtcblxuXHRpZiAoaGFzU3BlYyhuYW1lKSkge1xuXHRcdHJlc29sdmVSZXF1ZXN0KHBlbmRpbmdSZXF1ZXN0KTtcblx0fSBlbHNlIHtcblx0XHRwZW5kaW5nW25hbWVdID0gcGVuZGluZ1tuYW1lXSB8fCBbXTtcblx0XHRwZW5kaW5nW25hbWVdLnB1c2gocGVuZGluZ1JlcXVlc3QpO1xuXHRcdHBlbmRpbmdUaW1lcnNbbmFtZV0gPSBwZW5kaW5nVGltZXJzW25hbWVdIHx8IHNldFRpbWVvdXQoKCk9PiB7XG5cdFx0XHR2YXIgcmVxdWVzdHMgPSBwZW5kaW5nW25hbWVdO1xuXHRcdFx0aWYgKHJlcXVlc3RzKSB7XG5cdFx0XHRcdGNvbnNvbGUud2FybihgQSBzcGVjIGZvciBncmVtbGluICR7bmFtZX0gaXMgc3RpbGwgbWlzc2luZy4gRGlkIHlvdSBpbmNsdWRlIGl0P2ApO1xuXHRcdFx0fVxuXHRcdH0sIFBFTkRJTkdfVElNRU9VVCk7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVzb2x2ZVJlcXVlc3Qoe25hbWUsIGNhbGxiYWNrIH0pIHtcblx0dmFyIFNwZWMgPSBzcGVjTWFwW25hbWVdO1xuXHRjYWxsYmFjayhTcGVjKTtcbn1cblxuZnVuY3Rpb24gcmVzb2x2ZUFsbFBlbmRpbmdGb3IobmFtZSkge1xuXHR2YXIgcmVxdWVzdHMgPSBwZW5kaW5nW25hbWVdO1xuXHRjbGVhclRpbWVvdXQocGVuZGluZ1RpbWVyc1tuYW1lXSk7XG5cdGlmIChyZXF1ZXN0cyAhPT0gdW5kZWZpbmVkICYmIGhhc1NwZWMobmFtZSkpIHtcblx0XHRyZXF1ZXN0cy5mb3JFYWNoKHJlc29sdmVSZXF1ZXN0KTtcblx0XHRkZWxldGUgcGVuZGluZ1tuYW1lXTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0YWRkKFNwZWMpIHtcblx0XHR2YXIgbmFtZSA9IFNwZWMubmFtZTtcblxuXHRcdGlmIChoYXNTcGVjKG5hbWUpKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoYFRyeWluZyB0byBhZGQgbmV3IEdyZW1saW4gc3BlYywgYnV0IGEgc3BlYyBmb3IgJHtuYW1lfSBhbHJlYWR5IGV4aXN0cy5gKTtcblx0XHR9XG5cblx0XHQvLyBleHRlbmQgdGhlIHNwZWMgd2l0aCBpdCdzIE1peGluc1xuXHRcdE1peGlucy5taXhpblByb3BzKFNwZWMpO1xuXHRcdGFkZFNwZWMobmFtZSwgU3BlYyk7XG5cdFx0cmVzb2x2ZUFsbFBlbmRpbmdGb3IobmFtZSk7XG5cdFx0cmV0dXJuIFNwZWM7IC8vZWFzeSBjaGFpbmluZ1xuXHR9LFxuXG5cblx0ZmV0Y2gobmFtZSwgY2IpXG5cdHtcblx0XHRcdHNldFRpbWVvdXQoKCk9PmNyZWF0ZVJlcXVlc3QobmFtZSwgY2IpLCAxMCk7XG5cdH1cbn07XG5cbiIsInZhciBHcmVtbGluID0gcmVxdWlyZSgnLi4vR3JlbWxpbicpO1xuXG5kZXNjcmliZSgnR3JlbWxpbicsIGZ1bmN0aW9uICgpIHtcblx0dmFyIEdpem1vID0gR3JlbWxpbi5jcmVhdGUoe1xuXHRcdG5hbWU6ICdHaXptbycsXG5cdFx0Zm9vKCkge1xuXHRcdFx0cmV0dXJuICdmb28nO1xuXHRcdH1cblx0fSk7XG5cblx0aXQoJ2NhbiBjcmVhdGUgZ3JlbWxpbnMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ZXhwZWN0KEdpem1vLmNyZWF0ZSkudG8uYmUuYSgnZnVuY3Rpb24nKTtcblx0XHRleHBlY3QoR2l6bW8uZm9vKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXHR9KTtcblxuXHQvLyBUT0RPOiBub3QgaW4gSUU8MTFcblx0aXQoJ3NldHMgdXAgYSBwcm90b3R5cGUgY2hhaW4nLCBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIHByb3RvID0ge1xuXHRcdFx0bmFtZTogJ1N0cmlwZScsXG5cdFx0XHRiYXIoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZvbygpICsgJyBiYXInO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dmFyIFN0cmlwZSA9IEdpem1vLmNyZWF0ZShwcm90byk7XG5cdFx0dmFyIGcgPSBPYmplY3QuY3JlYXRlKFN0cmlwZSk7XG5cblx0XHRleHBlY3QocHJvdG8uaXNQcm90b3R5cGVPZihTdHJpcGUpKTtcblx0XHRleHBlY3QocHJvdG8uaXNQcm90b3R5cGVPZihnKSk7XG5cdH0pO1xuXG5cdGl0KCdpbmhlcml0YW5jZSB3b3JrcycsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgU3RyaXBlMiA9IEdpem1vLmNyZWF0ZSh7XG5cdFx0XHRuYW1lOiAnU3RyaXBlMicsXG5cdFx0XHRiYXIoKSB7XG5cdFx0XHRcdHJldHVybiB0aGlzLmZvbygpICsgJyBiYXInO1xuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZXhwZWN0KFN0cmlwZTIuYmFyKCkpLnRvLmVxdWFsKCdmb28gYmFyJyk7XG5cdFx0ZXhwZWN0KFN0cmlwZTIuY3JlYXRlKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXHR9KTtcblxuXHRpdCgndXNlcyBhbiBpbml0aWFsaXplcicsIGZ1bmN0aW9uICgpIHtcblx0XHRmdW5jdGlvbiBpbml0aWFsaXplKCkge1xuXG5cdFx0fVxuXG5cdFx0dmFyIEcxID0gR2l6bW8uY3JlYXRlKHtcblx0XHRcdG5hbWU6ICdHMScsXG5cdFx0XHRpbml0aWFsaXplXG5cdFx0fSk7XG5cblx0XHRleHBlY3QoR2l6bW8uaW5pdGlhbGl6ZSkudG8uYmUuYSgnZnVuY3Rpb24nKTtcblx0XHRleHBlY3QoRzEuaW5pdGlhbGl6ZSkudG8uYmUuZXF1YWwoaW5pdGlhbGl6ZSk7XG5cdH0pO1xuXG5cdGl0KCdleHBlY3RzIGEgbmFtZScsIGZ1bmN0aW9uICgpIHtcblxuXHRcdHZhciBwcm90byA9IHt9O1xuXHRcdGV4cGVjdChmdW5jdGlvbiAoKSB7XG5cdFx0XHRHcmVtbGluLmNyZWF0ZShwcm90bylcblx0XHR9KS50by50aHJvdygpO1xuXG5cdH0pO1xuXG5cdGl0KCd1c2VzIG1vZHVsZXMnLCBmdW5jdGlvbiAoZG9uZSkge1xuXHRcdHZhciBjYWxsZWQgPSAwO1xuXG5cdFx0dmFyIE1vZHVsZSA9IHtcblx0XHRcdGluaXRpYWxpemUoKSB7XG5cdFx0XHR9LFxuXHRcdFx0Zm9vKCkge1xuXHRcdFx0XHRjYWxsZWQrKztcblx0XHRcdH0sXG5cdFx0XHRtb2R1bGUxOiAnTW9kdWxlMSdcblx0XHR9O1xuXHRcdHZhciBNb2R1bGUyID0ge1xuXHRcdFx0aW5pdGlhbGl6ZSgpIHtcblx0XHRcdH0sXG5cdFx0XHRmb28oKSB7XG5cdFx0XHRcdGNhbGxlZCsrO1xuXHRcdFx0fSxcblx0XHRcdG1vZHVsZTI6ICdNb2R1bGUyJ1xuXHRcdH07XG5cdFx0R3JlbWxpbi5jcmVhdGUoe1xuXHRcdFx0bWl4aW5zOiBbTW9kdWxlLCBNb2R1bGUyXSxcblx0XHRcdG5hbWU6ICdHMicsXG5cdFx0XHRmb28oKSB7XG5cdFx0XHRcdGNhbGxlZCsrO1xuXHRcdFx0XHRpZiAoY2FsbGVkICE9PSAzKSB7XG5cdFx0XHRcdFx0ZG9uZShuZXcgRXJyb3IoJ01vZHVsZXMgbm90IGNhbGxlZCBjb3JyZWN0bHknKSk7XG5cdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0ZG9uZSgpO1xuXHRcdFx0XHR9XG5cdFx0XHR9LFxuXHRcdFx0aW5pdGlhbGl6ZSgpIHtcblx0XHRcdFx0dGhpcy5mb28oKTtcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHRcdGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1ncmVtbGluJywgJ0cyJyk7XG5cdFx0ZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG5cdH0pO1xuXG5cdGl0KCdiaW5kcyB0aGUgY29ycmVjdCBkb20gZWxlbWVudCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cblxuXHRcdEdyZW1saW4uY3JlYXRlKHtcblx0XHRcdG5hbWU6ICdHMycsXG5cdFx0XHRpbml0aWFsaXplKCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdGV4cGVjdCh0aGlzLmVsKS50by5lcXVhbChlbCk7XG5cdFx0XHRcdFx0ZG9uZSgpO1xuXHRcdFx0XHR9IGNhdGNoIChlKSB7XG5cdFx0XHRcdFx0ZG9uZShlKTtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cblx0XHR2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0XHRlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdHMycpO1xuXHRcdGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXG5cdH0pO1xuXG5cblx0c2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0R3JlbWxpbi5jcmVhdGUoe1xuXHRcdFx0bmFtZTogJ0Zvbydcblx0XHR9KTtcblx0fSwgNTAwMCk7XG59KTsiLCJ2YXIgTW9kdWxlcyA9IHJlcXVpcmUoJy4uL01peGlucycpO1xuXG5kZXNjcmliZSgnTW9kdWxlcycsIGZ1bmN0aW9uICgpIHtcblxuXHRpdCgnbWl4ZXMgbW9kdWxlcyBpbnRvIG9iamVjdHMnLCBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIE1vZHVsZSA9IHtcblx0XHRcdGZvbygpIHtcblx0XHRcdFx0cmV0dXJuICdmb28nO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dmFyIEcgPSB7XG5cdFx0XHRtaXhpbnM6IE1vZHVsZSxcblx0XHR9O1xuXG5cdFx0TW9kdWxlcy5taXhpblByb3BzKEcpO1xuXG5cdFx0ZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ2ZvbycpO1xuXHRcdGV4cGVjdChHLmZvbygpKS50by5lcXVhbCgnZm9vJyk7XG5cblx0fSk7XG5cblxuXHRpdCgnZGVjb3JhdGVzIGV4aXRpbmcgZnVuY3Rpb25zJywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBmb29Db3VudCA9IDA7XG5cblx0XHR2YXIgTW9kdWxlID0ge1xuXHRcdFx0Zm9vKCkge1xuXHRcdFx0XHRmb29Db3VudCsrO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dmFyIEcgPSB7XG5cdFx0XHRtaXhpbnM6IE1vZHVsZSxcblx0XHRcdGZvbygpIHtcblx0XHRcdFx0Zm9vQ291bnQrKztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0TW9kdWxlcy5taXhpblByb3BzKEcpO1xuXG5cdFx0ZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ2ZvbycpO1xuXHRcdEcuZm9vKCk7XG5cdFx0ZXhwZWN0KGZvb0NvdW50KS50by5lcXVhbCgyKTtcblxuXHR9KTtcblxuXHRpdCgnZG9lcyBub3QgY2hhbmdlIGV4aXN0aW5nIHByb3BlcnRpZXMgdGhhdCBhcmUgbm90IGZ1bmN0aW9ucycsIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgTW9kdWxlID0ge1xuXHRcdFx0Zm9vOiAnZm9vMidcblx0XHR9O1xuXHRcdHZhciBHID0ge1xuXHRcdFx0bWl4aW5zOiBNb2R1bGUsXG5cdFx0XHRmb286ICdmb28nXG5cdFx0fTtcblxuXHRcdE1vZHVsZXMubWl4aW5Qcm9wcyhHKTtcblxuXHRcdGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdmb28nKTtcblx0XHRleHBlY3QoRy5mb28pLnRvLmVxdWFsKCdmb28nKTtcblxuXHR9KTtcblxuXHRpdCgncmVzcGVjdHMgdGhlIG9yZGVyIG1vZHVsZXMgYXJlIGluY2x1ZGVkJywgZnVuY3Rpb24gKCkge1xuXHRcdHZhciBmb29TdHIgPSAnJztcblx0XHR2YXIgTW9kdWxlID0ge1xuXHRcdFx0Zm9vKCkge1xuXHRcdFx0XHRmb29TdHIgKz0gJ21vZHVsZTEnO1xuXHRcdFx0fVxuXHRcdH07XG5cdFx0dmFyIE1vZHVsZTIgPSB7XG5cdFx0XHRmb28oKSB7XG5cdFx0XHRcdGZvb1N0ciArPSAnbW9kdWxlMic7XG5cdFx0XHR9XG5cdFx0fTtcblxuXHRcdHZhciBHID0ge1xuXHRcdFx0bWl4aW5zOiBbTW9kdWxlLCBNb2R1bGUyXSxcblx0XHRcdGZvbygpIHtcblx0XHRcdFx0Zm9vU3RyICs9ICdncmVtbGluJztcblx0XHRcdH1cblx0XHR9O1xuXG5cdFx0TW9kdWxlcy5taXhpblByb3BzKEcpO1xuXHRcdEcuZm9vKCk7XG5cdFx0ZXhwZWN0KGZvb1N0cikudG8uZXF1YWwoJ21vZHVsZTFtb2R1bGUyZ3JlbWxpbicpO1xuXHR9KTtcbn0pXG47IiwidmFyIGdyZW1saW5zID0gcmVxdWlyZSgnLi4vLi4vaW5kZXgnKTtcbnZhciBHaXptbyA9IHJlcXVpcmUoJy4uL0dyZW1saW4nKTtcblxuZGVzY3JpYmUoJ2dyZW1saW5zJywgZnVuY3Rpb24gKCkge1xuXG5cdGl0KCd0aGUgbmFtZXNwYWNlIHNob3VsZCBleGlzdCcsIGZ1bmN0aW9uICgpIHtcblx0XHRleHBlY3QoZ3JlbWxpbnMpLnRvLmJlLmFuKCdvYmplY3QnKTtcblx0XHRleHBlY3QoZ3JlbWxpbnMuY3JlYXRlKS50by5iZShHaXptby5jcmVhdGUpO1xuXHRcdC8vZXhwZWN0KEcpLnRvLmJlLmFuKCdvYmplY3QnKTtcblx0XHQvL2V4cGVjdChHKS50by5lcXVhbChHcmVtbGluKTtcblx0fSk7XG5cblx0Lypcblx0IGl0KCdzaG91bGQgZXhwb3NlIHRoZSBtYWluIGdyZW1saW4uanMgQVBJJywgZnVuY3Rpb24gKCkge1xuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ2FkZCcpXG5cdCBleHBlY3QoRy5hZGQpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdkZWJ1ZycpO1xuXHQgZXhwZWN0KEcuZGVidWcpLnRvLmJlLmEodXRpbC5EZWJ1Zyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdNb2R1bGUnKTtcblx0IGV4cGVjdChHLk1vZHVsZSkudG8uYmUuYSgnZnVuY3Rpb24nKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ1BhY2thZ2UnKTtcblx0IGV4cGVjdChHLlBhY2thZ2UpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdHaXptbycpO1xuXHQgZXhwZWN0KEcuR2l6bW8pLnRvLmVxdWFsKGdyZW1saW5EZWZpbml0aW9ucy5HaXptbyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdIZWxwZXInKVxuXHQgZXhwZWN0KEcuSGVscGVyKS50by5lcXVhbCh1dGlsLkhlbHBlcik7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdvbicpO1xuXHQgZXhwZWN0KEcub24pLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdPTl9FTEVNRU5UX0ZPVU5EJyk7XG5cdCBleHBlY3QoRy5PTl9FTEVNRU5UX0ZPVU5EKS50by5iZS5hKCdzdHJpbmcnKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ09OX0RFRklOSVRJT05fUEVORElORycpO1xuXHQgZXhwZWN0KEcuT05fREVGSU5JVElPTl9QRU5ESU5HKS50by5iZS5hKCdzdHJpbmcnKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ09OX0dSRU1MSU5fTE9BREVEJyk7XG5cdCBleHBlY3QoRy5PTl9HUkVNTElOX0xPQURFRCkudG8uYmUuYSgnc3RyaW5nJyk7XG5cdCB9KTtcblxuXHQgaXQoJ2NhbiBhZGQgbmV3IGdyZW1saW4gY2xhc3NlcycsIGZ1bmN0aW9uICgpIHtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKEFkZFRlc3QpXG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKCdBZGRUZXN0Jylcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCB2YXIgVGVzdEdyZW1saW4gPSBHLmFkZCgnQWRkVGVzdCcsIEFkZFRlc3QpO1xuXHQgZXhwZWN0KFRlc3RHcmVtbGluKS50by5lcXVhbChBZGRUZXN0KTtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKCdBZGRUZXN0JywgQWRkVGVzdCk7XG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXHQgZXhwZWN0KGdyZW1saW5EZWZpbml0aW9ucy5Qb29sLmdldEluc3RhbmNlKCkuZ2V0KCdBZGRUZXN0JykpLnRvLmJlKEFkZFRlc3QpO1xuXG5cdCB9KTtcblxuXHQgaXQoJ2NhbiBpbmhlcml0IGZyb20gZ3JlbWxpbiBjbGFzc2VzJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuXHQgdmFyIGVsQ2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IGVsQ2hpbGRDb2ZmZWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0IGVsQ2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnSW5oZXJpdENoaWxkJyk7XG5cdCBlbENoaWxkQ29mZmVlLnNldEF0dHJpYnV0ZSgnZGF0YS1ncmVtbGluJywgJ0luaGVyaXRDaGlsZDInKTtcblxuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbENoaWxkKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxDaGlsZENvZmZlZSk7XG5cblx0IHZhciBQYXJlbnQgPSBHLkdpem1vLmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB9LFxuXHQge1xuXHQgZm9vOiAnYmFyJ1xuXHQgfSwge1xuXHQgRk9POiBcIkJBUlwiXG5cdCB9KTtcblxuXHQgdmFyIENoaWxkID0gUGFyZW50LmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KHRoaXMuZWwpLnRvLmVxdWFsKGVsQ2hpbGQpO1xuXHQgZXhwZWN0KHRoaXMuY29uc3RydWN0b3IpLnRvLmVxdWFsKENoaWxkKTtcblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9LFxuXHQge1xuXG5cdCB9LCB7XG5cblx0IH0pO1xuXG5cdCBHLmFkZCgnSW5oZXJpdFBhcmVudCcsIFBhcmVudCk7XG5cdCBHLmFkZCgnSW5oZXJpdENoaWxkJywgQ2hpbGQpO1xuXG5cdCBleHBlY3QoQ2hpbGQpLnRvLmhhdmUucHJvcGVydHkoJ0ZPTycpO1xuXHQgZXhwZWN0KENoaWxkLkZPTykudG8uZXF1YWwoJ0JBUicpO1xuXG5cdCBleHBlY3QoQ2hpbGQucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdmb28nKTtcblx0IGV4cGVjdChDaGlsZC5wcm90b3R5cGUuZm9vKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkKS50by5oYXZlLnByb3BlcnR5KCdGT08nKTtcblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkLkZPTykudG8uZXF1YWwoJ0ZPTycpO1xuXG5cdCBleHBlY3QoSW5oZXJpdFRlc3RDaGlsZC5wcm90b3R5cGUpLnRvLmhhdmUucHJvcGVydHkoJ2ZvbycpO1xuXHQgZXhwZWN0KEluaGVyaXRUZXN0Q2hpbGQucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdiYXInKTtcblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkLnByb3RvdHlwZS5mb28pLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cdCBleHBlY3QoSW5oZXJpdFRlc3RDaGlsZC5wcm90b3R5cGUuYmFyKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IH0pXG5cblx0IGl0KCdjYW4gY3JlYXRlIG5ldyBncmVtbGluIGNsYXNzZXMgd2l0aG91dCBjb2ZmZWVzY3JpcHQnLCBmdW5jdGlvbiAoKSB7XG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5hZGQoJ0RlZmluZVRlc3QnKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgfSwgJ2ZvbycsICdmb28nKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgfSwgZnVuY3Rpb24gKCkge1xuXHQgfSk7XG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXG5cdCB2YXIgVGVzdEdyZW1saW4gPSBHLkdpem1vLmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB9LCB7XG5cdCBmb286ICdiYXInXG5cdCB9LCB7XG5cdCBGT086IFwiQkFSXCJcblx0IH0pO1xuXG5cdCBleHBlY3QoVGVzdEdyZW1saW4pLnRvLmhhdmUucHJvcGVydHkoJ0ZPTycpO1xuXHQgZXhwZWN0KFRlc3RHcmVtbGluLkZPTykudG8uZXF1YWwoJ0JBUicpO1xuXG5cdCBleHBlY3QoVGVzdEdyZW1saW4ucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdmb28nKTtcblx0IGV4cGVjdChUZXN0R3JlbWxpbi5wcm90b3R5cGUuZm9vKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IH0pO1xuXG5cdCBpdCgnaW5zdGFudGlhdGVzIG5ldyBncmVtbGlucycsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IGVsQ29mZmVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdDcmVhdGVUZXN0Jyk7XG5cdCBlbENvZmZlZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdDcmVhdGVUZXN0Q29mZmVlJyk7XG5cblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbENvZmZlZSk7XG5cblx0IHZhciBUZXN0R3JlbWxpbiA9IEcuR2l6bW8uZXh0ZW5kKGZ1bmN0aW9uICgpIHtcblx0IHRyeSB7XG5cdCBleHBlY3QodGhpcy5lbCkudG8uZXF1YWwoZWwpO1xuXHQgZXhwZWN0KHRoaXMuY29uc3RydWN0b3IpLnRvLmVxdWFsKFRlc3RHcmVtbGluKTtcblx0IGV4cGVjdCh0aGlzLmlkKS50by5iZS5hKCdudW1iZXInKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmJlLmFuKCdvYmplY3QnKTtcblx0IC8vZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblx0IH0pO1xuXG5cblx0IFRlc3RHcmVtbGluID0gRy5hZGQoJ0NyZWF0ZVRlc3QnLCBUZXN0R3JlbWxpbik7XG5cdCB2YXIgQ3JlYXRlVGVzdEdyZW1saW4gPSBHLmFkZCgnQ3JlYXRlVGVzdENvZmZlZScsIENyZWF0ZVRlc3QpO1xuXG5cdCB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgdmFyIGcgPSBlbENvZmZlZS5fX2dyZW1saW47XG5cdCBleHBlY3QoZWxDb2ZmZWUuY2xhc3NOYW1lKS50by5lcXVhbCgnZ3JlbWxpbi1yZWFkeScpO1xuXHQgZXhwZWN0KGcuZWwpLnRvLmVxdWFsKGVsQ29mZmVlKTtcblx0IGV4cGVjdChnLmNvbnN0cnVjdG9yKS50by5lcXVhbChDcmVhdGVUZXN0R3JlbWxpbik7XG5cdCBleHBlY3QoZy5pZCkudG8uYmUuYSgnbnVtYmVyJyk7XG5cdCBleHBlY3QoZy5kYXRhKS50by5iZS5hbignb2JqZWN0Jyk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKVxuXHQgfSk7XG5cblx0IGl0KCdpbnN0YW50aWF0ZXMgbXVsdGlwbGUgZ3JlbWxpbnMgb24gYSBzaW5nZSBlbGVtZW50Jyk7XG5cblx0IGl0KCdoYW5kbGVzIGRhdGEgYXR0cmlidXRlcyBjb3JyZWN0bHknLCBmdW5jdGlvbiAoZG9uZSkge1xuXHQgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdCBjb21wbGV4ID0ge1xuXHQgZm9vOiAnYmFyJyxcblx0IGRlZXA6IHtcblx0IGZvbzogJ2Jhcidcblx0IH1cblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdEYXRhVGVzdCcpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXN0cmluZycsICdmb28nKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1udW1iZXInLCBcIjQyXCIpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXllcycsICd0cnVlJyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbm8nLCAnZmFsc2UnKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1vYmplY3QnLCBKU09OLnN0cmluZ2lmeShjb21wbGV4KSk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2l0aC1sb25nLW5hbWUnLCAnZm9vJyk7XG5cblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgdmFyIFRlc3RHcmVtbGluID0gRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ3N0cmluZycpXG5cdCBleHBlY3QodGhpcy5kYXRhLnN0cmluZykudG8uYmUoJ2ZvbycpO1xuXG5cdCBleHBlY3QodGhpcy5kYXRhKS50by5oYXZlLnByb3BlcnR5KCdudW1iZXInKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEubnVtYmVyKS50by5iZSg0Mik7XG5cblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ3llcycpO1xuXHQgZXhwZWN0KHRoaXMuZGF0YS55ZXMpLnRvLmJlLm9rKCk7XG5cblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ25vJyk7XG5cdCBleHBlY3QodGhpcy5kYXRhLm5vKS5ub3QudG8uYmUub2soKTtcblxuXHQgZXhwZWN0KHRoaXMuZGF0YSkudG8uaGF2ZS5wcm9wZXJ0eSgnb2JqZWN0Jyk7XG5cdCBleHBlY3QodGhpcy5kYXRhLm9iamVjdCkudG8uZXFsKGNvbXBsZXgpO1xuXG5cdCBleHBlY3QodGhpcy5kYXRhKS50by5oYXZlLnByb3BlcnR5KCd3aXRoTG9uZ05hbWUnKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEud2l0aExvbmdOYW1lKS50by5iZSgnZm9vJyk7XG5cblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9KTtcblxuXHQgRy5hZGQoJ0RhdGFUZXN0JywgVGVzdEdyZW1saW4pO1xuXHQgfSk7XG5cblx0IGl0KCdwdXRzIHVuYXZhaWxibGUgZ3JlbWxpbnMgaW50byBhIHF1ZXVlJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnUGVuZGluZ1Rlc3QnKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXG5cdCB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KGVsLmNsYXNzTmFtZSkudG8uZXF1YWwoJ2dyZW1saW4tbG9hZGluZyBncmVtbGluLWRlZmluaXRpb24tcGVuZGluZycpO1xuXHQgZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblx0IH0sIDYwMClcblxuXHQgfSk7XG5cblx0IGl0KCdoaWdobGlnaHRzIGdyZW1saW5zIHdpdGhvdXQgYSBuYW1lJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnJyk7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblxuXHQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChlbC5jbGFzc05hbWUpLnRvLmVxdWFsKCdncmVtbGluLWVycm9yJyk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKVxuXG5cdCB9KTtcblxuXHQgaXQoJ2xhenkgbG9hZHMgZ3JlbWxpbiBlbGVtZW50cycsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1ncmVtbGluJywgJ0xhenlUZXN0Jyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbi1sYXp5JywgJ3RydWUnKTtcblx0IGVsLnN0eWxlLm1hcmdpblRvcCA9IFwiMzAwMHB4XCI7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblxuXHQgdmFyIExhenlUZXN0ID0gRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdCh0aGlzLmVsKS50by5lcXVhbChlbCk7XG5cdCBkb25lKCk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9KTtcblx0IEcuYWRkKCdMYXp5VGVzdCcsIExhenlUZXN0KTtcblxuXHQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChlbC5jbGFzc05hbWUpLnRvLmVxdWFsKCdncmVtbGluLWxvYWRpbmcnKTtcblx0IHdpbmRvdy5zY3JvbGxUbygwLCBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKTtcblxuXHQgfSk7XG5cblx0IGl0KCdkaXNwYXRjaGVzIGV2ZW50IHdoZW4gZ3JlbWxpbiBlbGVtZW50IHdhcyBmb3VuZCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IG9uRm91bmQgPSBmdW5jdGlvbiAoZm91bmRFbCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChmb3VuZEVsKS50by5lcXVhbChlbCk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXG5cdCBHLm9mZihHLk9OX0VMRU1FTlRfRk9VTkQsIG9uRm91bmQpO1xuXHQgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG5cdCB9O1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnRXZlbnRPbkZvdW5kVGVzdCcpO1xuXG5cdCBHLm9uKEcuT05fRUxFTUVOVF9GT1VORCwgb25Gb3VuZCk7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblx0IH0pO1xuXG5cdCBpdCgnZGlzcGF0Y2hlcyBldmVudCB3aGVuIGdyZW1saW4gZGVmaW5pdGlvbiBpcyBwZW5kaW5nJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHQgb25QZW5kaW5nID0gZnVuY3Rpb24gKGZvdW5kRWwpIHtcblx0IHRyeSB7XG5cdCBleHBlY3QoZm91bmRFbCkudG8uZXF1YWwoZWwpO1xuXHQgZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblxuXHQgRy5vZmYoRy5PTl9ERUZJTklUSU9OX1BFTkRJTkcsIG9uUGVuZGluZyk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdFdmVudE9uUGVuZGluZ1Rlc3QnKTtcblxuXHQgRy5vbihHLk9OX0RFRklOSVRJT05fUEVORElORywgb25QZW5kaW5nKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgfSk7XG5cblx0IGl0KCdkaXNwYXRjaGVzIGV2ZW50IHdoZW4gZ3JlbWxpbiBpbnN0YW5jZSB3YXMgY3JlYXRlZCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IG9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChmb3VuZEVsKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KGZvdW5kRWwpLnRvLmVxdWFsKGVsKTtcblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cblx0IEcub2ZmKEcuT05fR1JFTUxJTl9MT0FERUQsIG9uQ3JlYXRlZCk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdFdmVudE9uTG9hZGVkVGVzdCcpO1xuXHQgRy5vbihHLk9OX0dSRU1MSU5fTE9BREVELCBvbkNyZWF0ZWQpO1xuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG5cblx0IHZhciBFdmVudE9uTG9hZGVkVGVzdCA9IEcuR2l6bW8uZXh0ZW5kKGZ1bmN0aW9uICgpIHtcblxuXHQgfSk7XG5cblx0IEcuYWRkKCdFdmVudE9uTG9hZGVkVGVzdCcsIEV2ZW50T25Mb2FkZWRUZXN0KTtcblx0IH0pO1xuXG5cdCAqL1xufSk7IiwicmVxdWlyZSgnLi9ncmVtbGlucy10ZXN0cycpO1xucmVxdWlyZSgnLi9HcmVtbGluLXRlc3RzJyk7XG5yZXF1aXJlKCcuL01peGlucy10ZXN0cycpO1xuIiwiJ3VzZSBzdHJpY3QnO1xudmFyIG5vb3AgPSBmdW5jdGlvbiAoKSB7XG59O1xudmFyIHR5cGVzID0gWydsb2cnLCAnaW5mbycsICd3YXJuJ107XG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Y3JlYXRlKCkge1xuXHRcdGlmIChjb25zb2xlID09PSB1bmRlZmluZWQpIHtcblx0XHRcdGdsb2JhbC5jb25zb2xlID0ge307XG5cdFx0fVxuXHRcdHR5cGVzLmZvckVhY2godHlwZT0+IHtcblx0XHRcdGlmICh0eXBlb2YgY29uc29sZVt0eXBlXSAhPT0gJ2Z1bmN0aW9uJykge1xuXHRcdFx0XHRjb25zb2xlW3R5cGVdID0gbm9vcCgpO1xuXHRcdFx0fVxuXHRcdH0pO1xuXHR9XG59O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgZG9tcmVhZHkgPSByZXF1aXJlKCdkb21yZWFkeScpLFxuXHRjb25zb2xlU2hpbSA9IHJlcXVpcmUoJy4vY29uc29sZVNoaW0nKSxcblx0e2NyZWF0ZX0gPSByZXF1aXJlKCcuL0dyZW1saW4nKSxcblx0e29ic2VydmV9ID0gcmVxdWlyZSgnLi9Db2xsZWN0aW9uJyk7XG5cbnZhciBCUkFORElORyA9ICdncmVtbGluc19jb25uZWN0ZWQnO1xuY29uc29sZVNoaW0uY3JlYXRlKCk7XG5cbm1vZHVsZS5leHBvcnRzID0ge2NyZWF0ZX07XG5cbmRvbXJlYWR5KCgpPT4ge1xuXHQvLyB3ZSBkb24ndCBhbGxvdyBtdWx0aXBsZSBncmVtbGluLmpzIHNjcmlwdHMgaW4gYSBzaW5nbGUgcGFnZSwgc3RyYW5nZSBhbmQgaGFyZCB0byBkZWJ1ZyB0aGluZ3Mgd2lsbCBoYXBwZW4gb3RoZXJ3aXNlXG5cdGlmIChkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdZb3UgdHJpZWQgdG8gaW5jbHVkZSBncmVtbGluLmpzIG11bHRpcGxlIHRpbWVzLiBEb25cXCd0IGRvIHRoYXQuJyk7XG5cdH1cblxuXHRkb2N1bWVudC5kb2N1bWVudEVsZW1lbnRbQlJBTkRJTkddID0gdHJ1ZTtcblx0b2JzZXJ2ZSgpO1xufSk7XG4iLCIvLyBzZWUgaHR0cHM6Ly9naXN0LmdpdGh1Yi5jb20vamVkLzk4Mjg4M1xuJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGIoYSkge1xuXHRyZXR1cm4gYSA/IChhIF4gTWF0aC5yYW5kb20oKSAqIDE2ID4+IGEgLyA0KS50b1N0cmluZygxNikgOiAoWzFlN10gKyAtMWUzICsgLTRlMyArIC04ZTMgKyAtMWUxMSkucmVwbGFjZSgvWzAxOF0vZywgYik7XG59O1xuIiwiLyohXG4gICogZG9tcmVhZHkgKGMpIER1c3RpbiBEaWF6IDIwMTQgLSBMaWNlbnNlIE1JVFxuICAqL1xuIWZ1bmN0aW9uIChuYW1lLCBkZWZpbml0aW9uKSB7XG5cbiAgaWYgKHR5cGVvZiBtb2R1bGUgIT0gJ3VuZGVmaW5lZCcpIG1vZHVsZS5leHBvcnRzID0gZGVmaW5pdGlvbigpXG4gIGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT0gJ2Z1bmN0aW9uJyAmJiB0eXBlb2YgZGVmaW5lLmFtZCA9PSAnb2JqZWN0JykgZGVmaW5lKGRlZmluaXRpb24pXG4gIGVsc2UgdGhpc1tuYW1lXSA9IGRlZmluaXRpb24oKVxuXG59KCdkb21yZWFkeScsIGZ1bmN0aW9uICgpIHtcblxuICB2YXIgZm5zID0gW10sIGxpc3RlbmVyXG4gICAgLCBkb2MgPSBkb2N1bWVudFxuICAgICwgaGFjayA9IGRvYy5kb2N1bWVudEVsZW1lbnQuZG9TY3JvbGxcbiAgICAsIGRvbUNvbnRlbnRMb2FkZWQgPSAnRE9NQ29udGVudExvYWRlZCdcbiAgICAsIGxvYWRlZCA9IChoYWNrID8gL15sb2FkZWR8XmMvIDogL15sb2FkZWR8Xml8XmMvKS50ZXN0KGRvYy5yZWFkeVN0YXRlKVxuXG5cbiAgaWYgKCFsb2FkZWQpXG4gIGRvYy5hZGRFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyID0gZnVuY3Rpb24gKCkge1xuICAgIGRvYy5yZW1vdmVFdmVudExpc3RlbmVyKGRvbUNvbnRlbnRMb2FkZWQsIGxpc3RlbmVyKVxuICAgIGxvYWRlZCA9IDFcbiAgICB3aGlsZSAobGlzdGVuZXIgPSBmbnMuc2hpZnQoKSkgbGlzdGVuZXIoKVxuICB9KVxuXG4gIHJldHVybiBmdW5jdGlvbiAoZm4pIHtcbiAgICBsb2FkZWQgPyBmbigpIDogZm5zLnB1c2goZm4pXG4gIH1cblxufSk7XG4iLCIndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIFRvT2JqZWN0KHZhbCkge1xuXHRpZiAodmFsID09IG51bGwpIHtcblx0XHR0aHJvdyBuZXcgVHlwZUVycm9yKCdPYmplY3QuYXNzaWduIGNhbm5vdCBiZSBjYWxsZWQgd2l0aCBudWxsIG9yIHVuZGVmaW5lZCcpO1xuXHR9XG5cblx0cmV0dXJuIE9iamVjdCh2YWwpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5hc3NpZ24gfHwgZnVuY3Rpb24gKHRhcmdldCwgc291cmNlKSB7XG5cdHZhciBmcm9tO1xuXHR2YXIga2V5cztcblx0dmFyIHRvID0gVG9PYmplY3QodGFyZ2V0KTtcblxuXHRmb3IgKHZhciBzID0gMTsgcyA8IGFyZ3VtZW50cy5sZW5ndGg7IHMrKykge1xuXHRcdGZyb20gPSBhcmd1bWVudHNbc107XG5cdFx0a2V5cyA9IE9iamVjdC5rZXlzKE9iamVjdChmcm9tKSk7XG5cblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IGtleXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHRvW2tleXNbaV1dID0gZnJvbVtrZXlzW2ldXTtcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gdG87XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwge19fcHJvdG9fXzpbXX0gaW5zdGFuY2VvZiBBcnJheSA/IHNldFByb3RvT2YgOiBtaXhpblByb3BlcnRpZXM7XG5cbmZ1bmN0aW9uIHNldFByb3RvT2Yob2JqLCBwcm90bykge1xuXHRvYmouX19wcm90b19fID0gcHJvdG87XG59XG5cbmZ1bmN0aW9uIG1peGluUHJvcGVydGllcyhvYmosIHByb3RvKSB7XG5cdGZvciAodmFyIHByb3AgaW4gcHJvdG8pIHtcblx0XHRvYmpbcHJvcF0gPSBwcm90b1twcm9wXTtcblx0fVxufVxuIiwidmFyIGV4aXN0ZWQgPSBmYWxzZTtcbnZhciBvbGQ7XG5cbmlmICgnc21va2VzaWduYWxzJyBpbiBnbG9iYWwpIHtcbiAgICBleGlzdGVkID0gdHJ1ZTtcbiAgICBvbGQgPSBnbG9iYWwuc21va2VzaWduYWxzO1xufVxuXG5yZXF1aXJlKCcuL3Ntb2tlc2lnbmFscycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHNtb2tlc2lnbmFscztcblxuaWYgKGV4aXN0ZWQpIHtcbiAgICBnbG9iYWwuc21va2VzaWduYWxzID0gb2xkO1xufVxuZWxzZSB7XG4gICAgZGVsZXRlIGdsb2JhbC5zbW9rZXNpZ25hbHM7XG59XG4iLCJzbW9rZXNpZ25hbHMgPSB7XG4gICAgY29udmVydDogZnVuY3Rpb24ob2JqLCBoYW5kbGVycykge1xuICAgICAgICAvLyB3ZSBzdG9yZSB0aGUgbGlzdCBvZiBoYW5kbGVycyBhcyBhIGxvY2FsIHZhcmlhYmxlIGluc2lkZSB0aGUgc2NvcGVcbiAgICAgICAgLy8gc28gdGhhdCB3ZSBkb24ndCBoYXZlIHRvIGFkZCByYW5kb20gcHJvcGVydGllcyB0byB0aGUgb2JqZWN0IHdlIGFyZVxuICAgICAgICAvLyBjb252ZXJ0aW5nLiAocHJlZml4aW5nIHZhcmlhYmxlcyBpbiB0aGUgb2JqZWN0IHdpdGggYW4gdW5kZXJzY29yZSBvclxuICAgICAgICAvLyB0d28gaXMgYW4gdWdseSBzb2x1dGlvbilcbiAgICAgICAgLy8gd2UgZGVjbGFyZSB0aGUgdmFyaWFibGUgaW4gdGhlIGZ1bmN0aW9uIGRlZmluaXRpb24gdG8gdXNlIHR3byBsZXNzXG4gICAgICAgIC8vIGNoYXJhY3RlcnMgKGFzIG9wcG9zZWQgdG8gdXNpbmcgJ3ZhciAnKS4gIEkgY29uc2lkZXIgdGhpcyBhbiBpbmVsZWdhbnRcbiAgICAgICAgLy8gc29sdXRpb24gc2luY2Ugc21va2VzaWduYWxzLmNvbnZlcnQubGVuZ3RoIG5vdyByZXR1cm5zIDIgd2hlbiBpdCBpc1xuICAgICAgICAvLyByZWFsbHkgMSwgYnV0IGRvaW5nIHRoaXMgZG9lc24ndCBvdGhlcndpc2UgY2hhbmdlIHRoZSBmdW5jdGlvbmFsbGl0eSBvZlxuICAgICAgICAvLyB0aGlzIG1vZHVsZSwgc28gd2UnbGwgZ28gd2l0aCBpdCBmb3Igbm93XG4gICAgICAgIGhhbmRsZXJzID0ge307XG5cbiAgICAgICAgLy8gYWRkIGEgbGlzdGVuZXJcbiAgICAgICAgb2JqLm9uID0gZnVuY3Rpb24oZXZlbnROYW1lLCBoYW5kbGVyKSB7XG4gICAgICAgICAgICAvLyBlaXRoZXIgdXNlIHRoZSBleGlzdGluZyBhcnJheSBvciBjcmVhdGUgYSBuZXcgb25lIGZvciB0aGlzIGV2ZW50XG4gICAgICAgICAgICAoaGFuZGxlcnNbZXZlbnROYW1lXSB8fCAoaGFuZGxlcnNbZXZlbnROYW1lXSA9IFtdKSlcbiAgICAgICAgICAgICAgICAvLyBhZGQgdGhlIGhhbmRsZXIgdG8gdGhlIGFycmF5XG4gICAgICAgICAgICAgICAgLnB1c2goaGFuZGxlcik7XG5cbiAgICAgICAgICAgIHJldHVybiBvYmo7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgYSBsaXN0ZW5lciB0aGF0IHdpbGwgb25seSBiZSBjYWxsZWQgb25jZVxuICAgICAgICBvYmoub25jZSA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgLy8gY3JlYXRlIGEgd3JhcHBlciBsaXN0ZW5lciwgdGhhdCB3aWxsIHJlbW92ZSBpdHNlbGYgYWZ0ZXIgaXQgaXMgY2FsbGVkXG4gICAgICAgICAgICBmdW5jdGlvbiB3cmFwcGVkSGFuZGxlcigpIHtcbiAgICAgICAgICAgICAgICAvLyByZW1vdmUgb3Vyc2VsZiwgYW5kIHRoZW4gY2FsbCB0aGUgcmVhbCBoYW5kbGVyIHdpdGggdGhlIGFyZ3NcbiAgICAgICAgICAgICAgICAvLyBwYXNzZWQgdG8gdGhpcyB3cmFwcGVyXG4gICAgICAgICAgICAgICAgaGFuZGxlci5hcHBseShvYmoub2ZmKGV2ZW50TmFtZSwgd3JhcHBlZEhhbmRsZXIpLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaW4gb3JkZXIgdG8gYWxsb3cgdGhhdCB0aGVzZSB3cmFwcGVkIGhhbmRsZXJzIGNhbiBiZSByZW1vdmVkIGJ5XG4gICAgICAgICAgICAvLyByZW1vdmluZyB0aGUgb3JpZ2luYWwgZnVuY3Rpb24sIHdlIHNhdmUgYSByZWZlcmVuY2UgdG8gdGhlIG9yaWdpbmFsXG4gICAgICAgICAgICAvLyBmdW5jdGlvblxuICAgICAgICAgICAgd3JhcHBlZEhhbmRsZXIuaCA9IGhhbmRsZXI7XG5cbiAgICAgICAgICAgIC8vIGNhbGwgdGhlIHJlZ3VsYXIgYWRkIGxpc3RlbmVyIGZ1bmN0aW9uIHdpdGggb3VyIG5ldyB3cmFwcGVyXG4gICAgICAgICAgICByZXR1cm4gb2JqLm9uKGV2ZW50TmFtZSwgd3JhcHBlZEhhbmRsZXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcmVtb3ZlIGEgbGlzdGVuZXJcbiAgICAgICAgb2JqLm9mZiA9IGZ1bmN0aW9uKGV2ZW50TmFtZSwgaGFuZGxlcikge1xuICAgICAgICAgICAgLy8gbG9vcCB0aHJvdWdoIGFsbCBoYW5kbGVycyBmb3IgdGhpcyBldmVudE5hbWUsIGFzc3VtaW5nIGEgaGFuZGxlclxuICAgICAgICAgICAgLy8gd2FzIHBhc3NlZCBpbiwgdG8gc2VlIGlmIHRoZSBoYW5kbGVyIHBhc3NlZCBpbiB3YXMgYW55IG9mIHRoZW0gc29cbiAgICAgICAgICAgIC8vIHdlIGNhbiByZW1vdmUgaXRcbiAgICAgICAgICAgIGZvciAodmFyIGxpc3QgPSBoYW5kbGVyc1tldmVudE5hbWVdLCBpID0gMDsgaGFuZGxlciAmJiBsaXN0ICYmIGxpc3RbaV07IGkrKykge1xuICAgICAgICAgICAgICAgIC8vIGVpdGhlciB0aGlzIGl0ZW0gaXMgdGhlIGhhbmRsZXIgcGFzc2VkIGluLCBvciB0aGlzIGl0ZW0gaXMgYVxuICAgICAgICAgICAgICAgIC8vIHdyYXBwZXIgZm9yIHRoZSBoYW5kbGVyIHBhc3NlZCBpbi4gIFNlZSB0aGUgJ29uY2UnIGZ1bmN0aW9uXG4gICAgICAgICAgICAgICAgbGlzdFtpXSAhPSBoYW5kbGVyICYmIGxpc3RbaV0uaCAhPSBoYW5kbGVyIHx8XG4gICAgICAgICAgICAgICAgICAgIC8vIHJlbW92ZSBpdCFcbiAgICAgICAgICAgICAgICAgICAgbGlzdC5zcGxpY2UoaS0tLDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgLy8gaWYgaSBpcyAwIChpLmUuIGZhbHN5KSwgdGhlbiB0aGVyZSBhcmUgbm8gaXRlbXMgaW4gdGhlIGFycmF5IGZvciB0aGlzXG4gICAgICAgICAgICAvLyBldmVudCBuYW1lIChvciB0aGUgYXJyYXkgZG9lc24ndCBleGlzdClcbiAgICAgICAgICAgIGlmICghaSkge1xuICAgICAgICAgICAgICAgIC8vIHJlbW92ZSB0aGUgYXJyYXkgZm9yIHRoaXMgZXZlbnRuYW1lIChpZiBpdCBkb2Vzbid0IGV4aXN0IHRoZW5cbiAgICAgICAgICAgICAgICAvLyB0aGlzIGlzbid0IHJlYWxseSBodXJ0aW5nIGFueXRoaW5nKVxuICAgICAgICAgICAgICAgIGRlbGV0ZSBoYW5kbGVyc1tldmVudE5hbWVdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIG9iai5lbWl0ID0gZnVuY3Rpb24oZXZlbnROYW1lKSB7XG4gICAgICAgICAgICAvLyBsb29wIHRocm91Z2ggYWxsIGhhbmRsZXJzIGZvciB0aGlzIGV2ZW50IG5hbWUgYW5kIGNhbGwgdGhlbSBhbGxcbiAgICAgICAgICAgIGZvcih2YXIgbGlzdCA9IGhhbmRsZXJzW2V2ZW50TmFtZV0sIGkgPSAwOyBsaXN0ICYmIGxpc3RbaV07KSB7XG4gICAgICAgICAgICAgICAgbGlzdFtpKytdLmFwcGx5KG9iaiwgbGlzdC5zbGljZS5jYWxsKGFyZ3VtZW50cywgMSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIG9iajtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvYmo7XG4gICAgfVxufVxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4vdXRpbC9oZWxwZXInKSxcblx0Y29uc3RhbnRzID0gcmVxdWlyZSgnLi91dGlsL2NvbnN0YW50cycpLFxuXHRMaXZlTm9kZUxpc3QgPSByZXF1aXJlKCcuL0xpdmVOb2RlTGlzdCcpLFxuXHRRdWVyeVN0cmF0ZWd5RmFjdG9yeSA9IHJlcXVpcmUoJy4vZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeScpO1xuXG5cbi8qKlxuICogQG1vZHVsZSB3YXRjaGVkL0RvbUVsZW1lbnRcbiAqL1xuXG5cblxuXG4vKipcbiAqIE9iamVjdCB1c2VkIGFzIHByb3RvdHlwZSBmb3IgbmV3IERvbUVsZW1lbnQgaW5zdGFuY2VzLlxuICogU2hvdWxkIGJlIHVzZWQgYXMgYSBwcm90b3R5cGUgZm9yIG5ldyBgRG9tRWxlbWVudGAgaW5zdGFuY2VzXG4gKlxuICogQG5hbWVzcGFjZSBtb2R1bGU6d2F0Y2hlZC9Eb21FbGVtZW50fkRvbUVsZW1lbnRcbiAqL1xudmFyIERvbUVsZW1lbnQgPSB7XG5cdF9fbmFtZV9fOiAnRG9tRWxlbWVudCdcbn07XG5cbi8qKlxuICogQWRkIGFsbCBhdmFpbGFibGUgcXVlcmllcyB0byB0aGUgRG9tRWxlbWVudCdzIHByb3RvdHlwZVxuICovXG5jb25zdGFudHMuQVZBSUxBQkxFX1FVRVJJRVMuZm9yRWFjaChmdW5jdGlvbiAocXVlcnlUeXBlKSB7XG5cdERvbUVsZW1lbnRbcXVlcnlUeXBlXSA9IGZ1bmN0aW9uIChzZWxlY3Rvcikge1xuXHRcdC8vIFRPRE8gdGlueSBxdWVyeSBmYWN0b3J5LCBiZXR0ZXIgZG8gc29tZSBlcnJvciBoYW5kbGluZz9cblx0XHR2YXIgcXVlcnlTdHJhdGVneSA9IFF1ZXJ5U3RyYXRlZ3lGYWN0b3J5LmNyZWF0ZShxdWVyeVR5cGUsIHRoaXMuZWwsIHNlbGVjdG9yKTtcblxuXHRcdHJldHVybiBMaXZlTm9kZUxpc3QocXVlcnlTdHJhdGVneSk7XG5cdH07XG59KTtcblxuXG4vKipcbiAqIFNlZSBbYHF1ZXJ5U2VsZWN0b3JBbGxgXShodHRwOi8vZGV2ZG9jcy5pby9kb20vZG9jdW1lbnQucXVlcnlzZWxlY3RvcmFsbCkgZm9yIGRldGFpbHMuXG4gKlxuICogQGZ1bmN0aW9uIHF1ZXJ5U2VsZWN0b3JBbGxcbiAqIEBtZW1iZXJvZiBtb2R1bGU6d2F0Y2hlZC9Eb21FbGVtZW50fkRvbUVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQGluc3RhbmNlXG4gKiBAcmV0dXJucyB7bW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdH1cbiAqL1xuXG4vKipcbiAqIFNlZSBbYHF1ZXJ5U2VsZWN0b3JgXShodHRwOi8vZGV2ZG9jcy5pby9kb20vZG9jdW1lbnQucXVlcnlzZWxlY3RvcikgZm9yIGRldGFpbHMuIFRoZSByZXR1cm5lZCBvYmplY3Qgd2lsbCBiZSBhbHdheXNcbiAqIGEgYExpdmVOb2RlTGlzdGAsIG5vdCBhIHNpbmdsZSBlbGVtZW50IGFzIGluIHRoZSBuYXRpdmUgYHF1ZXJ5U2VsZWN0b3JgLlxuICpcbiAqIEBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yXG4gKiBAbWVtYmVyb2YgbW9kdWxlOndhdGNoZWQvRG9tRWxlbWVudH5Eb21FbGVtZW50XG4gKiBAcGFyYW0gZWxlbWVudFxuICogQGluc3RhbmNlXG4gKiBAcmV0dXJucyB7bW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdH1cbiAqL1xuXG4vKipcbiAqIFNlZSBbYGdldEVsZW1lbnRzQnlUYWdOYW1lYF0oaHR0cDovL2RldmRvY3MuaW8vZG9tL2VsZW1lbnQuZ2V0ZWxlbWVudHNieXRhZ25hbWUpIGZvciBkZXRhaWxzLiBTaG91bGQgYmUgZmFzdGVyIHRoYW5cbiAqIHRoZSBxdWVyeSBzZWxlY3RvcnMsIGFzICoqd2F0Y2hlZC5qcyoqIHVzZXMgdGhlIG5hdGl2ZSBsaXZlIG5vZGVsaXN0IGludGVybmFsbHkgdG8gZ2V0IHRoZSBlbGVtZW50cyB5b3Ugd2FudC5cbiAqXG4gKiBAZnVuY3Rpb24gZ2V0RWxlbWVudHNCeVRhZ05hbWVcbiAqIEBtZW1iZXJvZiBtb2R1bGU6d2F0Y2hlZC9Eb21FbGVtZW50fkRvbUVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQGluc3RhbmNlXG4gKiBAcmV0dXJucyB7bW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdH1cbiAqL1xuXG5cbi8qKlxuICogU2VlIFtgZ2V0RWxlbWVudHNCeUNsYXNzTmFtZWBdKGh0dHA6Ly9kZXZkb2NzLmlvL2RvbS9kb2N1bWVudC5nZXRlbGVtZW50c2J5Y2xhc3NuYW1lKSBmb3IgZGV0YWlscy4gU2hvdWxkIGJlIGZhc3RlclxuICogdGhhbiB0aGUgcXVlcnkgc2VsZWN0b3JzLCBhcyAqKndhdGNoZWQuanMqKiB1c2VzIHRoZSBuYXRpdmUgbGl2ZSBub2RlbGlzdCBpbnRlcm5hbGx5IHRvIGdldCB0aGUgZWxlbWVudHMgeW91IHdhbnQuXG4gKlxuICogQGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlDbGFzc05hbWVcbiAqIEBtZW1iZXJvZiBtb2R1bGU6d2F0Y2hlZC9Eb21FbGVtZW50fkRvbUVsZW1lbnRcbiAqIEBwYXJhbSB7U3RyaW5nfSBzZWxlY3RvclxuICogQGluc3RhbmNlXG4gKiBAcmV0dXJucyB7bW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdH1cbiAqL1xuXG5cbi8qKlxuICogZmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIG5ldyBgRG9tRWxlbWVudGAgaW5zdGFuY2VzXG4gKlxuICogQHBhcmFtIHtIVE1MRWxlbWVudH0gZWxlbWVudCB0aGUgSFRNTEVsZW1lbnQgdXNlZCBhcyByb290IGZvciBhbGwgcXVlcmllc1xuICogQHJldHVybnMge21vZHVsZTp3YXRjaGVkL0RvbUVsZW1lbnR+RG9tRWxlbWVudH1cbiAqIEB0aHJvd3Mge0Vycm9yfFR5cGVFcnJvcn1cbiAqIEBleGFtcGxlXG4gKiB2YXIgRG9tRWxlbWVudCA9IHJlcXVpcmUoJy4vRG9tRWxlbWVudCcpO1xuICogdmFyIGRvbUVsZW1lbnQgPSBEb21FbGVtZW50KGRvY3VtZW50KTtcbiAqIHZhciBub2RlTGlzdCA9IGRvbUVsZW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLmZvbycpO1xuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGVsZW1lbnQpe1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCdUaGUgRG9tRWxlbWVudCBpcyBhIGZhY3RvcnkgZnVuY3Rpb24sIG5vdCBhIGNvbnN0cnVjdG9yLiBEb25cXCd0IHVzZSB0aGUgbmV3IGtleXdvcmQgd2l0aCBpdCcpO1xuXHR9XG5cdGlmIChoZWxwZXIuaXNJbnZhbGlkRG9tRWxlbWVudChlbGVtZW50KSkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ1RoZSBlbGVtZW50IHRvIHdhdGNoIGhhcyB0byBiZSBhIEhUTUxFbGVtZW50ISBUaGUgdHlwZSBvZiB0aGUgZ2l2ZW4gZWxlbWVudCBpcyAnICsgdHlwZW9mIGVsZW1lbnQgKTtcblx0fVxuXG5cdHZhciBkb21FbGVtZW50ID0gT2JqZWN0LmNyZWF0ZShEb21FbGVtZW50LCB7XG5cdFx0ZWwgOiB7XG5cdFx0XHR2YWx1ZTogZWxlbWVudFxuXHRcdH1cblx0fSk7XG5cdHJldHVybiBkb21FbGVtZW50O1xufTsiLCJ2YXIgc21va2VzaWduYWxzID0gcmVxdWlyZSgnc21va2VzaWduYWxzJyksXG5cdGNvbnN0YW50cyA9IHJlcXVpcmUoJy4vdXRpbC9jb25zdGFudHMnKSxcblx0aGVscGVyID0gcmVxdWlyZSgnLi91dGlsL2hlbHBlcicpLFxuXHREb21RdWVyeSA9IHJlcXVpcmUoJy4vZG9tUXVlcmllcy9Eb21RdWVyeScpLFxuXHROYXRpdmVPYnNlcnZlciA9IHJlcXVpcmUoJy4vb2JzZXJ2ZXJzL05hdGl2ZU9ic2VydmVyJyksXG5cdEludGVydmFsT2JzZXJ2ZXIgPSByZXF1aXJlKCcuL29ic2VydmVycy9JbnRlcnZhbE9ic2VydmVyJyk7XG5cbi8vIFRoZSBvbmUgYW5kIG9ubHkgbG9jYWwgaW5zdGFuY2Ugb2YgYSBtdXRhdGlvbiBvYnNlcnZlclxudmFyIG11dGF0aW9uT2JzZXJ2ZXIgPSBPYmplY3QuY3JlYXRlKGhlbHBlci5oYXNNdXRhdGlvbk9ic2VydmVyID8gTmF0aXZlT2JzZXJ2ZXIgOiBJbnRlcnZhbE9ic2VydmVyKTtcbm11dGF0aW9uT2JzZXJ2ZXIuaW5pdCgpO1xuXG4vKipcbiAqIHNtb2tlc2lnbmFscyBldmVudCBlbWl0dGVyXG4gKlxuICogQGV4dGVybmFsIHtzbW9rZXNpZ25hbHN9XG4gKiBAc2VlIGh0dHBzOi8vYml0YnVja2V0Lm9yZy9iZW50b21hcy9zbW9rZXNpZ25hbHMuanNcbiAqL1xuXG5cbi8qKlxuICogQE1vZHVsZSB3YXRjaGVkL0xpdmVOb2RlTGlzdFxuICovXG5cblxuLyoqXG4gKiBkaWZmcyB0d28gYXJyYXlzLCByZXR1cm5zIHRoZSBkaWZmZXJlbmNlXG4gKlxuICogIGRpZmYoWzEsMl0sWzIsMyw0XSk7IC8vWzFdXG4gKlxuICogQHBhcmFtIHtBcnJheX0gdGFyZ2V0XG4gKiBAcGFyYW0ge0FycmF5fSBvdGhlclxuICogQHJldHVybnMge0FycmF5fVxuICogQHByaXZhdGVcbiAqL1xudmFyIGRpZmYgPSBmdW5jdGlvbiAodGFyZ2V0LCBvdGhlcikge1xuXHRyZXR1cm4gdGFyZ2V0LmZpbHRlcihmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRcdHJldHVybiAhaGVscGVyLmFycmF5Q29udGFpbnMob3RoZXIsIGVsZW1lbnQpO1xuXHR9KTtcbn07XG5cblxuLyoqXG4gKlxuICogQSBsaXZlIGxpc3Qgb2YgZG9tIGVsZW1lbnRzLCBhbHdheXMgdXAgdG8gZGF0ZS5cbiAqXG4gKiBJdCdzIGEgbGl2ZSBsaXN0LCBzaW1pbGFyIHRvIHRoZSBsaXN0IHJldHVybmVkIGJ5IGBnZXRFbGVtZW50c0J5KFRhZ3xDbGFzcylOYW1lYC4gQnV0IG90aGVyIHRoYW4gdGhlc2UgcXVlcmllcyxcbiAqIHRoZSBgTGl2ZU5vZGVMaXN0YCBkaXNwYXRjaGVzIGV2ZW50IG9uIGNoYW5nZXMhXG4gKlxuICogQG5hbWVzcGFjZSBtb2R1bGU6d2F0Y2hlZC9MaXZlTm9kZUxpc3R+TGl2ZU5vZGVMaXN0XG4gKiBAbWl4ZXMgZXh0ZXJuYWw6c21va2VzaWduYWxzXG4gKiBAc2VlIHtAbGluayBodHRwczovL2JpdGJ1Y2tldC5vcmcvYmVudG9tYXMvc21va2VzaWduYWxzLmpzfHNtb2tlc2lnbmFsc30gZm9yIHRoZSBldmVudCBlbWl0dGVyIGxpYnJhcnkgbWl4ZWQgaW50b1xuICogYExpdmVOb2RlTGlzdGAuXG4gKiBAZmlyZXMgbW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdCNjaGFuZ2VkXG4gKiBAZmlyZXMgbW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdCNhZGRlZFxuICogQGZpcmVzIG1vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3QjcmVtb3ZlZFxuICovXG52YXIgTGl2ZU5vZGVMaXN0ID0ge1xuXHQvKipcblx0ICogbmFtZSBoZWxwZXIsIG1haW5seSB1c2VkIGZvciB0ZXN0c1xuXHQgKiBAcHJpdmF0ZVxuXHQgKiBAaW5zdGFuY2Vcblx0ICogKi9cblx0X19uYW1lX186ICdMaXZlTm9kZUxpc3QnLFxuXG5cdC8qKlxuXHQgKiBJbml0aWFsaXplIHRoZSBMaXZlTm9kZUxpc3Rcblx0ICogQHBhcmFtIHtEb21RdWVyeX0gZWxlbWVudFF1ZXJ5XG5cdCAqIEBpbnN0YW5jZVxuXHQgKi9cblx0aW5pdDogZnVuY3Rpb24gKGVsZW1lbnRRdWVyeSkge1xuXHRcdHRoaXMuX2lzQWN0aXZlID0gZmFsc2U7XG5cdFx0dGhpcy5fbGVuZ3RoID0gMDtcblx0XHR0aGlzLl9xdWVyeSA9IGVsZW1lbnRRdWVyeTtcblx0XHR0aGlzLl9vbk11dGF0ZUhhbmRsZXIgPSB0aGlzLl9vbk11dGF0ZS5iaW5kKHRoaXMpO1xuXHRcdHRoaXMucmVzdW1lKCk7XG5cdH0sXG5cblx0X29uTXV0YXRlOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIG9sZEVsZW1lbnRzID0gdGhpcy5fcXVlcnkub2xkKCksXG5cdFx0XHRjdXJyZW50RWxlbWVudHMgPSB0aGlzLl9xdWVyeS5jdXJyZW50KCksXG5cdFx0XHRhZGRlZEVsZW1lbnRzLCByZW1vdmVkRWxlbWVudHMsIHdhc0FkZGVkLCB3YXNSZW1vdmVkO1xuXG5cdFx0Ly8gMS4gZmluZCBhbGwgdGhlIGFkZGVkIGVsZW1lbnRzXG5cdFx0YWRkZWRFbGVtZW50cyA9IGRpZmYoY3VycmVudEVsZW1lbnRzLCBvbGRFbGVtZW50cyk7XG5cblx0XHQvLyAyLiBmaW5kIGFsbCB0aGUgcmVtb3ZlZCBlbGVtZW50c1xuXHRcdHJlbW92ZWRFbGVtZW50cyA9IGRpZmYob2xkRWxlbWVudHMsIGN1cnJlbnRFbGVtZW50cyk7XG5cblx0XHQvLyAzLiB1cGRhdGUgdGhlIG5vZGVsaXN0IGFycmF5XG5cdFx0dGhpcy5fdXBkYXRlQXJyYXkoY3VycmVudEVsZW1lbnRzKTtcblxuXHRcdHdhc0FkZGVkID0gYWRkZWRFbGVtZW50cy5sZW5ndGggPiAwO1xuXHRcdHdhc1JlbW92ZWQgPSByZW1vdmVkRWxlbWVudHMubGVuZ3RoID4gMDtcblxuXHRcdGlmICh3YXNBZGRlZCB8fCB3YXNSZW1vdmVkKSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIExpdmVOb2RlTGlzdCBldmVudFxuXHRcdFx0ICpcblx0XHRcdCAqIEV2ZW50IGNhbGxlZCB3aGVuIG5ldyBlbGVtZW50cyBhcmUgYWRkZWQgdG8gb3IgcmVtb3ZlZCBmcm9tIHRoZSBkb21cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGUgZXZlbnQgbGlzdGVuZXJzIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggb25lIGFyZ3VtZW50OiBhbiBhcnJheSBjb250YWluaW5nIGFsbCBlbGVtZW50cyBjdXJyZW50bHkgaW4gdGhlIGxpc3Rcblx0XHRcdCAqXG5cdFx0XHQgKiBAZXhhbXBsZVxuXHRcdFx0ICogbm9kZUxpc3Qub24oJ2NoYW5nZWQnLCBmdW5jdGlvbihjdXJyZW50RWxlbWVudHMpe1xuXHRcdFx0ICogICBjb25zb2xlLmxvZyhjdXJyZW50RWxlbWVudHMpO1xuXHRcdFx0ICogfSk7XG5cdFx0XHQgKlxuXHRcdFx0ICogQGV2ZW50IG1vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3QjY2hhbmdlZFxuXHRcdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudFtdfSBjdXJyZW50RWxlbWVudHMgY3VycmVudCBlbGVtZW50cy4gVGhlc2UgYXJlIHRoZSBzYW1lIGFzIGluIHRoZSBgTGl2ZU5vZGVMaXN0YCwgYnV0IGluIGFcblx0XHRcdCAqIG5hdGl2ZSBhcnJheVxuXHRcdFx0ICovXG5cdFx0XHR0aGlzLl9idWJibGUoY29uc3RhbnRzLkNVU1RPTV9FVkVOVF9PTl9FTEVNRU5UU19DSEFOR0VELCBjdXJyZW50RWxlbWVudHMpO1xuXHRcdH1cblx0XHRpZiAod2FzQWRkZWQpIHtcblx0XHRcdC8qKlxuXHRcdFx0ICogTGl2ZU5vZGVMaXN0IGV2ZW50XG5cdFx0XHQgKiBFdmVudCBjYWxsZWQgd2hlbiBuZXcgZWxlbWVudHMgYXJlIGFkZGVkIHRvIHRoZSBkb21cblx0XHRcdCAqXG5cdFx0XHQgKiBUaGUgZXZlbnQgbGlzdGVuZXJzIGNhbGxiYWNrIHdpbGwgYmUgY2FsbGVkIHdpdGggb25lIGFyZ3VtZW50OiBhbiBhcnJheSBjb250YWluaW5nIHRoZSBuZXdseSBmb3VuZCBkb20gZWxlbWVudHNcblx0XHRcdCAqXG5cdFx0XHQgKiBAZXhhbXBsZVxuXHRcdFx0ICogbm9kZUxpc3Qub24oJ2FkZGVkJywgZnVuY3Rpb24obmV3RWxlbWVudHMpe1xuXHRcdFx0ICogICBjb25zb2xlLmxvZyhuZXdFbGVtZW50cyk7XG5cdFx0XHQgKiB9KTtcblx0XHRcdCAqXG5cdFx0XHQgKiBAZXZlbnQgbW9kdWxlOndhdGNoZWQvTGl2ZU5vZGVMaXN0fkxpdmVOb2RlTGlzdCNhZGRlZFxuXHRcdFx0ICogQHBhcmFtIHtIVE1MRWxlbWVudFtdfSBhZGRlZEVsZW1lbnRzIHRoZSBhZGRlZCBlbGVtZW50c1xuXHRcdFx0ICovXG5cdFx0XHR0aGlzLl9idWJibGUoY29uc3RhbnRzLkNVU1RPTV9FVkVOVF9PTl9FTEVNRU5UU19BRERFRCwgYWRkZWRFbGVtZW50cyk7XG5cdFx0fVxuXHRcdGlmICh3YXNSZW1vdmVkKSB7XG5cdFx0XHQvKipcblx0XHRcdCAqIExpdmVOb2RlTGlzdCBldmVudFxuXHRcdFx0ICogRXZlbnQgY2FsbGVkIHdoZW4gZWxlbWVudHMgYXJlIHJlbW92ZWQgZnJvbSB0aGUgZG9tXG5cdFx0XHQgKlxuXHRcdFx0ICogVGhlIGV2ZW50IGxpc3RlbmVycyBjYWxsYmFjayB3aWxsIGJlIGNhbGxlZCB3aXRoIG9uZSBhcmd1bWVudDogYW4gYXJyYXkgYHJlbW92ZWRFbGVtZW50c2AgY29udGFpbmluZyB0aGUgZG9tIGVsZW1lbnRzIHJlbW92ZWQgZnJvbSB0aGUgbGlzdCAocmVtb3ZlZCBmcm9tIHRoZSBkb20pXG5cdFx0XHQgKlxuXHRcdFx0ICogQGV4YW1wbGVcblx0XHRcdCAqIG5vZGVMaXN0Lm9uKCdyZW1vdmVkJywgZnVuY3Rpb24ocmVtb3ZlZEVsZW1lbnRzKXtcblx0XHRcdCAqICAgY29uc29sZS5sb2cocmVtb3ZlZEVsZW1lbnRzKTtcblx0XHRcdCAqIH0pO1xuXHRcdFx0ICpcblx0XHRcdCAqIEBldmVudCBtb2R1bGU6d2F0Y2hlZC9MaXZlTm9kZUxpc3R+TGl2ZU5vZGVMaXN0I3JlbW92ZWRcblx0XHRcdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnRbXX0gcmVtb3ZlZEVsZW1lbnRzIGVsZW1lbnRzIHJlbW92ZWQgZnJvbSB0aGUgYExpdmVOb2RlTGlzdGBcblx0XHRcdCAqL1xuXHRcdFx0dGhpcy5fYnViYmxlKGNvbnN0YW50cy5DVVNUT01fRVZFTlRfT05fRUxFTUVOVFNfUkVNT1ZFRCwgcmVtb3ZlZEVsZW1lbnRzKTtcblx0XHR9XG5cblx0fSxcblx0X3VwZGF0ZUFycmF5OiBmdW5jdGlvbiAoY3VycmVudEVsZW1lbnRzKSB7XG5cdFx0dGhpcy5fZGVsZXRlQXJyYXkoKTtcblx0XHR0aGlzLl9sZW5ndGggPSBjdXJyZW50RWxlbWVudHMubGVuZ3RoO1xuXHRcdGN1cnJlbnRFbGVtZW50cy5mb3JFYWNoKGZ1bmN0aW9uIChlbCwgaW5kZXgpIHtcblx0XHRcdHRoaXNbaW5kZXhdID0gZWw7XG5cdFx0fSwgdGhpcyk7XG5cdH0sXG5cdF9kZWxldGVBcnJheTogZnVuY3Rpb24gKCkge1xuXHRcdEFycmF5LnByb3RvdHlwZS5zcGxpY2UuY2FsbCh0aGlzLCAwKTtcblx0XHR0aGlzLl9sZW5ndGggPSAwO1xuXHR9LFxuXHRfYnViYmxlOiBmdW5jdGlvbiAoZXZlbnRUeXBlLCBlbGVtZW50TGlzdCkge1xuXHRcdHRoaXMuZW1pdChldmVudFR5cGUsIGVsZW1lbnRMaXN0KTtcblx0fSxcblxuXHQvKipcblx0ICogc2VlIHRoZSBuYXRpdmUgW2BBcnJheS5mb3JFYWNoYF0oaHR0cDovL2RldmRvY3MuaW8vamF2YXNjcmlwdC9nbG9iYWxfb2JqZWN0cy9hcnJheS9mb3JlYWNoKSBmb3IgZGV0YWlscy5cblx0ICpcblx0ICpcblx0ICogQGV4YW1wbGVcblx0ICogbm9kZUxpc3QuZm9yRWFjaChmdW5jdGlvbihlbGVtZW50KXtcblx0ICogICBlbGVtZW50LnN0eWxlLmNvbG9yID0gXCJncmVlblwiO1xuXHQgKiB9KTtcblx0ICpcblx0ICogQHBhcmFtIHtGdW5jdGlvbn0gY2FsbGJhY2tcblx0ICogQHBhcmFtIHtPYmplY3R9IFt0aGlzQXJnXSBvcHRpb25hbCBjb250ZXh0IG9iamVjdFxuXHQgKlxuXHQgKiBAaW5zdGFuY2Vcblx0ICogKi9cblx0Zm9yRWFjaDogZnVuY3Rpb24gKGNhbGxiYWNrLCB0aGlzQXJnKSB7XG5cdFx0QXJyYXkucHJvdG90eXBlLmZvckVhY2guYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0fSxcblxuXHQvKipcblx0ICogRnJlZXplcyB0aGUgbm9kZWxpc3QgaW4gaXQncyBjdXJyZW50IGZvcm0gYW5kIHBhdXNlcyB0aGUgZG9tIG11dGF0aW9uIGxpc3RlbmVyXG5cdCAqXG5cdCAqIEBpbnN0YW5jZVxuXHQgKiBAZXhhbXBsZVxuXHQgKiBub2RlTGlzdC5wYXVzZSgpO1xuXHQgKi9cblx0cGF1c2U6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9pc0FjdGl2ZSA9IGZhbHNlO1xuXHRcdG11dGF0aW9uT2JzZXJ2ZXIub2ZmKGNvbnN0YW50cy5DVVNUT01fRVZFTlRfT05fTVVUQVRJT04sIHRoaXMuX29uTXV0YXRlSGFuZGxlcik7XG5cdH0sXG5cblx0LyoqXG5cdCAqIFJlc3VtZSB0aGUgcXVlcnkgYW5kIGxpc3RlbiB0byBkb20gbXV0YXRpb25zIGFnYWluLlxuXHQgKiBDcmVhdGluZyBhIExpdmVOb2RlTGlzdCB3aWxsIGRvIHRoYXQgaW5pdGlhbGx5IGZvciB5b3UuXG5cdCAqXG5cdCAqIEBleGFtcGxlXG5cdCAqIG5vZGVsaXN0LnJlc3VtZSgpO1xuXHQgKlxuXHQgKiBAaW5zdGFuY2Vcblx0ICovXG5cdHJlc3VtZTogZnVuY3Rpb24gKCkge1xuXHRcdGlmICghdGhpcy5faXNBY3RpdmUpIHtcblx0XHRcdHRoaXMuX2lzQWN0aXZlID0gdHJ1ZTtcblx0XHRcdHRoaXMuX3VwZGF0ZUFycmF5KHRoaXMuX3F1ZXJ5LmN1cnJlbnQoKSk7XG5cdFx0XHRtdXRhdGlvbk9ic2VydmVyLm9uKGNvbnN0YW50cy5DVVNUT01fRVZFTlRfT05fTVVUQVRJT04sIHRoaXMuX29uTXV0YXRlSGFuZGxlcik7XG5cdFx0fVxuXHR9XG59O1xuXG4vKipcbiAqIFRoZSBsZW5ndGggb2YgdGhlIG5vZGUgbGlzdC5cbiAqXG4gKiAqeW91IGNhbid0IHNldCB0aGUgbGVuZ3RoLCBzbyB0cmlja3Mga25vd24gdG8gd29yayB3aXRoIHRoZSBuYXRpdmUgYXJyYXkgd29uJ3QgaGF2ZSBhbnkgZWZmZWN0IGhlcmUqXG4gKlxuICogQG1lbWJlciBsZW5ndGhcbiAqIEBtZW1iZXJvZiBtb2R1bGU6d2F0Y2hlZC9MaXZlTm9kZUxpc3R+TGl2ZU5vZGVMaXN0XG4gKiBAdHlwZSB7bnVtYmVyfVxuICogQGluc3RhbmNlXG4gKi9cblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KExpdmVOb2RlTGlzdCwgJ2xlbmd0aCcsIHtcblx0Z2V0OiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2xlbmd0aDtcblx0fSxcblx0c2V0OiBmdW5jdGlvbiAoLypsZW5ndGgqLykge1xuXHRcdC8vIERvbid0IGRlbGV0ZSB0aGlzIG9uZS4gYEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMsIDApYCBtYXkgY2FsbCB0aGlzIHNldHRlclxuXHR9XG59KTtcblxuLyoqXG4gKiBBZGQgYW4gZXZlbnQgbGlzdGVuZXIgdG8gdGhlIExpdmVOb2RlTGlzdFxuICpcbiAqIEBmdW5jdGlvbiBvblxuICogQG1lbWJlcm9mIG1vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBoYW5kbGVyIGEgY2FsbGJhY2sgZnVuY3Rpb25cbiAqIEBpbnN0YW5jZVxuICovXG5cbi8qKlxuICogQWRkIGFuIGV2ZW50IGxpc3RlbmVyIHRvIHRoZSBMaXZlTm9kZUxpc3QgdGhhdCB3aWxsIG9ubHkgYmUgY2FsbGVkICoqb25jZSoqXG4gKlxuICogQGZ1bmN0aW9uIG9uY2VcbiAqIEBtZW1iZXJvZiBtb2R1bGU6d2F0Y2hlZC9MaXZlTm9kZUxpc3R+TGl2ZU5vZGVMaXN0XG4gKiBAcGFyYW0ge3N0cmluZ30gZXZlbnROYW1lIFRoZSBuYW1lIG9mIHRoZSBldmVudFxuICogQHBhcmFtIHtmdW5jdGlvbn0gaGFuZGxlciBhIGNhbGxiYWNrIGZ1bmN0aW9uXG4gKiBAaW5zdGFuY2VcbiAqL1xuXG4vKipcbiAqIFJlbW92ZXMgYW4gZXZlbnQgbGlzdGVuZXIgZnJvbSB0aGUgTGl2ZU5vZGVMaXN0XG4gKlxuICogQGZ1bmN0aW9uIG9mZlxuICogQG1lbWJlcm9mIG1vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBbaGFuZGxlcl0gYSBjYWxsYmFjayBmdW5jdGlvblxuICogQGluc3RhbmNlXG4gKi9cblxuLyoqXG4gKiBFbWl0IGFuIGV2ZW50LlxuICpcbiAqIE5vcm1hbGx5IHlvdSBkb24ndCBkbyB0aGF0LCBidXQgaXQncyBwYXJ0IG9mIHRoZSBgTGl2ZU5vZGVMaXN0YCdzIHByb3RvdHlwZSwgc28gaXQncyBkb2N1bWVudGVkIGhlcmVcbiAqXG4gKiBAZnVuY3Rpb24gZW1pdFxuICogQG1lbWJlcm9mIG1vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3RcbiAqIEBwYXJhbSB7c3RyaW5nfSBldmVudE5hbWUgVGhlIG5hbWUgb2YgdGhlIGV2ZW50XG4gKiBAcGFyYW0gey4uLip9IGV2ZW50RGF0YSBldmVudCBkYXRhIHBhc3NlZCBpbnRvIHRoZSBldmVudCBjYWxsYmFja3NcbiAqIEBpbnN0YW5jZVxuICovXG5cbnNtb2tlc2lnbmFscy5jb252ZXJ0KExpdmVOb2RlTGlzdCk7XG5cbi8qKlxuICogZmFjdG9yeSBtZXRob2QgdG8gY3JlYXRlIG5ldyBgTGl2ZU5vZGVMaXN0YCBvYmplY3RzXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gcXVlcnlTdHJhdGVneSBhIHF1ZXJ5IGNyZWF0ZWQgd2l0aCB7QGxpbmsgbW9kdWxlOmRvbVF1ZXJpZXMvUXVlcnlTdHJhdGVneUZhY3RvcnkuY3JlYXRlfVxuICogQHJldHVybnMge21vZHVsZTp3YXRjaGVkL0xpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3R9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKHF1ZXJ5U3RyYXRlZ3kpIHtcblx0aWYgKHRoaXMgaW5zdGFuY2VvZiBtb2R1bGUuZXhwb3J0cykge1xuXHRcdHRocm93IG5ldyBFcnJvcignVGhlIExpdmVOb2RlTGlzdCBpcyBhIGZhY3RvcnkgZnVuY3Rpb24sIG5vdCBhIGNvbnN0cnVjdG9yLiBEb25cXCd0IHVzZSB0aGUgbmV3IGtleXdvcmQgd2l0aCBpdCcpO1xuXHR9XG5cblx0dmFyIHF1ZXJ5ID0gT2JqZWN0LmNyZWF0ZShEb21RdWVyeSksXG5cdFx0bm9kZUxpc3QgPSBPYmplY3QuY3JlYXRlKExpdmVOb2RlTGlzdCk7XG5cblx0cXVlcnkuaW5pdChxdWVyeVN0cmF0ZWd5KTtcblx0bm9kZUxpc3QuaW5pdChxdWVyeSk7XG5cdHJldHVybiBub2RlTGlzdDtcbn07XG5cblxuIiwidmFyIGhlbHBlciA9IHJlcXVpcmUoJy4uL3V0aWwvaGVscGVyJyk7XG5cbi8qKlxuICogQSBEb21RdWVyeSwgdXNlZCB0byBzdG9yZSBvbGQgYW5kIG5ldyBub2RlIGxpc3RzLlxuICpcbiAqIEBtb2R1bGUgd2F0Y2hlZC9Eb21RdWVyaWVzL0RvbVF1ZXJ5XG4gKi9cblxuLyoqXG4gKiBUaGUgb2JqZWN0IHVzZWQgdG8gY3JlYXRlIG5ldyBEb21RdWVyaWVzXG4gKi9cbm1vZHVsZS5leHBvcnRzID0ge1xuXHQvKipcblx0ICogSW5pdGlhbGl6ZSB0aGUgRG9tUXVlcnlcblx0ICpcblx0ICogQHBhcmFtIHttb2R1bGU6d2F0Y2hlZC9kb21RdWVyaWVzL1F1ZXJ5U3RyYXRlZ3lGYWN0b3J5flN0cmF0ZWdpZXN9IHN0cmF0ZWd5XG5cdCAqL1xuXHRpbml0OiBmdW5jdGlvbiAoc3RyYXRlZ3kpIHtcblx0XHR0aGlzLl9xdWVyeSA9IHN0cmF0ZWd5O1xuXHRcdHRoaXMuX29sZCA9IFtdO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBsYXN0IHF1ZXJ5IHJlc3VsdFxuXHQgKiBAcmV0dXJucyB7QXJyYXkuPEhUTUxFbGVtZW50Pn1cblx0ICovXG5cdG9sZDogZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBoZWxwZXIuYXJyYXlDbG9uZSh0aGlzLl9vbGQpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHF1ZXJ5IHJlc3VsdC5cblx0ICpcblx0ICogVGhpcyB3aWxsIG92ZXJ3cml0ZSB0aGUgb2xkIHF1ZXJ5LlxuXHQgKiBAcmV0dXJucyB7QXJyYXkuPEhUTUxFbGVtZW50Pn1cblx0ICovXG5cdGN1cnJlbnQ6IGZ1bmN0aW9uICgpIHtcblx0XHR0aGlzLl9vbGQgPSB0aGlzLl9xdWVyeSgpO1xuXHRcdHJldHVybiBoZWxwZXIuYXJyYXlDbG9uZSh0aGlzLl9vbGQpO1xuXHR9XG59OyIsIi8qKlxuICogQG1vZHVsZSB3YXRjaGVkL2RvbVF1ZXJpZXMvUXVlcnlTdHJhdGVneUZhY3RvcnlcbiAqL1xuXG5cbnZhciBjb25zdGFudHMgPSByZXF1aXJlKCcuLi91dGlsL2NvbnN0YW50cycpLFxuXHRoZWxwZXIgPSByZXF1aXJlKCcuLi91dGlsL2hlbHBlcicpLFxuXHQvKipcblx0ICogQG5hbWVzcGFjZSBtb2R1bGU6d2F0Y2hlZC9kb21RdWVyaWVzL1F1ZXJ5U3RyYXRlZ3lGYWN0b3J5flN0cmF0ZWdpZXNcblx0ICovXG5cdFN0cmF0ZWdpZXMgPSB7fTtcblxuXG52YXIgZmlsdGVyTm9kZXNJbkRvY3VtZW50ID0gZnVuY3Rpb24gKG5vZGVBcnJheSkge1xuXHRyZXR1cm4gbm9kZUFycmF5LmZpbHRlcihmdW5jdGlvbiAobm9kZSkge1xuXHRcdHJldHVybiBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuY29udGFpbnMobm9kZSk7XG5cdH0pO1xufTtcblxuLyoqXG4gKiBgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsYCBzdHJhdGVneVxuICpcbiAqIEBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yQWxsXG4gKiBAbWVtYmVyb2YgbW9kdWxlOndhdGNoZWQvZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeX5TdHJhdGVnaWVzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gd3JhcHBlZCB2ZXJzaW9uIG9mIGBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoc2VsZWN0b3IpYFxuICovXG5TdHJhdGVnaWVzW2NvbnN0YW50cy5xdWVyaWVzLlFVRVJZX1NFTEVDVE9SX0FMTF0gPSBmdW5jdGlvbiAoZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHR2YXIgbm9kZUxpc3QgPSBlbGVtZW50W2NvbnN0YW50cy5xdWVyaWVzLlFVRVJZX1NFTEVDVE9SX0FMTF0oc2VsZWN0b3IpO1xuXHRcdHJldHVybiBmaWx0ZXJOb2Rlc0luRG9jdW1lbnQoaGVscGVyLm5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkpO1xuXHR9O1xufTtcblxuLyoqXG4gKiBgZWxlbWVudC5xdWVyeVNlbGVjdG9yYCBzdHJhdGVneVxuICpcbiAqIEBmdW5jdGlvbiBxdWVyeVNlbGVjdG9yXG4gKiBAbWVtYmVyb2YgbW9kdWxlOndhdGNoZWQvZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeX5TdHJhdGVnaWVzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gc2VsZWN0b3JcbiAqIEByZXR1cm5zIHtGdW5jdGlvbn0gd3JhcHBlZCB2ZXJzaW9uIG9mIGBlbGVtZW50LnF1ZXJ5U2VsZWN0b3Ioc2VsZWN0b3IpYFxuICovXG5TdHJhdGVnaWVzW2NvbnN0YW50cy5xdWVyaWVzLlFVRVJZX1NFTEVDVE9SXSA9IGZ1bmN0aW9uIChlbGVtZW50LCBzZWxlY3Rvcikge1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdHZhciBub2RlID0gZWxlbWVudFtjb25zdGFudHMucXVlcmllcy5RVUVSWV9TRUxFQ1RPUl0oc2VsZWN0b3IpO1xuXHRcdHJldHVybiBmaWx0ZXJOb2Rlc0luRG9jdW1lbnQobm9kZSA9PT0gbnVsbCA/IFtdIDogW25vZGVdKTtcblx0fTtcbn07XG5cbi8qKlxuICogYGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWVgIHN0cmF0ZWd5XG4gKlxuICogQGZ1bmN0aW9uIGdldEVsZW1lbnRzQnlUYWdOYW1lXG4gKiBAbWVtYmVyb2YgbW9kdWxlOndhdGNoZWQvZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeX5TdHJhdGVnaWVzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gdGFnTmFtZVxuICogQHJldHVybnMge0Z1bmN0aW9ufSB3cmFwcGVkIHZlcnNpb24gb2YgYGVsZW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUodGFnTmFtZSlgXG4gKi9cblN0cmF0ZWdpZXNbY29uc3RhbnRzLnF1ZXJpZXMuR0VUX0VMRU1FTlRTX0JZX1RBR19OQU1FXSA9IGZ1bmN0aW9uIChlbGVtZW50LCB0YWdOYW1lKSB7XG5cdC8vIGEgbGl2ZSBsaXN0LCBoYXMgdG8gYmUgY2FsbGVkIG9uY2UsIG9ubHlcblx0dmFyIG5vZGVMaXN0ID0gZWxlbWVudFtjb25zdGFudHMucXVlcmllcy5HRVRfRUxFTUVOVFNfQllfVEFHX05BTUVdKHRhZ05hbWUpO1xuXHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdHJldHVybiBmaWx0ZXJOb2Rlc0luRG9jdW1lbnQoaGVscGVyLm5vZGVMaXN0VG9BcnJheShub2RlTGlzdCkpO1xuXHR9O1xufTtcblxuLyoqXG4gKiBgZWxlbWVudC5nZXRFbGVtZW50c0J5Q2xhc3NOYW1lYCBzdHJhdGVneVxuICpcbiAqIEBmdW5jdGlvbiBnZXRFbGVtZW50c0J5Q2xhc3NOYW1lXG4gKiBAbWVtYmVyb2YgbW9kdWxlOndhdGNoZWQvZG9tUXVlcmllcy9RdWVyeVN0cmF0ZWd5RmFjdG9yeX5TdHJhdGVnaWVzXG4gKiBAcGFyYW0ge0hUTUxFbGVtZW50fSBlbGVtZW50XG4gKiBAcGFyYW0ge1N0cmluZ30gY2xhc3NOYW1lXG4gKiBAcmV0dXJucyB7RnVuY3Rpb259IHdyYXBwZWQgdmVyc2lvbiBvZiBgZWxlbWVudC5xdWVyeVNlbGVjdG9yQWxsKGNsYXNzTmFtZSlgXG4gKi9cblN0cmF0ZWdpZXNbY29uc3RhbnRzLnF1ZXJpZXMuR0VUX0VMRU1FTlRTX0JZX0NMQVNTX05BTUVdID0gZnVuY3Rpb24gKGVsZW1lbnQsIGNsYXNzTmFtZSkge1xuXHQvLyBhIGxpdmUgbGlzdCwgaGFzIHRvIGJlIGNhbGxlZCBvbmNlLCBvbmx5XG5cdHZhciBub2RlTGlzdCA9IGVsZW1lbnRbY29uc3RhbnRzLnF1ZXJpZXMuR0VUX0VMRU1FTlRTX0JZX0NMQVNTX05BTUVdKGNsYXNzTmFtZSk7XG5cdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0cmV0dXJuIGZpbHRlck5vZGVzSW5Eb2N1bWVudChoZWxwZXIubm9kZUxpc3RUb0FycmF5KG5vZGVMaXN0KSk7XG5cdH07XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblxuXHQvKipcblx0ICogQ3JlYXRlIGEgcXVlcnkgZnVuY3Rpb24gdXNlZCB3aXRoIGEgZG9tIGVsZW1lbnRcblx0ICpcblx0ICogQGV4YW1wbGVcblx0ICogdmFyIHF1ZXJ5ID0gUXVlcnlTdHJhdGVneUZhY3RvcnkuY3JlYXRlKCdxdWVyeVNlbGVjdG9yQWxsJywgZG9jdW1lbnQsICcuZm9vJyk7XG5cdCAqIHF1ZXJ5KCk7IC8vIFtlbDEsIGVsMiwgLi4uXVxuXHQgKlxuXHQgKiBAcGFyYW0ge1N0cmluZ30gc3RyYXRlZ3lUeXBlIHRoZSBxdWVyeSB0eXBlXG5cdCAqIEBwYXJhbSB7SFRNTEVsZW1lbnR9IGVsZW1lbnRcblx0ICogQHBhcmFtIHtTdHJpbmd9IHNlbGVjdG9yXG5cdCAqIEByZXR1cm5zIHtGdW5jdGlvbn0gYSB3cmFwcGVkIHF1ZXJ5IGZ1bmN0aW9uIGZvciB0aGUgZG9tIGVsZW1lbnQgYGVsZW1lbnRgLCBxdWVyeSBgc3RyYXRlZ3lUeXBlYCBhbmQgdGhlIHNlbGVjdG9yXG5cdCAqIGBzZWxlY3RvcmBcblx0ICovXG5cdGNyZWF0ZTogZnVuY3Rpb24gKHN0cmF0ZWd5VHlwZSwgZWxlbWVudCwgc2VsZWN0b3IpIHtcblx0XHQvL2NvbnNvbGUudGltZShcInF1ZXJ5XCIpO1xuXHRcdC8vY29uc29sZS5sb2coXCJleGVjdXRpbmcgcXVlcnk6IFwiLCBzdHJhdGVneVR5cGUgKyBcIihcIitzZWxlY3RvcitcIilcIik7XG5cdFx0Ly92YXIgcmVzdWx0ID0gU3RyYXRlZ2llc1tzdHJhdGVneVR5cGVdKGVsZW1lbnQsIHNlbGVjdG9yKTtcblx0XHQvL2NvbnNvbGUudGltZUVuZChcInF1ZXJ5XCIpO1xuXHRcdC8vcmV0dXJuIHJlc3VsdDtcblx0XHRyZXR1cm4gU3RyYXRlZ2llc1tzdHJhdGVneVR5cGVdKGVsZW1lbnQsIHNlbGVjdG9yKTtcblx0fVxufTsiLCJ2YXIgc21va2VzaWduYWxzID0gcmVxdWlyZSgnc21va2VzaWduYWxzJyksXG5cdFx0aGVscGVyICAgICAgID0gcmVxdWlyZSgnLi4vdXRpbC9oZWxwZXInKSxcblx0XHRjb25zdGFudHMgICAgPSByZXF1aXJlKCcuLi91dGlsL2NvbnN0YW50cycpO1xuXG4vKipcbiAqIERvbU9ic2VydmVyIHVzaW5nIGEgdGltZW91dC4gVXNlZCBpZiB0aGUgbmF0aXZlIE9ic2VydmVyIGlzIG5vdCBhdmFpbGFibGVcbiAqXG4gKiBAbW9kdWxlIHdhdGNoZWQvb2JzZXJ2ZXJzL0ludGVydmFsT2JzZXJ2ZXJcbiAqL1xuXG52YXIgYWxsRWxlbWVudHNMaXZlID0gZG9jdW1lbnQuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJyonKSxcblx0XHRnZXRBbGxBc0FycmF5ICAgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRyZXR1cm4gaGVscGVyLm5vZGVMaXN0VG9BcnJheShhbGxFbGVtZW50c0xpdmUpO1xuXHRcdH0sXG5cdFx0aGFzQ2hhbmdlZCAgICAgID0gZnVuY3Rpb24gKG9sZEVsZW1lbnRzLCBuZXdFbGVtZW50cykge1xuXHRcdFx0aWYgKG9sZEVsZW1lbnRzLmxlbmd0aCAhPT0gbmV3RWxlbWVudHMubGVuZ3RoKSB7XG5cdFx0XHRcdHJldHVybiB0cnVlO1xuXHRcdFx0fVxuXG5cdFx0XHQvLyBjaGVjayBpZiB0aGUgYXJyYXlzIGNvbnRhaW5cblx0XHRcdHJldHVybiBvbGRFbGVtZW50cy5zb21lKGZ1bmN0aW9uIChlbGVtZW50LCBpbmRleCkge1xuXHRcdFx0XHRyZXR1cm4gZWxlbWVudCAhPT0gbmV3RWxlbWVudHNbaW5kZXhdO1xuXHRcdFx0fSk7XG5cdFx0fTtcblxuXG52YXIgSW50ZXJ2YWxPYnNlcnZlciA9IHtcblx0aW5pdDogZnVuY3Rpb24gKCkge1xuXHRcdHRoaXMuX2N1cnJlbnRFbGVtZW50cyA9IGdldEFsbEFzQXJyYXkoKTtcblx0XHR0aGlzLl9pbml0aWFsaXplKCk7XG5cdH0sXG5cdF9pbml0aWFsaXplOiBmdW5jdGlvbiAoKSB7XG5cdFx0dmFyIF90aGlzID0gdGhpcyxcblx0XHRcdFx0c3RhcnQgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0c2V0VGltZW91dCh0aWNrLCBjb25zdGFudHMuSU5URVJWQUxfT0JTRVJWRVJfUkVTQ0FOX0lOVEVSVkFMKTtcblx0XHRcdFx0fSxcblx0XHRcdFx0dGljayAgPSBmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdFx0X3RoaXMuX2NoZWNrRG9tKCk7XG5cdFx0XHRcdFx0c3RhcnQoKTtcblx0XHRcdFx0fTtcblxuXHRcdHN0YXJ0KCk7XG5cdH0sXG5cdF9jaGVja0RvbTogZnVuY3Rpb24gKCkge1xuXHRcdHZhciBuZXdFbGVtZW50cyA9IGdldEFsbEFzQXJyYXkoKTtcblx0XHRpZiAoaGFzQ2hhbmdlZCh0aGlzLl9jdXJyZW50RWxlbWVudHMsIG5ld0VsZW1lbnRzKSkge1xuXHRcdFx0dGhpcy5fY3VycmVudEVsZW1lbnRzID0gbmV3RWxlbWVudHM7XG5cdFx0XHR0aGlzLmVtaXQoY29uc3RhbnRzLkNVU1RPTV9FVkVOVF9PTl9NVVRBVElPTik7XG5cdFx0fVxuXG5cdH1cbn07XG5cbnNtb2tlc2lnbmFscy5jb252ZXJ0KEludGVydmFsT2JzZXJ2ZXIpO1xuXG5cbm1vZHVsZS5leHBvcnRzID0gSW50ZXJ2YWxPYnNlcnZlcjtcbiIsIi8qKlxuICogTmF0aXZlIGRvbSBvYnNlcnZlciB1c2luZyB7QGxpbmsgZXh0ZXJuYWw6TXV0YXRpb25PYnNlcnZlcn1cbiAqXG4gKiBAbW9kdWxlIHdhdGNoZWQvb2JzZXJ2ZXJzL05hdGl2ZU9ic2VydmVyXG4gKi9cblxudmFyIHNtb2tlc2lnbmFscyAgICAgID0gcmVxdWlyZSgnc21va2VzaWduYWxzJyksXG5cdFx0aGVscGVyID0gcmVxdWlyZSgnLi4vdXRpbC9oZWxwZXInKSxcblx0XHRjb25zdGFudHMgPSByZXF1aXJlKCcuLi91dGlsL2NvbnN0YW50cycpLFxuXHRcdG9wdHMgICAgICAgICAgICAgID0ge1xuXHRcdFx0Y2hpbGRMaXN0OiB0cnVlLFxuXHRcdFx0c3VidHJlZTogdHJ1ZVxuXHRcdH0sXG5cdFx0aXNFbGVtZW50TXV0YXRpb24gPSBmdW5jdGlvbiAobXV0YXRpb24pIHtcblx0XHRcdHJldHVybiBtdXRhdGlvbi5hZGRlZE5vZGVzICE9PSBudWxsIHx8IG11dGF0aW9uLnJlbW92ZWROb2RlcyAhPT0gbnVsbDtcblx0XHR9O1xuXG52YXIgTmF0aXZlT2JzZXJ2ZXIgPSB7XG5cblx0aW5pdDogZnVuY3Rpb24oKXtcblx0XHR0aGlzLl9vYnNlcnZlciA9IG5ldyBoZWxwZXIuTmF0aXZlTXV0YXRpb25PYnNlcnZlcih0aGlzLl9vbk11dGF0aW9uLmJpbmQodGhpcykpO1xuXHRcdHRoaXMuX29ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQsIG9wdHMpO1xuXHR9LFxuXG5cdF9vbk11dGF0aW9uOiBoZWxwZXIuZGVib3VuY2UoZnVuY3Rpb24gKG11dGF0aW9ucykge1xuXHRcdFx0aWYgKG11dGF0aW9ucy5zb21lKGlzRWxlbWVudE11dGF0aW9uLCB0aGlzKSkge1xuXHRcdFx0XHR0aGlzLmVtaXQoY29uc3RhbnRzLkNVU1RPTV9FVkVOVF9PTl9NVVRBVElPTik7XG5cdFx0XHR9XG5cdFx0fSwgY29uc3RhbnRzLk1VVEFUSU9OX0RFQk9VTkNFX0RFTEFZKVxufTtcblxuc21va2VzaWduYWxzLmNvbnZlcnQoTmF0aXZlT2JzZXJ2ZXIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IE5hdGl2ZU9ic2VydmVyOyIsIi8qKlxuICogQ29uc3RhbnRzIHVzZWQgdGhyb3VnaG91dCB0aGUgbGlicmFyeVxuICpcbiAqIEBtb2R1bGUgd2F0Y2hlZC91dGlsL2NvbnN0YW50c1xuICovXG5cbnZhciBjb25zdGFudHMgPSB7XG5cblx0TVVUQVRJT05fREVCT1VOQ0VfREVMQVkgOiAyMCwvLyBidWJibGUgZG9tIGNoYW5nZXMgaW4gYmF0Y2hlcy5cblx0SU5URVJWQUxfT0JTRVJWRVJfUkVTQ0FOX0lOVEVSVkFMIDogNTAwLFxuXHRDVVNUT01fRVZFTlRfT05fTVVUQVRJT04gOiAnQ1VTVE9NX0VWRU5UX09OX01VVEFUSU9OJyxcblx0Q1VTVE9NX0VWRU5UX09OX0VMRU1FTlRTX0FEREVEIDogJ2FkZGVkJyxcblx0Q1VTVE9NX0VWRU5UX09OX0VMRU1FTlRTX1JFTU9WRUQgOiAncmVtb3ZlZCcsXG5cdENVU1RPTV9FVkVOVF9PTl9FTEVNRU5UU19DSEFOR0VEIDogJ2NoYW5nZWQnLFxuXHRBVkFJTEFCTEVfUVVFUklFUzogW10sXG5cdHF1ZXJpZXM6IHtcblx0XHRRVUVSWV9TRUxFQ1RPUl9BTEwgOiAncXVlcnlTZWxlY3RvckFsbCcsXG5cdFx0UVVFUllfU0VMRUNUT1IgOiAncXVlcnlTZWxlY3RvcicsXG5cdFx0R0VUX0VMRU1FTlRTX0JZX1RBR19OQU1FIDogJ2dldEVsZW1lbnRzQnlUYWdOYW1lJyxcblx0XHRHRVRfRUxFTUVOVFNfQllfQ0xBU1NfTkFNRSA6ICdnZXRFbGVtZW50c0J5Q2xhc3NOYW1lJ1xuXHR9XG5cbn07XG5cbi8vY29uc3RhbnRzLnF1ZXJpZXNcbk9iamVjdC5rZXlzKGNvbnN0YW50cy5xdWVyaWVzKS5mb3JFYWNoKGZ1bmN0aW9uKGluZGV4KXtcblx0Y29uc3RhbnRzLkFWQUlMQUJMRV9RVUVSSUVTLnB1c2goY29uc3RhbnRzLnF1ZXJpZXNbaW5kZXhdKTtcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGNvbnN0YW50czsiLCJ2YXIgY29uc3RhbnRzID0gcmVxdWlyZSgnLi9jb25zdGFudHMnKTtcblxudmFyIElOREVYX09GX0ZBSUwgPSAtMTtcblxudmFyIGhhc011dGF0aW9uT2JzZXJ2ZXIgPSAhISh3aW5kb3cuTXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuV2ViS2l0TXV0YXRpb25PYnNlcnZlciB8fCB3aW5kb3cuTW96TXV0YXRpb25PYnNlcnZlciksXG5cdE5hdGl2ZU11dGF0aW9uT2JzZXJ2ZXIgPSBoYXNNdXRhdGlvbk9ic2VydmVyID8gTXV0YXRpb25PYnNlcnZlciB8fCBXZWJLaXRNdXRhdGlvbk9ic2VydmVyIHx8IE1vek11dGF0aW9uT2JzZXJ2ZXIgOiBudWxsO1xuXG4vKipcbiAqIEBleHRlcm5hbCB7TXV0YXRpb25PYnNlcnZlcn1cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL011dGF0aW9uT2JzZXJ2ZXJcbiAqL1xuXG4vKipcbiAqIEBleHRlcm5hbCB7SFRNTEVsZW1lbnR9XG4gKiBAc2VlIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9IVE1MRWxlbWVudFxuICovXG5cbi8qKlxuICogQGV4dGVybmFsIHtOb2RlTGlzdH1cbiAqIEBzZWUgaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQVBJL05vZGVMaXN0XG4gKi9cblxuLyoqXG4gKiBIZWxwZXIgbWV0aG9kcy9wcm9wZXJ0aWVzIHVzZWQgd2l0aCB3YXRjaGVkLmpzXG4gKlxuICogQG1vZHVsZSB3YXRjaGVkL3V0aWwvaGVscGVyXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSB7XG5cblx0LyoqXG5cdCAqIFRydWUsIGlmIGEgbmF0aXZlIG11dGF0aW9uIG9ic2VydmVyIGV4aXN0c1xuXHQgKiBAdHlwZSB7Ym9vbGVhbn1cblx0ICovXG5cdGhhc011dGF0aW9uT2JzZXJ2ZXI6IGhhc011dGF0aW9uT2JzZXJ2ZXIsXG5cblx0LyoqXG5cdCAqIE11dGF0aW9uIG9ic2VydmVyIG9iamVjdC4gYG51bGxgLCBpZiB7QGxpbmsgd2F0Y2hlZC91dGlsL2hlbHBlci5oYXNNdXRhdGlvbk9ic2VydmVyfSBpcyBmYWxzZVxuXHQgKiBAdHlwZSB7TXV0YXRpb25PYnNlcnZlcn1cblx0ICovXG5cdE5hdGl2ZU11dGF0aW9uT2JzZXJ2ZXI6IE5hdGl2ZU11dGF0aW9uT2JzZXJ2ZXIsXG5cblx0LyoqXG5cdCAqIENoZWNrcyBpZiBgZWxgIGlzbid0IGEgdmFsaWQgZG9tIGVsZW1lbnRcblx0ICogQHBhcmFtIGVsXG5cdCAqIEByZXR1cm5zIHtib29sZWFufVxuXHQgKi9cblx0aXNJbnZhbGlkRG9tRWxlbWVudDogZnVuY3Rpb24gKGVsKSB7XG5cdFx0aWYgKGVsKSB7XG5cdFx0XHRyZXR1cm4gY29uc3RhbnRzLkFWQUlMQUJMRV9RVUVSSUVTLnNvbWUoZnVuY3Rpb24gKHF1ZXJ5KSB7XG5cdFx0XHRcdHJldHVybiB0eXBlb2YgZWxbcXVlcnldICE9PSAnZnVuY3Rpb24nO1xuXHRcdFx0fSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJldHVybiB0cnVlO1xuXHRcdH1cblx0fSxcblxuXHQvKipcblx0ICogVHJhbnNmb3JtcyBhIG5vZGVsaXN0IHlvdSBnZXQgZnJvbSBuYXRpdmUgYnJvd3NlciBxdWVyaWVzIHRvIGFuIGFycmF5XG5cdCAqIEBwYXJhbSB7Tm9kZUxpc3R9IG5vZGVMaXN0XG5cdCAqIEByZXR1cm5zIHtBcnJheS48SFRNTEVsZW1lbnQ+fVxuXHQgKi9cblx0bm9kZUxpc3RUb0FycmF5OiBmdW5jdGlvbiAobm9kZUxpc3QpIHtcblx0XHRyZXR1cm4gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwobm9kZUxpc3QpO1xuXHR9LFxuXG5cdC8qKlxuXHQgKiBDaGVja3MgaWYgYW4gYXJyYXkgY29udGFpbnMgYW4gZWxlbWVudFxuXHQgKiBAcGFyYW0ge0FycmF5fSBsaXN0XG5cdCAqIEBwYXJhbSB7Kn0gZWxlbWVudFxuXHQgKiBAcmV0dXJucyB7Ym9vbGVhbn1cblx0ICovXG5cdGFycmF5Q29udGFpbnM6IGZ1bmN0aW9uIChsaXN0LCBlbGVtZW50KSB7XG5cdFx0cmV0dXJuIGxpc3QuaW5kZXhPZihlbGVtZW50KSAhPT0gSU5ERVhfT0ZfRkFJTDtcblx0fSxcblxuXHQvKipcblx0ICogQ2xvbmVzIGFuIGFycmF5XG5cdCAqIEBwYXJhbSB7QXJyYXl9IGFyclxuXHQgKiBAcmV0dXJucyB7QXJyYXl9XG5cdCAqL1xuXHRhcnJheUNsb25lOiBmdW5jdGlvbiAoYXJyKSB7XG5cdFx0cmV0dXJuIGFyci5zbGljZSgwKTtcblx0fSxcblxuXHQvKipcblx0ICogRGVib3VuY2UgdGhlIGNhbGwgb2YgYSBmdW5jdGlvblxuXHQgKiBAcGFyYW0ge0Z1bmN0aW9ufSBhIHRoZSBmdW5jdGlvbiB0byBkZWJvdW5jZVxuXHQgKiBAcGFyYW0ge051bWJlcn0gYiB0aGUgZGVib3VuY2UgZGVsYXlcblx0ICogQHBhcmFtIHtib29sZWFufSBjIGltbWVkaWF0ZVxuXHQgKiBAcmV0dXJucyB7RnVuY3Rpb259XG5cdCAqL1xuXHRkZWJvdW5jZTogZnVuY3Rpb24gKGEsIGIsIGMpIHtcblx0XHR2YXIgZDtcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0dmFyIGUgPSB0aGlzLCBmID0gYXJndW1lbnRzO1xuXHRcdFx0Y2xlYXJUaW1lb3V0KGQpLCBkID0gc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdFx0XHRcdGQgPSBudWxsLCBjIHx8IGEuYXBwbHkoZSwgZilcblx0XHRcdH0sIGIpLCBjICYmICFkICYmIGEuYXBwbHkoZSwgZik7XG5cdFx0fVxuXHR9XG59OyIsInZhciBEb21FbGVtZW50ID0gcmVxdWlyZSgnLi9zcmMvRG9tRWxlbWVudCcpO1xuLyoqXG4gKiBAbW9kdWxlIHdhdGNoZWRcbiAqL1xuXG4vKipcbiAqIENyZWF0ZXMgYSBgTGl2ZU5vZGVMaXN0YCBkaXJlY3RseSBvciBhIGRlY29yYXRlZCBgSFRNTEVsZW1lbnRgIGFzIGBEb21FbGVtZW50YCB0byBnZXQgbGlzdHMgd2l0aFxuICogZGlmZmVyZW50IHF1ZXJpZXMgYnkgeW91cnNlbGYuXG4gKlxuICogVXNlIGEgc2VsZWN0b3IgdG8gZ2V0IGEgYExpdmVOb2RlTGlzdGAgb3IgYW4gYEhUTUxFbGVtZW50YCBmb3IgY29tcGxldGUgY29udHJvbFxuICpcbiAqXG4gKiBAZXhhbXBsZVxuICogdmFyIGZvb3MgPSB3YXRjaGVkKCcuZm9vJyk7IC8vIExpdmVOb2RlTGlzdFxuICogdmFyIGZvb3MgPSB3YXRjaGVkKGRvY3VtZW50KS5xdWVyeVNlbGVjdG9yQWxsKCcuZm9vJyk7IC8vIERvbUVsZW1lbnRcbiAqXG4gKlxuICogQHBhcmFtIHtTdHJpbmd8SFRNTEVsZW1lbnR9IGVsZW1lbnQgQSBzZWxlY3RvciBzdHJpbmcgdG8gdXNlIHdpdGggYHF1ZXJ5U2VsZWN0b3JBbGxgIG9uIHRoZSBgZG9jdW1lbnRgIG9yIGEgZG9tXG4gKiBlbGVtZW50XG4gKiBAcmV0dXJucyB7bW9kdWxlOkxpdmVOb2RlTGlzdH5MaXZlTm9kZUxpc3R8bW9kdWxlOkRvbUVsZW1lbnR+RG9tRWxlbWVudH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoZWxlbWVudCkge1xuXHRpZiAodGhpcyBpbnN0YW5jZW9mIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKCd3YXRjaGVkIGlzIGEgZmFjdG9yeSBmdW5jdGlvbiwgbm90IGEgY29uc3RydWN0b3IuIERvblxcJ3QgdXNlIHRoZSBuZXcga2V5d29yZCB3aXRoIGl0Jyk7XG5cdH1cblxuXHQvLyBhIHN0cmluZyB3aWxsIGJlIHVzZWQgYXMgYSBxdWVyeVNlbGVjdG9yQWxsIHNob3J0Y3V0IG9uIHRoZSBkb2N1bWVudCBlbGVtZW50XG5cdGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcblx0XHRyZXR1cm4gRG9tRWxlbWVudChkb2N1bWVudCkucXVlcnlTZWxlY3RvckFsbChlbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHRyZXR1cm4gRG9tRWxlbWVudChlbGVtZW50KTtcblx0fVxufTsiXX0=
