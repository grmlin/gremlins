'use strict';
var Gremlin = require('../Gremlin');

describe('Gremlin', function () {
	var Gizmo = Gremlin.create({
		name: 'Gizmo',
		initialize(){
			this.el.innerHTML = 'Gizmo created: ' + this.foo();
		},
		foo(){
			return 'foo';
		}
	});

	it('gremlins can create gremlins', function () {
		expect(Gizmo.create).to.be.a('function');
		expect(Gizmo.foo).to.be.a('function');
	});

	it('cannot create more than one of a name', function(){
		var G1 = {
			name: 'G'
		};
		var G2 = {
			name: 'G'
		};
		Gizmo.create(G1);
		expect(function(){Gizmo.create(G2)}).to.throw();
	});

	// TODO: not in IE<11
	it('sets up a prototype chain', function () {
		var proto = {
			name: 'Stripe',
			bar() {
				return this.foo() + ' bar';
			}
		};
		var Stripe = Gremlin.create(proto);
		var g = Object.create(Stripe);
		expect(g.name).to.equal('Stripe');
		expect(g.hasOwnProperty('name')).to.not.be.ok();
		//expect(proto.isPrototypeOf(Stripe)).to.be.ok();
		//expect(proto.isPrototypeOf(g)).to.be.ok();
	});

	it('inheritance works', function () {
		var Stripe2 = Gizmo.create({
			name: 'Stripe2',
			bar() {
				return this.foo() + ' bar';
			}
		});

		expect(Stripe2.bar()).to.equal('foo bar');
		expect(Stripe2.create).to.be.a('function');
	});

	it('uses an initializer', function () {
		function initialize() {

		}

		var G1 = Gizmo.create({
			name: 'G1',
			initialize
		});

		expect(Gizmo.initialize).to.be.a('function');
		expect(G1.initialize).to.be.equal(initialize);
	});

	it('expects a name', function () {

		var proto = {};
		expect(function () {
			Gremlin.create(proto)
		}).to.throw();

	});

	it('uses mixins', function (done) {
		var called = 0;

		var Mixin = {
			initialize() {
			},
			foo() {
				called++;
			},
			Mixin1: 'Mixin1'
		};
		var Mixin2 = {
			initialize() {
			},
			foo() {
				called++;
			},
			Mixin2: 'Mixin2'
		};
		Gremlin.create({
			mixins: [Mixin, Mixin2],
			name: 'G2',
			foo() {
				called++;
				if (called !== 3) {
					done(new Error('Mixins not called correctly'));
				} else {
					done();
				}
			},
			initialize() {
				this.foo();
			}
		});

		var el = document.createElement('g2-gremlin');
		document.body.appendChild(el);
	});

	it('binds the correct dom element', function (done) {


		Gremlin.create({
			name: 'G3',
			initialize() {
				try {
					expect(this.el).to.equal(el);
					done();
				} catch (e) {
					done(e);
				}
			}
		});


		var el = document.createElement('g3-gremlin');
		document.body.appendChild(el);

	});

	it('destroys removed gremlins', function (done) {
		this.timeout(5000);

		var count = 0;
		Gremlin.create({
			name: 'G4',
			initialize(){
				count++;
			},
			destroy(){
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

		var el = document.createElement('g4-gremlin');
		document.body.appendChild(el);

		setTimeout(function () {
			el.parentNode.removeChild(el);
		}, 1000);

	});

});