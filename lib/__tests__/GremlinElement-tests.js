var nameGenerator = require('./nameGenerator');
var GremlinElement = require('../GremlinElement');

describe('GremlinElement', function () {

	it('creates custom elements', function () {
		expect(GremlinElement.register).to.be.a('function');
		expect(function () {
			GremlinElement.register({
				foo: 'foo'
			});
		}).to.throw();

		var El = GremlinElement.register({
			name: 'GremlinElementTest'
		});
		var el = document.createElement('gremlin-element-test-gremlin');
		expect(El).to.be.a('function');
		expect(el).to.be.a(HTMLElement);
		expect(el.tagName.toUpperCase()).to.equal('gremlin-element-test-gremlin'.toUpperCase());
	});

	it('uses custom tag names', function(){
		var El = GremlinElement.register({
			name: 'GremlinElementTagTest',
			tagName: 'tag-name-test-gremlin'
		});
		var el = document.createElement('tag-name-test-gremlin');

		expect(El).to.be.a('function');
		expect(el).to.be.a(HTMLElement);
		expect(el.tagName.toUpperCase()).to.equal('tag-name-test-gremlin'.toUpperCase());
	});

});