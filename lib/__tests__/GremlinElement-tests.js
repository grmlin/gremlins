'use strict';

var gremlins = require('../index'),
    GremlinElement = require('../GremlinElement'),
    Gremlin = require('../Gremlin');

describe('GremlinElement', function () {

  it('creates custom elements', function (done) {
    expect(GremlinElement.register).to.be.a('function');
    expect(function () {
      GremlinElement.register('foo');
      GremlinElement.register('foo-bar-without-spec');
    }).to.throw();

    var el = document.createElement('gremlin-element-test-gremlin');
    console.log(el);

    var El = gremlins.create('gremlin-element-test-gremlin', {
      created: function created() {
        try {
          expect(el).to.be.a(HTMLElement);
          expect(el.tagName.toUpperCase()).to.equal('gremlin-element-test-gremlin'.toUpperCase());
          done();
        } catch (e) {
          done(e);
        }
        console.dir(el);
      }
    });
    expect(El).to.be.a('function');
  });
});