'use strict';
var gremlins = require('../index'),
  Gremlin = require('../Gremlin');

describe('Gremlin', function () {
  var Gizmo = gremlins.create('gizmo-gremlin', {
    initialize(){
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
    Gizmo.create('g-gremlin');
    expect(function () {
      Gizmo.create('g-gremlin');
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

  it('uses an initializer', function (done) {
    var G1 = Gizmo.create('g1-gremlin', {
      initialize(){
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

  it('expects a name', function () {
    expect(function () {
      gremlins.create({});//TODO improve
    }).to.throw();

  });


  it('has an attribute change callback', function (done) {
    Gizmo.create('attr-gremlin', {
      initialize(){

      },
      attributeDidChange(attributeName, previousValue, value){
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
    });


    var el = document.createElement('attr-gremlin');
    el.id = 'foo';
    document.body.appendChild(el);

    setTimeout(function () {
      el.id = 'bar';
    }, 500);
  });

  it('can have getters and setters in the spec', function (done) {
    const G = Gizmo.create('gettersetter-gremlin', {
      initialize() {
        this.foo = 'foo';


        try {
          expect(this._foo).to.be('foo');
          done();
        } catch (e) {
          done(e);
        }
      },
      get foo() {
        return this._foo;
      },
      set foo(val) {
        this._foo = val;
      },
    });

    const desc = Object.getOwnPropertyDescriptor(G, 'foo');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');


    var el = document.createElement('gettersetter-gremlin');
    document.body.appendChild(el);
  });

  it('uses mixins', function (done) {
    var called = 0;

    var Mixin = {
      initialize() {
      },
      foo() {
        called++;
      },
      Mixin1: 'Mixin1'
    };
    var Mixin2 = {
      initialize() {
      },
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
      initialize() {
        this.foo();
        try {
          expect(this.el).to.be(el);
          done();
        } catch(e) {
          done(e);
        }
      }
    });

    var el = document.createElement('g2-gremlin');
    document.body.appendChild(el);
  });

  it('binds the correct dom element', function (done) {


    gremlins.create('g3-gremlin', {
      initialize() {
        try {
          expect(this.el).to.equal(el);
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

    gremlins.create('find-me', {
      initialize() {
        try {
          expect(gremlins.findGremlin(el)).to.equal(this);
          expect(this.el).to.equal(el);
          done();
        } catch (e) {
          done(e);
        }
      }
    })

    document.body.appendChild(el);

  });

  it('destroys removed gremlins', function (done) {
    this.timeout(5000);

    var count = 0;
    gremlins.create('g4-gremlin', {
      initialize(){
        count++;
      },
      destroy(){
        count++;
        try {
          expect(count).to.be(2);
          expect(document.documentElement.contains(this.el)).to.not.be.ok();
          done();
        } catch (e) {
          done(e);
        }
      }
    });

    var el = document.createElement('g4-gremlin');
    document.body.appendChild(el);

    setTimeout(function () {
      el.parentNode.removeChild(el);
    }, 1000);

  });

  it('destroys nested gremlins on removal', function (done) {
    this.timeout(5000);

    var count = 0;
    gremlins.create('g5-gremlin', {
      initialize(){
        count++;
      },
      destroy(){
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
      initialize(){
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

  it('adds display block to all custom gremlin elements', function (done) {
    gremlins.create('display-test', {
      initialize() {
        try {
          let style = window.getComputedStyle(this.el)
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