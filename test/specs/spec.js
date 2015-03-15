(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Gremlin = {

	create: function create(spec) {
		var parent = this;
		Object.setPrototypeOf(spec, parent);
		return Object.create(spec);
	}

};

module.exports = Gremlin;

},{}],2:[function(require,module,exports){
"use strict";

var Gremlin = require("../Gremlin");

describe("Gremlin", function () {

	it("can create gremlins", function () {

		var Gizmo = Gremlin.create({
			foo: function foo() {
				console.log("foo");
			}
		});

		expect(Gizmo.create).to.be.a("function");
		expect(Gizmo.foo).to.be.a("function");
	});

	it("inheritance works", function () {
		var Gizmo = Gremlin.create({
			foo: function foo() {
				return "foo";
			}
		});

		var Stripe = Gizmo.create({
			bar: function bar() {
				return this.foo() + " bar";
			}
		});

		expect(Stripe.bar()).to.equal("foo bar");
		expect(Stripe.create).to.be.a("function");
	});
});

},{"../Gremlin":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvX190ZXN0c19fL0dyZW1saW4tdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLElBQUksT0FBTyxHQUFHOztBQUViLE9BQU0sRUFBQSxnQkFBQyxJQUFJLEVBQUU7QUFDWixNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzNCOztDQUVELENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7O0FDWnpCLElBQUksT0FBTyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFcEMsUUFBUSxDQUFDLFNBQVMsRUFBRSxZQUFVOztBQUc3QixHQUFFLENBQUMscUJBQXFCLEVBQUUsWUFBWTs7QUFFckMsTUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQztBQUMxQixNQUFHLEVBQUEsZUFBRTtBQUNKLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEI7R0FDRCxDQUFDLENBQUM7O0FBRUgsUUFBTSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxVQUFVLENBQUMsQ0FBQztBQUN6QyxRQUFNLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDO0VBQ3RDLENBQUMsQ0FBQzs7QUFFSCxHQUFFLENBQUMsbUJBQW1CLEVBQUUsWUFBVTtBQUNqQyxNQUFJLEtBQUssR0FBRyxPQUFPLENBQUMsTUFBTSxDQUFDO0FBQzFCLE1BQUcsRUFBQSxlQUFFO0FBQ0osV0FBTyxLQUFLLENBQUM7SUFDYjtHQUNELENBQUMsQ0FBQzs7QUFFSCxNQUFJLE1BQU0sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDO0FBQ3pCLE1BQUcsRUFBQSxlQUFFO0FBQ0osV0FBTyxJQUFJLENBQUMsR0FBRyxFQUFFLEdBQUcsTUFBTSxDQUFDO0lBQzNCO0dBQ0QsQ0FBQyxDQUFDOztBQUVILFFBQU0sQ0FBQyxNQUFNLENBQUMsR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxDQUFDO0FBQ3pDLFFBQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDLENBQUM7RUFDMUMsQ0FBQyxDQUFDO0NBR0gsQ0FBQyxDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIid1c2Ugc3RyaWN0JztcblxudmFyIEdyZW1saW4gPSB7XG5cblx0Y3JlYXRlKHNwZWMpIHtcblx0XHR2YXIgcGFyZW50ID0gdGhpcztcblx0XHRPYmplY3Quc2V0UHJvdG90eXBlT2Yoc3BlYywgcGFyZW50KTtcblx0XHRyZXR1cm4gT2JqZWN0LmNyZWF0ZShzcGVjKTtcblx0fVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyZW1saW47IiwidmFyIEdyZW1saW4gPSByZXF1aXJlKCcuLi9HcmVtbGluJyk7XG5cbmRlc2NyaWJlKCdHcmVtbGluJywgZnVuY3Rpb24oKXtcblxuXG5cdGl0KCdjYW4gY3JlYXRlIGdyZW1saW5zJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIEdpem1vID0gR3JlbWxpbi5jcmVhdGUoe1xuXHRcdFx0Zm9vKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdmb28nKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdFx0ZXhwZWN0KEdpem1vLmNyZWF0ZSkudG8uYmUuYSgnZnVuY3Rpb24nKTtcblx0XHRleHBlY3QoR2l6bW8uZm9vKS50by5iZS5hKCdmdW5jdGlvbicpO1xuXHR9KTtcblxuXHRpdCgnaW5oZXJpdGFuY2Ugd29ya3MnLCBmdW5jdGlvbigpe1xuXHRcdHZhciBHaXptbyA9IEdyZW1saW4uY3JlYXRlKHtcblx0XHRcdGZvbygpe1xuXHRcdFx0XHRyZXR1cm4gJ2Zvbyc7XG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHR2YXIgU3RyaXBlID0gR2l6bW8uY3JlYXRlKHtcblx0XHRcdGJhcigpe1xuXHRcdFx0XHRyZXR1cm4gdGhpcy5mb28oKSArICcgYmFyJztcblx0XHRcdH1cblx0XHR9KTtcblxuXHRcdGV4cGVjdChTdHJpcGUuYmFyKCkpLnRvLmVxdWFsKCdmb28gYmFyJyk7XG5cdFx0ZXhwZWN0KFN0cmlwZS5jcmVhdGUpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cdH0pO1xuXG5cdFxufSk7Il19

(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

module.exports = require("./lib/gremlins");

},{"./lib/gremlins":4}],2:[function(require,module,exports){
"use strict";

var Gremlin = {

	create: function create(spec) {
		var parent = this;
		Object.setPrototypeOf(spec, parent);
		return Object.create(spec);
	}

};

module.exports = Gremlin;

},{}],3:[function(require,module,exports){
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

},{"../../index":1,"../Gremlin":2}],4:[function(require,module,exports){
"use strict";

var Gizmo = require("./Gremlin");

module.exports = {

	create: Gizmo.create

};

},{"./Gremlin":2}]},{},[3])(3)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2luZGV4LmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvR3JlbWxpbi5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL19fdGVzdHNfXy9ncmVtbGlucy10ZXN0cy5qcyIsIi9Vc2Vycy9hdy9EZXYvZ2l0L2dpdGh1Yi9ncm1saW4vZ3JlbWxpbnMvbGliL2dyZW1saW5zLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNFQSxNQUFNLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDOzs7OztBQ0EzQyxJQUFJLE9BQU8sR0FBRzs7QUFFYixPQUFNLEVBQUEsZ0JBQUMsSUFBSSxFQUFFO0FBQ1osTUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDO0FBQ2xCLFFBQU0sQ0FBQyxjQUFjLENBQUMsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFDO0FBQ3BDLFNBQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQztFQUMzQjs7Q0FFRCxDQUFDOztBQUVGLE1BQU0sQ0FBQyxPQUFPLEdBQUcsT0FBTyxDQUFDOzs7OztBQ1p6QixJQUFJLFFBQVEsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUM7QUFDdEMsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFlBQVksQ0FBQyxDQUFDOztBQUVsQyxRQUFRLENBQUMsVUFBVSxFQUFFLFlBQVk7O0FBRWhDLEdBQUUsQ0FBQyw0QkFBNEIsRUFBRSxZQUFZO0FBQzVDLFFBQU0sQ0FBQyxRQUFRLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxRQUFRLENBQUMsQ0FBQztBQUNwQyxRQUFNLENBQUMsUUFBUSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxDQUFDOzs7RUFHNUMsQ0FBQyxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0NBc1dILENBQUMsQ0FBQzs7Ozs7QUNoWEgsSUFBSSxLQUFLLEdBQUcsT0FBTyxDQUFDLFdBQVcsQ0FBQyxDQUFDOztBQUVqQyxNQUFNLENBQUMsT0FBTyxHQUFHOztBQUVoQixPQUFNLEVBQUcsS0FBSyxDQUFDLE1BQU07O0NBRXJCLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL2dyZW1saW5zJyk7XG4iLCIndXNlIHN0cmljdCc7XG5cbnZhciBHcmVtbGluID0ge1xuXG5cdGNyZWF0ZShzcGVjKSB7XG5cdFx0dmFyIHBhcmVudCA9IHRoaXM7XG5cdFx0T2JqZWN0LnNldFByb3RvdHlwZU9mKHNwZWMsIHBhcmVudCk7XG5cdFx0cmV0dXJuIE9iamVjdC5jcmVhdGUoc3BlYyk7XG5cdH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBHcmVtbGluOyIsInZhciBncmVtbGlucyA9IHJlcXVpcmUoJy4uLy4uL2luZGV4Jyk7XG52YXIgR2l6bW8gPSByZXF1aXJlKCcuLi9HcmVtbGluJyk7XG5cbmRlc2NyaWJlKCdncmVtbGlucycsIGZ1bmN0aW9uICgpIHtcblxuXHRpdCgndGhlIG5hbWVzcGFjZSBzaG91bGQgZXhpc3QnLCBmdW5jdGlvbiAoKSB7XG5cdFx0ZXhwZWN0KGdyZW1saW5zKS50by5iZS5hbignb2JqZWN0Jyk7XG5cdFx0ZXhwZWN0KGdyZW1saW5zLmNyZWF0ZSkudG8uYmUoR2l6bW8uY3JlYXRlKTtcblx0XHQvL2V4cGVjdChHKS50by5iZS5hbignb2JqZWN0Jyk7XG5cdFx0Ly9leHBlY3QoRykudG8uZXF1YWwoR3JlbWxpbik7XG5cdH0pO1xuXG5cblx0Lypcblx0IGl0KCdzaG91bGQgZXhwb3NlIHRoZSBtYWluIGdyZW1saW4uanMgQVBJJywgZnVuY3Rpb24gKCkge1xuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ2FkZCcpXG5cdCBleHBlY3QoRy5hZGQpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdkZWJ1ZycpO1xuXHQgZXhwZWN0KEcuZGVidWcpLnRvLmJlLmEodXRpbC5EZWJ1Zyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdNb2R1bGUnKTtcblx0IGV4cGVjdChHLk1vZHVsZSkudG8uYmUuYSgnZnVuY3Rpb24nKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ1BhY2thZ2UnKTtcblx0IGV4cGVjdChHLlBhY2thZ2UpLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdHaXptbycpO1xuXHQgZXhwZWN0KEcuR2l6bW8pLnRvLmVxdWFsKGdyZW1saW5EZWZpbml0aW9ucy5HaXptbyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdIZWxwZXInKVxuXHQgZXhwZWN0KEcuSGVscGVyKS50by5lcXVhbCh1dGlsLkhlbHBlcik7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdvbicpO1xuXHQgZXhwZWN0KEcub24pLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cblx0IGV4cGVjdChHKS50by5oYXZlLnByb3BlcnR5KCdPTl9FTEVNRU5UX0ZPVU5EJyk7XG5cdCBleHBlY3QoRy5PTl9FTEVNRU5UX0ZPVU5EKS50by5iZS5hKCdzdHJpbmcnKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ09OX0RFRklOSVRJT05fUEVORElORycpO1xuXHQgZXhwZWN0KEcuT05fREVGSU5JVElPTl9QRU5ESU5HKS50by5iZS5hKCdzdHJpbmcnKTtcblxuXHQgZXhwZWN0KEcpLnRvLmhhdmUucHJvcGVydHkoJ09OX0dSRU1MSU5fTE9BREVEJyk7XG5cdCBleHBlY3QoRy5PTl9HUkVNTElOX0xPQURFRCkudG8uYmUuYSgnc3RyaW5nJyk7XG5cdCB9KTtcblxuXHQgaXQoJ2NhbiBhZGQgbmV3IGdyZW1saW4gY2xhc3NlcycsIGZ1bmN0aW9uICgpIHtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKEFkZFRlc3QpXG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKCdBZGRUZXN0Jylcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCB2YXIgVGVzdEdyZW1saW4gPSBHLmFkZCgnQWRkVGVzdCcsIEFkZFRlc3QpO1xuXHQgZXhwZWN0KFRlc3RHcmVtbGluKS50by5lcXVhbChBZGRUZXN0KTtcblxuXHQgZXhwZWN0KGZ1bmN0aW9uICgpIHtcblx0IEcuYWRkKCdBZGRUZXN0JywgQWRkVGVzdCk7XG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXHQgZXhwZWN0KGdyZW1saW5EZWZpbml0aW9ucy5Qb29sLmdldEluc3RhbmNlKCkuZ2V0KCdBZGRUZXN0JykpLnRvLmJlKEFkZFRlc3QpO1xuXG5cdCB9KTtcblxuXHQgaXQoJ2NhbiBpbmhlcml0IGZyb20gZ3JlbWxpbiBjbGFzc2VzJywgZnVuY3Rpb24gKGRvbmUpIHtcblxuXHQgdmFyIGVsQ2hpbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IGVsQ2hpbGRDb2ZmZWUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0IGVsQ2hpbGQuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnSW5oZXJpdENoaWxkJyk7XG5cdCBlbENoaWxkQ29mZmVlLnNldEF0dHJpYnV0ZSgnZGF0YS1ncmVtbGluJywgJ0luaGVyaXRDaGlsZDInKTtcblxuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbENoaWxkKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWxDaGlsZENvZmZlZSk7XG5cblx0IHZhciBQYXJlbnQgPSBHLkdpem1vLmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB9LFxuXHQge1xuXHQgZm9vOiAnYmFyJ1xuXHQgfSwge1xuXHQgRk9POiBcIkJBUlwiXG5cdCB9KTtcblxuXHQgdmFyIENoaWxkID0gUGFyZW50LmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KHRoaXMuZWwpLnRvLmVxdWFsKGVsQ2hpbGQpO1xuXHQgZXhwZWN0KHRoaXMuY29uc3RydWN0b3IpLnRvLmVxdWFsKENoaWxkKTtcblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9LFxuXHQge1xuXG5cdCB9LCB7XG5cblx0IH0pO1xuXG5cdCBHLmFkZCgnSW5oZXJpdFBhcmVudCcsIFBhcmVudCk7XG5cdCBHLmFkZCgnSW5oZXJpdENoaWxkJywgQ2hpbGQpO1xuXG5cdCBleHBlY3QoQ2hpbGQpLnRvLmhhdmUucHJvcGVydHkoJ0ZPTycpO1xuXHQgZXhwZWN0KENoaWxkLkZPTykudG8uZXF1YWwoJ0JBUicpO1xuXG5cdCBleHBlY3QoQ2hpbGQucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdmb28nKTtcblx0IGV4cGVjdChDaGlsZC5wcm90b3R5cGUuZm9vKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkKS50by5oYXZlLnByb3BlcnR5KCdGT08nKTtcblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkLkZPTykudG8uZXF1YWwoJ0ZPTycpO1xuXG5cdCBleHBlY3QoSW5oZXJpdFRlc3RDaGlsZC5wcm90b3R5cGUpLnRvLmhhdmUucHJvcGVydHkoJ2ZvbycpO1xuXHQgZXhwZWN0KEluaGVyaXRUZXN0Q2hpbGQucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdiYXInKTtcblx0IGV4cGVjdChJbmhlcml0VGVzdENoaWxkLnByb3RvdHlwZS5mb28pLnRvLmJlLmEoJ2Z1bmN0aW9uJyk7XG5cdCBleHBlY3QoSW5oZXJpdFRlc3RDaGlsZC5wcm90b3R5cGUuYmFyKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IH0pXG5cblx0IGl0KCdjYW4gY3JlYXRlIG5ldyBncmVtbGluIGNsYXNzZXMgd2l0aG91dCBjb2ZmZWVzY3JpcHQnLCBmdW5jdGlvbiAoKSB7XG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5hZGQoJ0RlZmluZVRlc3QnKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgfSwgJ2ZvbycsICdmb28nKTtcblx0IH0pLnRvLnRocm93RXJyb3IoRXJyb3IpO1xuXG5cdCBleHBlY3QoZnVuY3Rpb24gKCkge1xuXHQgRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgfSwgZnVuY3Rpb24gKCkge1xuXHQgfSk7XG5cdCB9KS50by50aHJvd0Vycm9yKEVycm9yKTtcblxuXG5cdCB2YXIgVGVzdEdyZW1saW4gPSBHLkdpem1vLmV4dGVuZChmdW5jdGlvbiAoKSB7XG5cdCB9LCB7XG5cdCBmb286ICdiYXInXG5cdCB9LCB7XG5cdCBGT086IFwiQkFSXCJcblx0IH0pO1xuXG5cdCBleHBlY3QoVGVzdEdyZW1saW4pLnRvLmhhdmUucHJvcGVydHkoJ0ZPTycpO1xuXHQgZXhwZWN0KFRlc3RHcmVtbGluLkZPTykudG8uZXF1YWwoJ0JBUicpO1xuXG5cdCBleHBlY3QoVGVzdEdyZW1saW4ucHJvdG90eXBlKS50by5oYXZlLnByb3BlcnR5KCdmb28nKTtcblx0IGV4cGVjdChUZXN0R3JlbWxpbi5wcm90b3R5cGUuZm9vKS50by5lcXVhbCgnYmFyJyk7XG5cblx0IH0pO1xuXG5cdCBpdCgnaW5zdGFudGlhdGVzIG5ldyBncmVtbGlucycsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IGVsQ29mZmVlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdDcmVhdGVUZXN0Jyk7XG5cdCBlbENvZmZlZS5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdDcmVhdGVUZXN0Q29mZmVlJyk7XG5cblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbENvZmZlZSk7XG5cblx0IHZhciBUZXN0R3JlbWxpbiA9IEcuR2l6bW8uZXh0ZW5kKGZ1bmN0aW9uICgpIHtcblx0IHRyeSB7XG5cdCBleHBlY3QodGhpcy5lbCkudG8uZXF1YWwoZWwpO1xuXHQgZXhwZWN0KHRoaXMuY29uc3RydWN0b3IpLnRvLmVxdWFsKFRlc3RHcmVtbGluKTtcblx0IGV4cGVjdCh0aGlzLmlkKS50by5iZS5hKCdudW1iZXInKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmJlLmFuKCdvYmplY3QnKTtcblx0IC8vZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblx0IH0pO1xuXG5cblx0IFRlc3RHcmVtbGluID0gRy5hZGQoJ0NyZWF0ZVRlc3QnLCBUZXN0R3JlbWxpbik7XG5cdCB2YXIgQ3JlYXRlVGVzdEdyZW1saW4gPSBHLmFkZCgnQ3JlYXRlVGVzdENvZmZlZScsIENyZWF0ZVRlc3QpO1xuXG5cdCB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgdmFyIGcgPSBlbENvZmZlZS5fX2dyZW1saW47XG5cdCBleHBlY3QoZWxDb2ZmZWUuY2xhc3NOYW1lKS50by5lcXVhbCgnZ3JlbWxpbi1yZWFkeScpO1xuXHQgZXhwZWN0KGcuZWwpLnRvLmVxdWFsKGVsQ29mZmVlKTtcblx0IGV4cGVjdChnLmNvbnN0cnVjdG9yKS50by5lcXVhbChDcmVhdGVUZXN0R3JlbWxpbik7XG5cdCBleHBlY3QoZy5pZCkudG8uYmUuYSgnbnVtYmVyJyk7XG5cdCBleHBlY3QoZy5kYXRhKS50by5iZS5hbignb2JqZWN0Jyk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKVxuXHQgfSk7XG5cblx0IGl0KCdpbnN0YW50aWF0ZXMgbXVsdGlwbGUgZ3JlbWxpbnMgb24gYSBzaW5nZSBlbGVtZW50Jyk7XG5cblx0IGl0KCdoYW5kbGVzIGRhdGEgYXR0cmlidXRlcyBjb3JyZWN0bHknLCBmdW5jdGlvbiAoZG9uZSkge1xuXHQgdmFyIGVsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2JyksXG5cdCBjb21wbGV4ID0ge1xuXHQgZm9vOiAnYmFyJyxcblx0IGRlZXA6IHtcblx0IGZvbzogJ2Jhcidcblx0IH1cblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdEYXRhVGVzdCcpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXN0cmluZycsICdmb28nKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1udW1iZXInLCBcIjQyXCIpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLXllcycsICd0cnVlJyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtbm8nLCAnZmFsc2UnKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1vYmplY3QnLCBKU09OLnN0cmluZ2lmeShjb21wbGV4KSk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtd2l0aC1sb25nLW5hbWUnLCAnZm9vJyk7XG5cblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgdmFyIFRlc3RHcmVtbGluID0gRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ3N0cmluZycpXG5cdCBleHBlY3QodGhpcy5kYXRhLnN0cmluZykudG8uYmUoJ2ZvbycpO1xuXG5cdCBleHBlY3QodGhpcy5kYXRhKS50by5oYXZlLnByb3BlcnR5KCdudW1iZXInKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEubnVtYmVyKS50by5iZSg0Mik7XG5cblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ3llcycpO1xuXHQgZXhwZWN0KHRoaXMuZGF0YS55ZXMpLnRvLmJlLm9rKCk7XG5cblx0IGV4cGVjdCh0aGlzLmRhdGEpLnRvLmhhdmUucHJvcGVydHkoJ25vJyk7XG5cdCBleHBlY3QodGhpcy5kYXRhLm5vKS5ub3QudG8uYmUub2soKTtcblxuXHQgZXhwZWN0KHRoaXMuZGF0YSkudG8uaGF2ZS5wcm9wZXJ0eSgnb2JqZWN0Jyk7XG5cdCBleHBlY3QodGhpcy5kYXRhLm9iamVjdCkudG8uZXFsKGNvbXBsZXgpO1xuXG5cdCBleHBlY3QodGhpcy5kYXRhKS50by5oYXZlLnByb3BlcnR5KCd3aXRoTG9uZ05hbWUnKTtcblx0IGV4cGVjdCh0aGlzLmRhdGEud2l0aExvbmdOYW1lKS50by5iZSgnZm9vJyk7XG5cblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9KTtcblxuXHQgRy5hZGQoJ0RhdGFUZXN0JywgVGVzdEdyZW1saW4pO1xuXHQgfSk7XG5cblx0IGl0KCdwdXRzIHVuYXZhaWxibGUgZ3JlbWxpbnMgaW50byBhIHF1ZXVlJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnUGVuZGluZ1Rlc3QnKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXG5cdCB3aW5kb3cuc2V0VGltZW91dChmdW5jdGlvbiAoKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KGVsLmNsYXNzTmFtZSkudG8uZXF1YWwoJ2dyZW1saW4tbG9hZGluZyBncmVtbGluLWRlZmluaXRpb24tcGVuZGluZycpO1xuXHQgZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblx0IH0sIDYwMClcblxuXHQgfSk7XG5cblx0IGl0KCdoaWdobGlnaHRzIGdyZW1saW5zIHdpdGhvdXQgYSBuYW1lJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnJyk7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblxuXHQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChlbC5jbGFzc05hbWUpLnRvLmVxdWFsKCdncmVtbGluLWVycm9yJyk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKVxuXG5cdCB9KTtcblxuXHQgaXQoJ2xhenkgbG9hZHMgZ3JlbWxpbiBlbGVtZW50cycsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcblx0IGVsLnNldEF0dHJpYnV0ZSgnZGF0YS1ncmVtbGluJywgJ0xhenlUZXN0Jyk7XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbi1sYXp5JywgJ3RydWUnKTtcblx0IGVsLnN0eWxlLm1hcmdpblRvcCA9IFwiMzAwMHB4XCI7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblxuXHQgdmFyIExhenlUZXN0ID0gRy5HaXptby5leHRlbmQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdCh0aGlzLmVsKS50by5lcXVhbChlbCk7XG5cdCBkb25lKCk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IHdpbmRvdy5zY3JvbGxUbygwLCAwKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cdCB9KTtcblx0IEcuYWRkKCdMYXp5VGVzdCcsIExhenlUZXN0KTtcblxuXHQgd2luZG93LnNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChlbC5jbGFzc05hbWUpLnRvLmVxdWFsKCdncmVtbGluLWxvYWRpbmcnKTtcblx0IHdpbmRvdy5zY3JvbGxUbygwLCBkb2N1bWVudC5ib2R5LnNjcm9sbEhlaWdodCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXHQgfSwgNjAwKTtcblxuXHQgfSk7XG5cblx0IGl0KCdkaXNwYXRjaGVzIGV2ZW50IHdoZW4gZ3JlbWxpbiBlbGVtZW50IHdhcyBmb3VuZCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IG9uRm91bmQgPSBmdW5jdGlvbiAoZm91bmRFbCkge1xuXHQgdHJ5IHtcblx0IGV4cGVjdChmb3VuZEVsKS50by5lcXVhbChlbCk7XG5cdCBkb25lKCk7XG5cdCB9IGNhdGNoIChlKSB7XG5cdCBkb25lKGUpO1xuXHQgfVxuXG5cdCBHLm9mZihHLk9OX0VMRU1FTlRfRk9VTkQsIG9uRm91bmQpO1xuXHQgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCk7XG5cdCB9O1xuXHQgZWwuc2V0QXR0cmlidXRlKCdkYXRhLWdyZW1saW4nLCAnRXZlbnRPbkZvdW5kVGVzdCcpO1xuXG5cdCBHLm9uKEcuT05fRUxFTUVOVF9GT1VORCwgb25Gb3VuZCk7XG5cdCBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGVsKTtcblx0IH0pO1xuXG5cdCBpdCgnZGlzcGF0Y2hlcyBldmVudCB3aGVuIGdyZW1saW4gZGVmaW5pdGlvbiBpcyBwZW5kaW5nJywgZnVuY3Rpb24gKGRvbmUpIHtcblx0IHZhciBlbCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpLFxuXHQgb25QZW5kaW5nID0gZnVuY3Rpb24gKGZvdW5kRWwpIHtcblx0IHRyeSB7XG5cdCBleHBlY3QoZm91bmRFbCkudG8uZXF1YWwoZWwpO1xuXHQgZG9uZSgpO1xuXHQgfSBjYXRjaCAoZSkge1xuXHQgZG9uZShlKTtcblx0IH1cblxuXHQgRy5vZmYoRy5PTl9ERUZJTklUSU9OX1BFTkRJTkcsIG9uUGVuZGluZyk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdFdmVudE9uUGVuZGluZ1Rlc3QnKTtcblxuXHQgRy5vbihHLk9OX0RFRklOSVRJT05fUEVORElORywgb25QZW5kaW5nKTtcblx0IGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQoZWwpO1xuXHQgfSk7XG5cblx0IGl0KCdkaXNwYXRjaGVzIGV2ZW50IHdoZW4gZ3JlbWxpbiBpbnN0YW5jZSB3YXMgY3JlYXRlZCcsIGZ1bmN0aW9uIChkb25lKSB7XG5cdCB2YXIgZWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKSxcblx0IG9uQ3JlYXRlZCA9IGZ1bmN0aW9uIChmb3VuZEVsKSB7XG5cdCB0cnkge1xuXHQgZXhwZWN0KGZvdW5kRWwpLnRvLmVxdWFsKGVsKTtcblx0IGRvbmUoKTtcblx0IH0gY2F0Y2ggKGUpIHtcblx0IGRvbmUoZSk7XG5cdCB9XG5cblx0IEcub2ZmKEcuT05fR1JFTUxJTl9MT0FERUQsIG9uQ3JlYXRlZCk7XG5cdCBlbC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKGVsKTtcblx0IH07XG5cdCBlbC5zZXRBdHRyaWJ1dGUoJ2RhdGEtZ3JlbWxpbicsICdFdmVudE9uTG9hZGVkVGVzdCcpO1xuXHQgRy5vbihHLk9OX0dSRU1MSU5fTE9BREVELCBvbkNyZWF0ZWQpO1xuXHQgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChlbCk7XG5cblx0IHZhciBFdmVudE9uTG9hZGVkVGVzdCA9IEcuR2l6bW8uZXh0ZW5kKGZ1bmN0aW9uICgpIHtcblxuXHQgfSk7XG5cblx0IEcuYWRkKCdFdmVudE9uTG9hZGVkVGVzdCcsIEV2ZW50T25Mb2FkZWRUZXN0KTtcblx0IH0pO1xuXG5cdCAqL1xufSk7IiwidmFyIEdpem1vID0gcmVxdWlyZSgnLi9HcmVtbGluJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXG5cdGNyZWF0ZVx0OiBHaXptby5jcmVhdGVcblxufTsiXX0=
