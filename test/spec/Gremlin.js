describe('Gremlin', function () {
  it('The Gremlin namespace should exist', function () {
    expect(Gremlin).to.be.an('object');
    expect(G).to.be.an('object');
    expect(G).to.equal(Gremlin);
  });
  it('GremlinJS should expose the main GremlinJS API', function () {
    expect(G.add).to.be.a('function');
    expect(G.debug).to.be.an.instanceof(gremlin.util.Debug);
    expect(G.Gizmo).to.equal(gremlin.gremlinDefinitions.Gizmo);
    /*expect(G.define).to.be.a('function');
    expect(G.add).to.be.a('function');
    expect(GremlinJS.config).to.be.a('function');
    expect(GremlinJS.define).to.be.a('function');*/
  });
});