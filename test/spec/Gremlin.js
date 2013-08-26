describe('Gremlin', function () {

  it('the namespace should exist', function () {
    expect(Gremlin).to.be.an('object');
    expect(G).to.be.an('object');
    expect(G).to.equal(Gremlin);
  });

  it('should expose the main gremlin.js API', function () {
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

  it('can add new gremlin classes', function () {

    expect(function () {
      G.add(AddTest)
    }).to.throw(Error);

    expect(function () {
      G.add('AddTest')
    }).to.throw(Error);

    var TestGremlin = G.add('AddTest', AddTest);
    expect(TestGremlin).to.equal(AddTest);

    expect(function () {
      G.add('AddTest', AddTest).to.not.throw(Error);
    }).to.throw(Error);

    expect(gremlinDefinitions.Pool.getInstance().get('AddTest')).to.equal(AddTest);

  });

  it('can debug', function () {
    var i = 0,
      consoles = ["clear", "debug", "error", "info", "log", "warn", "dir", "dirxml", "trace", "assert", "count", "markTimeline",
        "profile", "profileEnd", "time", "timeEnd", "timeStamp", "group", "groupCollapsed", "groupEnd"]

    util.ready(function () {
      for (; i < consoles.length; i++) {
        console.log(consoles[i])
        expect(G.debug).to.have.deep.property("console." + consoles[i]).that.is.a('function');
        G.debug.console[consoles[i]]('Logging with ' + consoles[i] + ' console');
      }

    });

  });

  it('can define new gremlin classes', function() {

  });

  it('provides the abstract gremlin Gizmo', function(){

  });



});