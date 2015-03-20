(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/gremlins");

},{"./lib/gremlins":15}],2:[function(require,module,exports){
"use strict";

//var watched = require('watched');
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
		return createInstance(element, name);
	});
}

function checkAdded(addedElements) {
	addedElements.forEach(function (element) {
		return addGremlins(element);
	});
}

function checkRemoved() {
	removedElements.forEach(function (element) {
		return removeGremlins(element);
	});
}

function createInstance(element, name) {
	Factory.createInstance(element, name);
}

function destroyInstance(element) {
	Data.getGremlins(element).forEach(function (g) {
		return g.destroy();
	});
}

module.exports = {

	observe: function observe() {},

	add: function add(element, name) {
		createInstance(element, name);
	},

	remove: function remove(element) {
		destroyInstance(element);
	}
};
/*removedElements*/
//var list = watched(`[${DATA_NAME}]`);
//list.on('added', checkAdded);
//list.on('removed', checkRemoved);
//
//// check the current Elements
//var elements = Array.prototype.slice.call(list);
//checkAdded(elements);

},{"./Factory":4}],3:[function(require,module,exports){
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
	},

	getGremlins: function getGremlins(element) {
		var id = getId(element),
		    gremlins = cache[id];

		return typeof gremlins === "object" ? Object.keys(gremlins).map(function (name) {
			return gremlins[name];
		}) : [];
	}
};

},{"./uuid":16}],4:[function(require,module,exports){
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

},{"./Data":3,"./Pool":8}],5:[function(require,module,exports){
"use strict";

var setPrototypeOf = require("setprototypeof"),
    objectAssign = require("object-assign"),
    Pool = require("./Pool");

var Gremlin = {

	initialize: function initialize() {},

	destroy: function destroy() {},

	create: function create(Spec) {
		var Parent = this,
		    newSpec = objectAssign({}, Spec);

		if (typeof newSpec.name !== "string") {
			throw new Error("A gremlin spec needs a »name« property! It can't be found otherwise");
		}
		if (newSpec.create !== undefined) {
			console.warn("You are replacing the original create method for the spec " + newSpec.name + ". You know what you're doing, right?");
		}

		setPrototypeOf(newSpec, Parent);
		return Pool.add(newSpec);
	}

};

module.exports = Gremlin;

},{"./Pool":8,"object-assign":18,"setprototypeof":19}],6:[function(require,module,exports){
"use strict";

var Collection = require("./Collection");

function register(name) {
	if (typeof document.registerElement === "function") {
		var tagName = name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
		document.registerElement("gremlin-" + tagName, {
			prototype: Object.create(HTMLElement.prototype, {
				createdCallback: {
					value: function value() {
						console.log("here I am ^_^ ");
						console.log("with content: ", this.textContent);
					}
				},
				attachedCallback: {
					value: function value() {
						console.log("live on DOM ;-) ", this);
						Collection.add(this, name);
					}
				},
				detachedCallback: {
					value: function value() {
						console.log("leaving the DOM :-( )", this);
						Collection.remove(this);
					}
				}
			})
		});
	}
}

module.exports = { register: register };

},{"./Collection":2}],7:[function(require,module,exports){
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

},{}],8:[function(require,module,exports){
"use strict";

var Mixins = require("./Mixins"),
    GremlinElement = require("./GremlinElement");

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
		GremlinElement.register(Spec.name);
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

},{"./GremlinElement":6,"./Mixins":7}],9:[function(require,module,exports){
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

	it("destroys removed gremlins", function (done) {
		this.timeout(5000);

		var count = 0;
		Gremlin.create({
			name: "G4",
			initialize: function initialize() {
				count++;
			},
			destroy: function destroy() {
				count++;
				try {
					expect(count).to.be(2);
					expect(document.documentElement.contains(this.el)).to.not.be.ok();
					done();
				} catch (e) {
					done(e);
				}
			}
		});

		var el = document.createElement("div");
		el.setAttribute("data-gremlin", "G4");
		document.body.appendChild(el);

		setTimeout(function () {
			el.parentNode.removeChild(el);
		}, 1000);
	});
});

},{"../Gremlin":5}],10:[function(require,module,exports){
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

},{"../Mixins":7}],11:[function(require,module,exports){
"use strict";

describe("Pool", function () {
	//var Pool = require('../Pool');

	it("stores object specs", function () {});
});

},{}],12:[function(require,module,exports){
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

},{"../../index":1,"../Gremlin":5}],13:[function(require,module,exports){
"use strict";

require("./gremlins-tests");
require("./Gremlin-tests");
require("./Mixins-tests");
require("./Pool-tests");

},{"./Gremlin-tests":9,"./Mixins-tests":10,"./Pool-tests":11,"./gremlins-tests":12}],14:[function(require,module,exports){
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
},{}],15:[function(require,module,exports){
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

},{"./Collection":2,"./Gremlin":5,"./consoleShim":14,"domready":17}],16:[function(require,module,exports){
"use strict";

module.exports = function b(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, b);
};
// see https://gist.github.com/jed/982883

},{}],17:[function(require,module,exports){
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

},{}],18:[function(require,module,exports){
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

},{}],19:[function(require,module,exports){
module.exports = Object.setPrototypeOf || {__proto__:[]} instanceof Array ? setProtoOf : mixinProperties;

function setProtoOf(obj, proto) {
	obj.__proto__ = proto;
}

function mixinProperties(obj, proto) {
	for (var prop in proto) {
		obj[prop] = proto[prop];
	}
}

},{}]},{},[13])(13)
});