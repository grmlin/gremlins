var gremlins = require('../../index');
var Gremlin = require('../Gremlin');

describe('gremlins', function () {

	it('the namespace should exist', function () {
		expect(gremlins).to.be.an('object');
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