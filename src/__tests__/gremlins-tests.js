var gremlins = require('../index');
var Gremlin = require('../Gremlin');
describe('gremlins', function () {

	it('the namespace should exist', function () {
		expect(gremlins).to.be.an('object');
		expect(gremlins.create).to.be.a('function');
		expect(gremlins.findGremlin).to.be.a('function');
	});
});