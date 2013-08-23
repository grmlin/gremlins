describe('Gremlin', function () {
  it('The Gremlin namespace should exist', function () {
    expect(gremlin).to.be.an('object');
    expect(G).to.be.an('object');
    expect(G).to.equal(gremlin);
  });
  it('Gremlin should expose the main gremlin.js API', function () {
    expect(G.add).to.be.a('function');
    expect(G.debug).to.be.an.instanceof(util.Debug);
    expect(G.define).to.be.a('function');
    expect(G.Gizmo).to.equal(gremlinDefinitions.Gizmo);
    expect(G.Helper).to.equal(util.Helper);
    expect(G.on).to.be.a('function');
    expect(G.registerExtension).to.be.a('function');
    expect(G.ON_ELEMENT_FOUND).to.be.a('string');
    expect(G.ON_DEFINITION_PENDING).to.be.a('string');
    expect(G.ON_GREMLIN_LOADED).to.be.a('string');
  });
});