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

  it('can define new gremlin classes', function () {
    expect(function () {
      G.define('DefineTest');
    }).to.throw(Error);

    expect(function () {
      G.define(function () {
      });
    }).to.throw(Error);

    expect(function () {
      G.define('DefineTest', function () {
      }, 'foo', 'foo');
    }).to.throw(Error);

    expect(function () {
      G.define('DefineTest', function () {
      }, function () {
      });
    }).to.throw(Error);

    var TestGremlin = G.define('DefineTest', function () {
    }, {
      foo: 'bar'
    }, {
      FOO: "BAR"
    });

    expect(TestGremlin).to.have.property('FOO').that.equals('BAR');
    expect(TestGremlin.prototype).to.have.property('foo').that.equals('bar');

  });

  it('instantiates new gremlins', function (done) {
    var el = document.createElement('div');
    el.setAttribute('data-gremlin', 'CreateTest');

    document.body.appendChild(el);

    var TestGremlin = G.define('CreateTest', function () {
      try {
        expect(this.el).to.equal(el);
        expect(this.klass).to.equal(TestGremlin);
        expect(this.id).to.be.a('number');
        expect(this.data).to.be.an('object');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('handles data attributes correctly', function (done) {
    var el = document.createElement('div'),
      complex = {
        foo: 'bar',
        deep: {
          foo: 'bar'
        }
      };
    el.setAttribute('data-gremlin', 'DataTest');
    el.setAttribute('data-string', 'foo');
    el.setAttribute('data-number', "42");
    el.setAttribute('data-yes', 'true');
    el.setAttribute('data-no', 'false');
    el.setAttribute('data-object', JSON.stringify(complex));
    el.setAttribute('data-with-long-name', 'foo');

    document.body.appendChild(el);
    var TestGremlin = G.define('DataTest', function () {
      try {
        expect(this.data).to.have.property('string').that.equals('foo');
        expect(this.data).to.have.property('number').that.equals(42);
        expect(this.data).to.have.property('yes').that.equals(true);
        expect(this.data).to.have.property('no').that.equals(false);
        expect(this.data).to.have.property('object').that.deep.equals(complex);
        expect(this.data).to.have.property('withLongName').that.equals('foo');
        done();
      } catch (e) {
        done(e);
      }
    });
  });

  it('puts unavailble gremlins into a queue', function (done) {
    var el = document.createElement('div');
    el.setAttribute('data-gremlin', 'PendingTest');
    document.body.appendChild(el);

    window.setTimeout(function () {
      try {
        expect(el.className).to.equal('gremlin-loading gremlin-definition-pending');
        done();
      } catch (e) {
        done(e);
      }
    }, 600)

  });

  it('highlights gremlins without a name', function (done) {
    var el = document.createElement('div');
    el.setAttribute('data-gremlin', '');
    document.body.appendChild(el);

    window.setTimeout(function () {
      try {
        expect(el.className).to.equal('gremlin-error');
        done();
      } catch (e) {
        done(e);
      }
    }, 600)

  });

  it('lazy loads gremlin elements', function (done) {
    var el = document.createElement('div');
    el.setAttribute('data-gremlin', 'LazyTest');
    el.setAttribute('data-gremlin-lazy', 'true');
    el.style.marginTop = "3000px";
    document.body.appendChild(el);

    G.define('LazyTest', function () {
      try {
        expect(this.el).to.equal(el);
        done();
        el.parentNode.removeChild(el);
      } catch (e) {
        done(e);
      }
    });
    window.setTimeout(function () {
      try {
        expect(el.className).to.equal('gremlin-loading');
        window.scrollTo(0, document.body.scrollHeight);
      } catch (e) {
        done(e);
      }
    }, 600);

  });

  it('dispatches event when gremlin element was found', function(done) {
    var el = document.createElement('div'),
      onFound = function(foundEl){
        try {
          expect(foundEl).to.equal(el);
          done();
        } catch (e) {
          done(e);
        }

        G.off(G.ON_ELEMENT_FOUND, onFound);
        el.parentNode.removeChild(el);
      };
    el.setAttribute('data-gremlin', 'EventOnFoundTest');

    G.on(G.ON_ELEMENT_FOUND, onFound);
    document.body.appendChild(el);
  });

  it('dispatches event when gremlin definition is pending', function(done) {
    var el = document.createElement('div'),
      onPending = function(foundEl){
        try {
          expect(foundEl).to.equal(el);
          done();
        } catch (e) {
          done(e);
        }

        G.off(G.ON_DEFINITION_PENDING, onPending);
        el.parentNode.removeChild(el);
      };
    el.setAttribute('data-gremlin', 'EventOnPendingTest');

    G.on(G.ON_DEFINITION_PENDING, onPending);
    document.body.appendChild(el);
  });

  it('dispatches event when gremlin instance was created', function(done) {
    var el = document.createElement('div'),
      onCreated = function(foundEl){
        try {
          expect(foundEl).to.equal(el);
          done();
        } catch (e) {
          done(e);
        }

        G.off(G.ON_GREMLIN_LOADED, onCreated);
        el.parentNode.removeChild(el);
      };
    el.setAttribute('data-gremlin', 'EventOnLoadedTest');
    G.on(G.ON_GREMLIN_LOADED, onCreated);
    document.body.appendChild(el);

    G.define('EventOnLoadedTest', function(){

    });
  });
});