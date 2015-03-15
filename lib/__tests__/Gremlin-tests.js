var Gremlin = require('../Gremlin');

describe('Gremlin', function(){


	it('can create gremlins', function () {

		var Gizmo = Gremlin.create({
			foo(){
				console.log('foo')
			}
		});

		expect(Gizmo.create).to.be.a('function');
		expect(Gizmo.foo).to.be.a('function');
	});

	it('inheritance works', function(){
		var Gizmo = Gremlin.create({
			foo(){
				return 'foo';
			}
		});

		var Stripe = Gizmo.create({
			bar(){
				return this.foo() + ' bar';
			}
		});

		expect(Stripe.bar()).to.equal('foo bar');
		expect(Stripe.create).to.be.a('function');
	});

	
});