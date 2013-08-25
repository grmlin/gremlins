describe('Application', function () {
  it('An gremlin.js application can be created', function () {
    var app = new Application();
//    expect(Application.GREMLIN_CONFIG_NAME).to.equal('gremlinConfig');
    expect(Application).to.be.a('function');
    expect(app).to.exist;
  })
});