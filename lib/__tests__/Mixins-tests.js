var Mixins = require('../Mixins');

describe('Mixins', function () {

	it('mixes Mixins into objects', function () {
		var Module = {
			foo() {
				return 'foo';
			}
		};
		var G = {
			mixins: Module,
		};

		Mixins.mixinProps(G);

		expect(G).to.have.property('foo');
		expect(G.foo()).to.equal('foo');

	});


	it('decorates exiting functions', function () {
		var fooCount = 0;

		var Module = {
			foo() {
				fooCount++;
			}
		};
		var G = {
			mixins: Module,
			foo() {
				fooCount++;
			}
		};

		Mixins.mixinProps(G);

		expect(G).to.have.property('foo');
		G.foo();
		expect(fooCount).to.equal(2);

	});

	it('does not change existing properties that are not functions', function () {
		var Module = {
			foo: 'foo2'
		};
		var G = {
			mixins: Module,
			foo: 'foo'
		};

		Mixins.mixinProps(G);

		expect(G).to.have.property('foo');
		expect(G.foo).to.equal('foo');

	});

	it('respects the order Mixins are included', function () {
		var fooStr = '';
		var Module = {
			foo() {
				fooStr += 'module1';
			}
		};
		var Module2 = {
			foo() {
				fooStr += 'module2';
			}
		};

		var G = {
			mixins: [Module, Module2],
			foo() {
				fooStr += 'gremlin';
			}
		};

		Mixins.mixinProps(G);
		G.foo();
		expect(fooStr).to.equal('module1module2gremlin');
	});
})
;