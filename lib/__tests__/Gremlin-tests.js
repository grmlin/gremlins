var Gremlin = require('../Gremlin');

describe('Gremlin', function () {
	var Gizmo = Gremlin.create({
		name: 'Gizmo',
		foo() {
			return 'foo';
		}
	});

	it('can create gremlins', function () {
		expect(Gizmo.create).to.be.a('function');
		expect(Gizmo.foo).to.be.a('function');
	});

	// TODO: not in IE<11
	it('sets up a prototype chain', function () {
		var proto = {
			name: 'Stripe',
			bar() {
				return this.foo() + ' bar';
			}
		};
		var Stripe = Gizmo.create(proto);
		var g = Object.create(Stripe);

		expect(proto.isPrototypeOf(Stripe));
		expect(proto.isPrototypeOf(g));
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

	it('expects a name', function(){

		var proto = {};
		expect(function(){Gremlin.create(proto)}).to.throw();

	});

	setTimeout(function(){
		Gremlin.create({
			name: 'Foo'
		});
	}, 5000);
});