(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/gremlins");

},{"./lib/gremlins":14}],2:[function(require,module,exports){
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
	addGremlin: function addGremlin(gremlin, element) {
		var id = getId(element);

		if (cache[id] !== undefined) {
			console.warn("You can't add another gremlin to this element, it already uses one!", element);
		} else {
			cache[id] = gremlin;
		}
	},

	getGremlin: function getGremlin(element) {
		var id = getId(element),
		    gremlin = cache[id];

		if (gremlin === undefined) {
			console.warn("This dom element does not use any gremlins!", element);
		}
		return gremlin;
	}
};

},{"./uuid":15}],3:[function(require,module,exports){
"use strict";

function initialize(gremlin, element) {

	function init() {
		this.el = element;
		// call the constructor
		this.initialize();
	}

	init.call(gremlin);
}

module.exports = {
	createInstance: function createInstance(element, Spec) {
		//var Spec = Pool.get(name);
		//var name = Spec.name;
		//console.info(`Creating gremlin ${name}`, element);
		var gremlin = Object.create(Spec);
		initialize(gremlin, element);
		return gremlin;
	}
};

},{}],4:[function(require,module,exports){
"use strict";

var objectAssign = require("object-assign"),
    Mixins = require("./Mixins"),
    GremlinElement = require("./GremlinElement");

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
var specMap = {};

var addSpec = function (name, Spec) {
	return specMap[name] = Spec;
};
var hasSpec = function (name) {
	return specMap[name] !== undefined;
};

var Gremlin = {

	initialize: function initialize() {},

	destroy: function destroy() {},

	create: function create(Spec) {
		var Parent = this,
		    NewSpec = Object.create(Parent),
		    name = Spec.name;

		if (typeof name !== "string") {
			throw new Error("A gremlin spec needs a »name« property! It can't be found otherwise");
		}
		if (hasSpec(name)) {
			throw new Error("Trying to add new Gremlin spec, but a spec for " + name + " already exists.");
		}
		if (Spec.create !== undefined) {
			console.warn("You are replacing the original create method for the spec " + name + ". You know what you're doing, right?");
		}

		// set up the prototype chain
		objectAssign(NewSpec, Spec);
		// extend the spec with it's Mixins
		Mixins.mixinProps(NewSpec);
		// remember this name
		addSpec(name, NewSpec);
		// and create the custom element for it
		GremlinElement.register(NewSpec);
		return NewSpec;
	}

};

module.exports = Gremlin;

},{"./GremlinElement":5,"./Mixins":6,"object-assign":16}],5:[function(require,module,exports){
"use strict";

var Factory = require("./Factory"),
    Data = require("./Data");

var canRegisterElements = typeof document.registerElement === "function";

if (!canRegisterElements) {
	throw new Error("registerElement not available. Did you include the polyfill for older browsers?");
}

var addInstance = function addInstance(element, Spec) {
	var gremlin = Factory.createInstance(element, Spec);
	Data.addGremlin(gremlin, element);
};

var removeInstance = function removeInstance(element) {
	Data.getGremlin(element).destroy();
};

module.exports = {
	register: function register(Spec) {
		var name = Spec.name,
		    tagName = Spec.tagName,
		    hasTagName = typeof tagName === "string",
		    proto = {
			attachedCallback: {
				value: function value() {
					addInstance(this, Spec);
				}
			},
			detachedCallback: {
				value: function value() {
					removeInstance(this);
				}
			}
		};

		tagName = hasTagName ? tagName : name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() + "-gremlin";

		var El = document.registerElement(tagName, {
			name: tagName,
			prototype: Object.create(HTMLElement.prototype, proto)
		});
		return El;
	}
};

},{"./Data":2,"./Factory":3}],6:[function(require,module,exports){
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

var Gremlin = require("../Gremlin");

describe("Gremlin", function () {
	var Gizmo = Gremlin.create({
		name: "Gizmo",
		initialize: function initialize() {
			this.el.innerHTML = "Gizmo created: " + this.foo();
		},
		foo: function foo() {
			return "foo";
		}
	});

	it("gremlins can create gremlins", function () {
		expect(Gizmo.create).to.be.a("function");
		expect(Gizmo.foo).to.be.a("function");
	});

	it("cannot create more than one of a name", function () {
		var G1 = {
			name: "G"
		};
		var G2 = {
			name: "G"
		};
		Gizmo.create(G1);
		expect(function () {
			Gizmo.create(G2);
		}).to["throw"]();
	});

	// TODO: not in IE<11
	it("sets up a prototype chain", function () {
		var proto = {
			name: "Stripe",
			bar: function bar() {
				return this.foo() + " bar";
			}
		};
		var Stripe = Gremlin.create(proto);
		var g = Object.create(Stripe);
		expect(g.name).to.equal("Stripe");
		expect(g.hasOwnProperty("name")).to.not.be.ok();
		//expect(proto.isPrototypeOf(Stripe)).to.be.ok();
		//expect(proto.isPrototypeOf(g)).to.be.ok();
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

	it("uses mixins", function (done) {
		var called = 0;

		var Mixin = {
			initialize: function initialize() {},
			foo: function foo() {
				called++;
			},
			Mixin1: "Mixin1"
		};
		var Mixin2 = {
			initialize: function initialize() {},
			foo: function foo() {
				called++;
			},
			Mixin2: "Mixin2"
		};
		Gremlin.create({
			mixins: [Mixin, Mixin2],
			name: "G2",
			foo: function foo() {
				called++;
				if (called !== 3) {
					done(new Error("Mixins not called correctly"));
				} else {
					done();
				}
			},
			initialize: function initialize() {
				this.foo();
			}
		});

		var el = document.createElement("g2-gremlin");
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

		var el = document.createElement("g3-gremlin");
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

		var el = document.createElement("g4-gremlin");
		document.body.appendChild(el);

		setTimeout(function () {
			el.parentNode.removeChild(el);
		}, 1000);
	});
});

},{"../Gremlin":4}],8:[function(require,module,exports){
"use strict";

var nameGenerator = require("./nameGenerator");
var GremlinElement = require("../GremlinElement");

describe("GremlinElement", function () {

	it("creates custom elements", function () {
		expect(GremlinElement.register).to.be.a("function");
		expect(function () {
			GremlinElement.register({
				foo: "foo"
			});
		}).to["throw"]();

		var El = GremlinElement.register({
			name: "GremlinElementTest"
		});
		var el = document.createElement("gremlin-element-test-gremlin");
		expect(El).to.be.a("function");
		expect(el).to.be.a(HTMLElement);
		expect(el.tagName.toUpperCase()).to.equal("gremlin-element-test-gremlin".toUpperCase());
	});

	it("uses custom tag names", function () {
		var El = GremlinElement.register({
			name: "GremlinElementTagTest",
			tagName: "tag-name-test-gremlin"
		});
		var el = document.createElement("tag-name-test-gremlin");

		expect(El).to.be.a("function");
		expect(el).to.be.a(HTMLElement);
		expect(el.tagName.toUpperCase()).to.equal("tag-name-test-gremlin".toUpperCase());
	});
});

},{"../GremlinElement":5,"./nameGenerator":12}],9:[function(require,module,exports){
"use strict";

var Mixins = require("../Mixins");

describe("Mixins", function () {

	it("mixes Mixins into objects", function () {
		var Module = {
			foo: function foo() {
				return "foo";
			}
		};
		var G = {
			mixins: Module };

		Mixins.mixinProps(G);

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

		Mixins.mixinProps(G);

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

		Mixins.mixinProps(G);

		expect(G).to.have.property("foo");
		expect(G.foo).to.equal("foo");
	});

	it("respects the order Mixins are included", function () {
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

		Mixins.mixinProps(G);
		G.foo();
		expect(fooStr).to.equal("module1module2gremlin");
	});
});

},{"../Mixins":6}],10:[function(require,module,exports){
"use strict";

var gremlins = require("../../index");
var Gremlin = require("../Gremlin");

describe("gremlins", function () {

	it("the namespace should exist", function () {
		expect(gremlins).to.be.an("object");
		expect(gremlins.create).to.be(Gremlin.create);
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
 	 expect(G).to.have.property('Gremlin');
  expect(G.Gremlin).to.equal(gremlinDefinitions.Gremlin);
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
 	 var Parent = G.Gremlin.extend(function () {
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
  G.Gremlin.extend();
  }).to.throwError(Error);
 	 expect(function () {
  G.Gremlin.extend(function () {
  }, 'foo', 'foo');
  }).to.throwError(Error);
 	 expect(function () {
  G.Gremlin.extend(function () {
  }, function () {
  });
  }).to.throwError(Error);
 
  var TestGremlin = G.Gremlin.extend(function () {
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
 	 var TestGremlin = G.Gremlin.extend(function () {
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
  var TestGremlin = G.Gremlin.extend(function () {
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
 	 var LazyTest = G.Gremlin.extend(function () {
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
 	 var EventOnLoadedTest = G.Gremlin.extend(function () {
 	 });
 	 G.add('EventOnLoadedTest', EventOnLoadedTest);
  });
 	 */
});

},{"../../index":1,"../Gremlin":4}],11:[function(require,module,exports){
"use strict";

require("./gremlins-tests");
require("./Gremlin-tests");
require("./Mixins-tests");
require("./GremlinElement-tests");

},{"./Gremlin-tests":7,"./GremlinElement-tests":8,"./Mixins-tests":9,"./gremlins-tests":10}],12:[function(require,module,exports){
"use strict";

var id = 0;

module.exports = function () {
	return "G" + id++;
};

},{}],13:[function(require,module,exports){
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
},{}],14:[function(require,module,exports){
"use strict";

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
var consoleShim = require("./consoleShim"),
    Gremlin = require("./Gremlin");

// let's add a branding so we can't include more than one instance of gremlin.js
var BRANDING = "gremlins_connected";

if (document.documentElement[BRANDING]) {
  throw new Error("You tried to include gremlin.js multiple times. This will not work");
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

},{"./Gremlin":4,"./consoleShim":13}],15:[function(require,module,exports){
"use strict";

module.exports = function b(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, b);
};
// see https://gist.github.com/jed/982883

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
/*!
Copyright (C) 2014 by WebReflection

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/
(function(window, document, Object, REGISTER_ELEMENT){'use strict';

// in case it's there or already patched
if (REGISTER_ELEMENT in document) return;

// DO NOT USE THIS FILE DIRECTLY, IT WON'T WORK
// THIS IS A PROJECT BASED ON A BUILD SYSTEM
// THIS FILE IS JUST WRAPPED UP RESULTING IN
// build/document-register-element.js
// and its .max.js counter part

var
  // IE < 11 only + old WebKit for attributes + feature detection
  EXPANDO_UID = '__' + REGISTER_ELEMENT + (Math.random() * 10e4 >> 0),

  // shortcuts and costants
  ATTACHED = 'attached',
  DETACHED = 'detached',
  EXTENDS = 'extends',
  ADDITION = 'ADDITION',
  MODIFICATION = 'MODIFICATION',
  REMOVAL = 'REMOVAL',
  DOM_ATTR_MODIFIED = 'DOMAttrModified',
  DOM_CONTENT_LOADED = 'DOMContentLoaded',
  DOM_SUBTREE_MODIFIED = 'DOMSubtreeModified',
  PREFIX_TAG = '<',
  PREFIX_IS = '=',

  // valid and invalid node names
  validName = /^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,
  invalidNames = [
    'ANNOTATION-XML',
    'COLOR-PROFILE',
    'FONT-FACE',
    'FONT-FACE-SRC',
    'FONT-FACE-URI',
    'FONT-FACE-FORMAT',
    'FONT-FACE-NAME',
    'MISSING-GLYPH'
  ],

  // registered types and their prototypes
  types = [],
  protos = [],

  // to query subnodes
  query = '',

  // html shortcut used to feature detect
  documentElement = document.documentElement,

  // ES5 inline helpers || basic patches
  indexOf = types.indexOf || function (v) {
    for(var i = this.length; i-- && this[i] !== v;){}
    return i;
  },

  // other helpers / shortcuts
  OP = Object.prototype,
  hOP = OP.hasOwnProperty,
  iPO = OP.isPrototypeOf,

  defineProperty = Object.defineProperty,
  gOPD = Object.getOwnPropertyDescriptor,
  gOPN = Object.getOwnPropertyNames,
  gPO = Object.getPrototypeOf,
  sPO = Object.setPrototypeOf,

  // jshint proto: true
  hasProto = !!Object.__proto__,

  // used to create unique instances
  create = Object.create || function Bridge(proto) {
    // silly broken polyfill probably ever used but short enough to work
    return proto ? ((Bridge.prototype = proto), new Bridge()) : this;
  },

  // will set the prototype if possible
  // or copy over all properties
  setPrototype = sPO || (
    hasProto ?
      function (o, p) {
        o.__proto__ = p;
        return o;
      } : (
    (gOPN && gOPD) ?
      (function(){
        function setProperties(o, p) {
          for (var
            key,
            names = gOPN(p),
            i = 0, length = names.length;
            i < length; i++
          ) {
            key = names[i];
            if (!hOP.call(o, key)) {
              defineProperty(o, key, gOPD(p, key));
            }
          }
        }
        return function (o, p) {
          do {
            setProperties(o, p);
          } while ((p = gPO(p)));
          return o;
        };
      }()) :
      function (o, p) {
        for (var key in p) {
          o[key] = p[key];
        }
        return o;
      }
  )),

  // DOM shortcuts and helpers, if any

  MutationObserver = window.MutationObserver ||
                     window.WebKitMutationObserver,

  HTMLElementPrototype = (
    window.HTMLElement ||
    window.Element ||
    window.Node
  ).prototype,

  IE8 = !iPO.call(HTMLElementPrototype, documentElement),

  isValidNode = IE8 ?
    function (node) {
      return node.nodeType === 1;
    } :
    function (node) {
      return iPO.call(HTMLElementPrototype, node);
    },

  targets = IE8 && [],

  cloneNode = HTMLElementPrototype.cloneNode,
  setAttribute = HTMLElementPrototype.setAttribute,
  removeAttribute = HTMLElementPrototype.removeAttribute,

  // replaced later on
  createElement = document.createElement,

  // shared observer for all attributes
  attributesObserver = MutationObserver && {
    attributes: true,
    characterData: true,
    attributeOldValue: true
  },

  // useful to detect only if there's no MutationObserver
  DOMAttrModified = MutationObserver || function(e) {
    doesNotSupportDOMAttrModified = false;
    documentElement.removeEventListener(
      DOM_ATTR_MODIFIED,
      DOMAttrModified
    );
  },

  // internal flags
  setListener = false,
  doesNotSupportDOMAttrModified = true,
  dropDomContentLoaded = true,

  // optionally defined later on
  onSubtreeModified,
  callDOMAttrModified,
  getAttributesMirror,
  observer,

  // based on setting prototype capability
  // will check proto or the expando attribute
  // in order to setup the node once
  patchIfNotAlready,
  patch
;

if (sPO || hasProto) {
    patchIfNotAlready = function (node, proto) {
      if (!iPO.call(proto, node)) {
        setupNode(node, proto);
      }
    };
    patch = setupNode;
} else {
    patchIfNotAlready = function (node, proto) {
      if (!node[EXPANDO_UID]) {
        node[EXPANDO_UID] = Object(true);
        setupNode(node, proto);
      }
    };
    patch = patchIfNotAlready;
}
if (IE8) {
  doesNotSupportDOMAttrModified = false;
  (function (){
    var
      descriptor = gOPD(HTMLElementPrototype, 'addEventListener'),
      addEventListener = descriptor.value,
      patchedRemoveAttribute = function (name) {
        var e = new CustomEvent(DOM_ATTR_MODIFIED, {bubles: true});
        e.attrName = name;
        e.prevValue = this.getAttribute(name);
        e.newValue = null;
        e[REMOVAL] = e.attrChange = 2;
        removeAttribute.call(this, name);
        this.dispatchEvent(e);
      },
      patchedSetAttribute = function (name, value) {
        var
          had = this.hasAttribute(name),
          old = had && this.getAttribute(name),
          e = new CustomEvent(DOM_ATTR_MODIFIED, {bubles: true})
        ;
        setAttribute.call(this, name, value);
        e.attrName = name;
        e.prevValue = had ? old : null;
        e.newValue = value;
        if (had) {
          e[MODIFICATION] = e.attrChange = 1;
        } else {
          e[ADDITION] = e.attrChange = 0;
        }
        this.dispatchEvent(e);
      },
      onPropertyChange = function (e) {
        // jshint eqnull:true
        var
          node = e.currentTarget,
          superSecret = node[EXPANDO_UID],
          propertyName = e.propertyName,
          event
        ;
        if (superSecret.hasOwnProperty(propertyName)) {
          superSecret = superSecret[propertyName];
          event = new CustomEvent(DOM_ATTR_MODIFIED, {bubles: true});
          event.attrName = superSecret.name;
          event.prevValue = superSecret.value || null;
          event.newValue = (superSecret.value = node[propertyName] || null);
          if (event.prevValue == null) {
            event[ADDITION] = event.attrChange = 0;
          } else {
            event[MODIFICATION] = event.attrChange = 1;
          }
          node.dispatchEvent(event);
        }
      }
    ;
    descriptor.value = function (type, handler, capture) {
      if (
        type === DOM_ATTR_MODIFIED &&
        this.attributeChangedCallback &&
        this.setAttribute !== patchedSetAttribute
      ) {
        this[EXPANDO_UID] = {
          className: {
            name: 'class',
            value: this.className
          }
        };
        this.setAttribute = patchedSetAttribute;
        this.removeAttribute = patchedRemoveAttribute;
        addEventListener.call(this, 'propertychange', onPropertyChange);
      }
      addEventListener.call(this, type, handler, capture);
    };
    defineProperty(HTMLElementPrototype, 'addEventListener', descriptor);
  }());
} else if (!MutationObserver) {
  documentElement.addEventListener(DOM_ATTR_MODIFIED, DOMAttrModified);
  documentElement.setAttribute(EXPANDO_UID, 1);
  documentElement.removeAttribute(EXPANDO_UID);
  if (doesNotSupportDOMAttrModified) {
    onSubtreeModified = function (e) {
      var
        node = this,
        oldAttributes,
        newAttributes,
        key
      ;
      if (node === e.target) {
        oldAttributes = node[EXPANDO_UID];
        node[EXPANDO_UID] = (newAttributes = getAttributesMirror(node));
        for (key in newAttributes) {
          if (!(key in oldAttributes)) {
            // attribute was added
            return callDOMAttrModified(
              0,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              ADDITION
            );
          } else if (newAttributes[key] !== oldAttributes[key]) {
            // attribute was changed
            return callDOMAttrModified(
              1,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              MODIFICATION
            );
          }
        }
        // checking if it has been removed
        for (key in oldAttributes) {
          if (!(key in newAttributes)) {
            // attribute removed
            return callDOMAttrModified(
              2,
              node,
              key,
              oldAttributes[key],
              newAttributes[key],
              REMOVAL
            );
          }
        }
      }
    };
    callDOMAttrModified = function (
      attrChange,
      currentTarget,
      attrName,
      prevValue,
      newValue,
      action
    ) {
      var e = {
        attrChange: attrChange,
        currentTarget: currentTarget,
        attrName: attrName,
        prevValue: prevValue,
        newValue: newValue
      };
      e[action] = attrChange;
      onDOMAttrModified(e);
    };
    getAttributesMirror = function (node) {
      for (var
        attr, name,
        result = {},
        attributes = node.attributes,
        i = 0, length = attributes.length;
        i < length; i++
      ) {
        attr = attributes[i];
        name = attr.name;
        if (name !== 'setAttribute') {
          result[name] = attr.value;
        }
      }
      return result;
    };
  }
}

function loopAndVerify(list, action) {
  for (var i = 0, length = list.length; i < length; i++) {
    verifyAndSetupAndAction(list[i], action);
  }
}

function loopAndSetup(list) {
  for (var i = 0, length = list.length, node; i < length; i++) {
    node = list[i];
    patch(node, protos[getTypeIndex(node)]);
  }
}

function executeAction(action) {
  return function (node) {
    if (isValidNode(node)) {
      verifyAndSetupAndAction(node, action);
      loopAndVerify(
        node.querySelectorAll(query),
        action
      );
    }
  };
}

function getTypeIndex(target) {
  var
    is = target.getAttribute('is'),
    nodeName = target.nodeName.toUpperCase(),
    i = indexOf.call(
      types,
      is ?
          PREFIX_IS + is.toUpperCase() :
          PREFIX_TAG + nodeName
    )
  ;
  return is && -1 < i && !isInQSA(nodeName, is) ? -1 : i;
}

function isInQSA(name, type) {
  return -1 < query.indexOf(name + '[is="' + type + '"]');
}

function onDOMAttrModified(e) {
  var
    node = e.currentTarget,
    attrChange = e.attrChange,
    prevValue = e.prevValue,
    newValue = e.newValue
  ;
  if (node.attributeChangedCallback &&
      e.attrName !== 'style') {
    node.attributeChangedCallback(
      e.attrName,
      attrChange === e[ADDITION] ? null : prevValue,
      attrChange === e[REMOVAL] ? null : newValue
    );
  }
}

function onDOMNode(action) {
  var executor = executeAction(action);
  return function (e) {
    executor(e.target);
  };
}

function onReadyStateChange(e) {
  if (dropDomContentLoaded) {
    dropDomContentLoaded = false;
    e.currentTarget.removeEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
  }
  loopAndVerify(
    (e.target || document).querySelectorAll(query),
    e.detail === DETACHED ? DETACHED : ATTACHED
  );
  if (IE8) purge();
}

function patchedSetAttribute(name, value) {
  // jshint validthis:true
  var self = this;
  setAttribute.call(self, name, value);
  onSubtreeModified.call(self, {target: self});
}

function setupNode(node, proto) {
  setPrototype(node, proto);
  if (observer) {
    observer.observe(node, attributesObserver);
  } else {
    if (doesNotSupportDOMAttrModified) {
      node.setAttribute = patchedSetAttribute;
      node[EXPANDO_UID] = getAttributesMirror(node);
      node.addEventListener(DOM_SUBTREE_MODIFIED, onSubtreeModified);
    }
    node.addEventListener(DOM_ATTR_MODIFIED, onDOMAttrModified);
  }
  if (node.createdCallback) {
    node.created = true;
    node.createdCallback();
    node.created = false;
  }
}

function purge() {
  for (var
    node,
    i = 0,
    length = targets.length;
    i < length; i++
  ) {
    node = targets[i];
    if (!documentElement.contains(node)) {
      targets.splice(i, 1);
      verifyAndSetupAndAction(node, DETACHED);
    }
  }
}

function verifyAndSetupAndAction(node, action) {
  var
    fn,
    i = getTypeIndex(node)
  ;
  if (-1 < i) {
    patchIfNotAlready(node, protos[i]);
    i = 0;
    if (action === ATTACHED && !node[ATTACHED]) {
      node[DETACHED] = false;
      node[ATTACHED] = true;
      i = 1;
      if (IE8 && indexOf.call(targets, node) < 0) {
        targets.push(node);
      }
    } else if (action === DETACHED && !node[DETACHED]) {
      node[ATTACHED] = false;
      node[DETACHED] = true;
      i = 1;
    }
    if (i && (fn = node[action + 'Callback'])) fn.call(node);
  }
}

// set as enumerable, writable and configurable
document[REGISTER_ELEMENT] = function registerElement(type, options) {
  upperType = type.toUpperCase();
  if (!setListener) {
    // only first time document.registerElement is used
    // we need to set this listener
    // setting it by default might slow down for no reason
    setListener = true;
    if (MutationObserver) {
      observer = (function(attached, detached){
        function checkEmAll(list, callback) {
          for (var i = 0, length = list.length; i < length; callback(list[i++])){}
        }
        return new MutationObserver(function (records) {
          for (var
            current, node,
            i = 0, length = records.length; i < length; i++
          ) {
            current = records[i];
            if (current.type === 'childList') {
              checkEmAll(current.addedNodes, attached);
              checkEmAll(current.removedNodes, detached);
            } else {
              node = current.target;
              if (node.attributeChangedCallback &&
                  current.attributeName !== 'style') {
                node.attributeChangedCallback(
                  current.attributeName,
                  current.oldValue,
                  node.getAttribute(current.attributeName)
                );
              }
            }
          }
        });
      }(executeAction(ATTACHED), executeAction(DETACHED)));
      observer.observe(
        document,
        {
          childList: true,
          subtree: true
        }
      );
    } else {
      document.addEventListener('DOMNodeInserted', onDOMNode(ATTACHED));
      document.addEventListener('DOMNodeRemoved', onDOMNode(DETACHED));
    }

    document.addEventListener(DOM_CONTENT_LOADED, onReadyStateChange);
    document.addEventListener('readystatechange', onReadyStateChange);

    document.createElement = function (localName, typeExtension) {
      var
        node = createElement.apply(document, arguments),
        name = '' + localName,
        i = indexOf.call(
          types,
          (typeExtension ? PREFIX_IS : PREFIX_TAG) +
          (typeExtension || name).toUpperCase()
        ),
        setup = -1 < i
      ;
      if (typeExtension) {
        node.setAttribute('is', typeExtension = typeExtension.toLowerCase());
        if (setup) {
          setup = isInQSA(name.toUpperCase(), typeExtension);
        }
      }
      if (setup) patch(node, protos[i]);
      return node;
    };

    HTMLElementPrototype.cloneNode = function (deep) {
      var
        node = cloneNode.call(this, !!deep),
        i = getTypeIndex(node)
      ;
      if (-1 < i) patch(node, protos[i]);
      if (deep) loopAndSetup(node.querySelectorAll(query));
      return node;
    };
  }

  if (-2 < (
    indexOf.call(types, PREFIX_IS + upperType) +
    indexOf.call(types, PREFIX_TAG + upperType)
  )) {
    throw new Error('A ' + type + ' type is already registered');
  }

  if (!validName.test(upperType) || -1 < indexOf.call(invalidNames, upperType)) {
    throw new Error('The type ' + type + ' is invalid');
  }

  var
    constructor = function () {
      return document.createElement(nodeName, extending && upperType);
    },
    opt = options || OP,
    extending = hOP.call(opt, EXTENDS),
    nodeName = extending ? options[EXTENDS].toUpperCase() : upperType,
    i = types.push((extending ? PREFIX_IS : PREFIX_TAG) + upperType) - 1,
    upperType
  ;

  query = query.concat(
    query.length ? ',' : '',
    extending ? nodeName + '[is="' + type.toLowerCase() + '"]' : nodeName
  );

  constructor.prototype = (
    protos[i] = hOP.call(opt, 'prototype') ?
      opt.prototype :
      create(HTMLElementPrototype)
  );

  loopAndVerify(
    document.querySelectorAll(query),
    ATTACHED
  );

  return constructor;
};

}(window, document, Object, 'registerElement'));
},{}]},{},[17,11])(17)
});