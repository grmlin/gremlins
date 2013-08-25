describe('Gremlin', function () {
  it('The Gremlin namespace should exist', function () {
    expect(gremlin).to.be.an('object');
    expect(G).to.be.an('object');
    expect(G).to.equal(gremlin);
  });
  it('Gremlin should expose the main gremlin.js API', function () {
    //expect(G).to.have.property('add', 'debug','define','Gizmo','Helper','on','registerExtension','ON_ELEMENT_FOUND','ON_DEFINITION_PENDING','ON_GREMLIN_LOADED');
    expect(G).to.have.property('add').that.is.a('function');
    expect(G).to.have.property('debug').that.is.an.instanceof(util.Debug);
    expect(G).to.have.property('define').that.is.a('function');
    expect(G).to.have.property('Gizmo').that.equals(gremlinDefinitions.Gizmo);
    expect(G).to.have.property('Helper').that.equals(util.Helper);
    expect(G).to.have.property('on').that.is.a('function');
    expect(G).to.have.property('registerExtension').that.is.a('function');
    expect(G).to.have.property('ON_ELEMENT_FOUND').that.is.a('string');
    expect(G).to.have.property('ON_DEFINITION_PENDING').that.is.a('string');
    expect(G).to.have.property('ON_GREMLIN_LOADED').that.is.a('string');
  });
});