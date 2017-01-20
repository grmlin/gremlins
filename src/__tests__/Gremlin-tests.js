'use strict';
var gremlins = require('../index'),
  Gremlin = require('../Gremlin');

describe('Gremlin', function () {
  var Gizmo = gremlins.create('gizmo-gremlin', {
    created(){
      this.el.innerHTML = 'Gizmo created: ' + this.foo();
    },
    foo(){
      return 'foo';
    }
  });


  it('create inherits all basic methods and does not need a spec', function () {
    var G = gremlins.create('base-methods');
    Object.keys(Gremlin).forEach(function (key) {
      expect(G[key]).to.equal(Gremlin[key]);
    })
  });

  it('gremlins can create gremlins', function () {
    expect(Gizmo.create).to.be.a('function');
    expect(Gizmo.foo).to.be.a('function');
  });

  it('cannot create more than one of a name', function () {
    Gremlin.create('g-gremlin');
    expect(function () {
      Gremlin.create('g-gremlin');
    }).to.throw();
  });

  // TODO: not in IE<11
  it('sets up a prototype chain', function () {
    var proto = {
      bar() {
        return this.foo() + ' bar';
      }
    };
    var Stripe = gremlins.create('stripe-gremlin', proto);
    var g = Object.create(Stripe);
    expect(g.name).to.equal('stripe-gremlin');
    expect(g.hasOwnProperty('tagName')).to.not.be.ok();
    //expect(proto.isPrototypeOf(Stripe)).to.be.ok();
    //expect(proto.isPrototypeOf(g)).to.be.ok();
  });

  it('inheritance works', function () {
    var Stripe2 = Gizmo.create('stripe2-gremlin', {
      bar() {
        return this.foo() + ' bar';
      }
    });

    expect(Stripe2.foo()).to.equal('foo');
    expect(Stripe2.bar()).to.equal('foo bar');
    expect(Stripe2.create).to.be.a('function');
  });

  it('lifecycle: uses a created callback', function (done) {
    var G1 = Gremlin.create('g1-gremlin', {
      created(){
        try {
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    var el = document.createElement('g1-gremlin');
    document.body.appendChild(el);

  });

  it('lifecycle: uses a attached callback', function (done) {
    let wasAttached = 0;
    Gremlin.create('attached-test-gremlin', {
      attached() {
        wasAttached++;

        try {
          if (wasAttached === 1) {
            expect(this.parentNode).to.equal(document.body);
          } else if (wasAttached === 2) {
            expect(this.parentNode).to.equal(container);
            done();
          }
        } catch (e) {
          done(e);
        }
      }
    });

    var el = document.createElement('attached-test-gremlin');
    var container = document.createElement('div');
    document.body.appendChild(el);
    document.body.appendChild(container);
    document.body.removeChild(el);
    container.appendChild(el);
  });


  it('lifecycle: uses a detached callback', function (done) {
    this.timeout(5000);

    var count = 0;
    gremlins.create('g4-gremlin', {
      created() {
        count++;
      },
      detached() {
        count++;
        try {
          expect(document.documentElement.contains(this)).to.not.be.ok();
        } catch (e) {
          done(e);
        }

        if (count === 3) {
          done();
        }
      }
    });

    var el = document.createElement('g4-gremlin');
    document.body.appendChild(el);

    setTimeout(function () {
      el.parentNode.removeChild(el);
      setTimeout(function () {
        document.body.appendChild(el);
        setTimeout(function () {
          el.parentNode.removeChild(el);
        }, 500);
      }, 500);
    }, 1000);

  });

  it('lifecycle: uses a detached callback on nested gremlins', function (done) {
    this.timeout(5000);

    var count = 0;
    gremlins.create('g5-gremlin', {
      created() {
        count++;
      },
      detached() {
        count++;

        try {
          expect(document.documentElement.contains(this.el)).to.not.be.ok();
        } catch (e) {
          done(e);
        }

        if (count === 3) {
          done();
        }

      }
    });

    gremlins.create('g6-gremlin', {
      created(){
        count++;
      }
    });

    var el = document.createElement('g5-gremlin');
    var nested = document.createElement('g6-gremlin');

    document.body.appendChild(el);
    el.appendChild(nested);

    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, 1000);
  });

  it('lifecycle: uses an attribute change callback', function (done) {
    Gremlin.create('attr-gremlin', {
      created(){

      },
      attributeDidChange(attributeName, previousValue, value){
        if (value === 'bar') {
          try {
            expect(attributeName).to.be.a('string');
            expect(attributeName).to.equal('id');
            expect(previousValue).to.equal('foo');
            expect(value).to.equal('bar');
            done();
          } catch (e) {
            done(e);
          }
        }
      }
    });


    var el = document.createElement('attr-gremlin');
    el.id = 'foo';
    document.body.appendChild(el);

    setTimeout(function () {
      el.id = 'bar';
    }, 500);
  });


  it('expects a name', function () {
    expect(function () {
      gremlins.create({});//TODO improve
    }).to.throw();
  });

  it('can have getters and setters in the spec', function (done) {
    const G = Gremlin.create('gettersetter-gremlin', {
      created() {
        this._foo = null;


        try {
          expect(this.foo).to.be(null);
          this.foo = 'foo';
          expect(this.foo).to.be('foo');
          done();
        } catch (e) {
          done(e);
        }
      },
      get foo() {
        console.log('calling get foo', this._foo)
        return this._foo;
      },
      set foo(val) {
        console.log('calling set foo', val)
        this._foo = val;
      },
    });

    console.log(G)
    const desc = Object.getOwnPropertyDescriptor(G, 'foo');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');


    var el = document.createElement('gettersetter-gremlin');
    document.body.appendChild(el);
  });

  it('uses mixins', function (done) {
    var called = 0;

    var Mixin = {
      foo() {
        called++;
      },
      Mixin1: 'Mixin1'
    };
    var Mixin2 = {
      foo() {
        called++;
      },
      Mixin2: 'Mixin2'
    };
    gremlins.create('g2-gremlin', {
      mixins: [Mixin, Mixin2],
      foo() {
        called++;
        if (called !== 3) {
          done(new Error('Mixins not called correctly'));
        }
      },
      attached() {
        this.foo();
        try {
          expect(this).to.be(el);
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    var el = document.createElement('g2-gremlin');
    document.body.appendChild(el);
  });

  it('binds the correct dom element', function (done) {


    gremlins.create('g3-gremlin', {
      attached() {
        try {
          expect(this).to.equal(el);
          done();
        } catch (e) {
          done(e);
        }
      }
    });


    var el = document.createElement('g3-gremlin');
    document.body.appendChild(el);

  });

  it('finds gremlins with the dom element', function (done) {
    var el = document.createElement('find-me');

    this.timeout(5000);

    gremlins.findGremlin(el).then((component) => {
      try {
        expect(component).to.equal(el);
        gremlins.findGremlin(el).then((componentInside) => {
          try {
            expect(componentInside).to.equal(el);
            el = null;
            done();
          } catch (e) {
            done(e);
          }
        })

      } catch (e) {
        done(e);
      }
    });

    setTimeout(() => {
      gremlins.create('find-me', {
        created() {
          console.log('adding event listener')
          this.style.width = '100px';
          this.style.height = '100px';
          this.style.background = 'green';
          this.addEventListener("click", () => {
            console.log('clicked')
          }, false);
        },
        now() {
          console.log('finding find-me now');
        },
      });
      document.body.appendChild(el);
    }, 1000);


  });

  it('finds gremlins with the dom element but returns null if there is none if a timeout is set', function (done) {
    var el = document.createElement('find-me-not');

    this.timeout(5000);

    gremlins.findGremlin(el, 1000).then((component) => {
      try {
        expect(component).to.be(null);
        done();
      } catch (e) {
        done(e);
      }
    });

    setTimeout(() => {
      gremlins.create('find-me-not', {});
      document.body.appendChild(el);
    }, 2000);
  });

  it('adds display block to all custom gremlin elements', function (done) {
    gremlins.create('display-test', {
      attached() {
        try {
          let style = window.getComputedStyle(this)
          expect(style.display).to.equal('block');
          done();
        } catch (e) {
          done(e);
        }
      }
    });


    var el = document.createElement('display-test');
    document.body.appendChild(el);

  });

});