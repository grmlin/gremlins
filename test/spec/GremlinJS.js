describe('GremlinJS', function () {
    it('GremlinJS should exist', function () {
        expect(GremlinJS).to.be.a('function');
    });
    it('GremlinJS should expose the main GremlinJS API', function () {
        expect(GremlinJS.options).to.be.a('object');
        expect(GremlinJS.config).to.be.a('function');
        expect(GremlinJS.define).to.be.a('function');
    });
});