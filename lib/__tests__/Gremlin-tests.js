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

	it('expects a name', function () {

		var proto = {};
		expect(function () {
			Gremlin.create(proto)
		}).to.throw();

	});

	it('uses modules', function (done) {
		var called = 0;

		var Module = {
			initialize() {
			},
			foo() {
				called++;
			},
			module1: 'Module1'
		};
		var Module2 = {
			initialize() {
			},
			foo() {
				called++;
			},
			module2: 'Module2'
		};
		Gremlin.create({
			mixins: [Module, Module2],
			name: 'G2',
			foo() {
				called++;
				if (called !== 3) {
					done(new Error('Modules not called correctly'));
				} else {
					done();
				}
			},
			initialize() {
				this.foo();
			}
		});

		var el = document.createElement('div');
		el.setAttribute('data-gremlin', 'G2');
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


		var el = document.createElement('div');
		el.setAttribute('data-gremlin', 'G3');
		document.body.appendChild(el);

	});

	it('destroys removed gremlins', function(done){
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
				} catch(e){
					done(e);
				}
			}
		});

		var el = document.createElement('div');
		el.setAttribute('data-gremlin', 'G4');
		document.body.appendChild(el);

		setTimeout(function(){
			el.parentNode.removeChild(el);
		}, 1000);

	});

});