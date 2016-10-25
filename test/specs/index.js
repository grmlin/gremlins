(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var uuid = require('./uuid');

var exp = 'gremlins_' + uuid();
var cache = {};
var pendingSearches = [];

var gremlinId = function gremlinId() {
  var id = 1;
  return function () {
    return id++;
  };
}();

var hasId = function hasId(element) {
  return element[exp] !== undefined;
};
var setId = function setId(element) {
  return element[exp] = gremlinId();
}; // eslint-disable-line no-param-reassign
var getId = function getId(element) {
  return hasId(element) ? element[exp] : setId(element);
};

module.exports = {
  addGremlin: function addGremlin(gremlin, element) {
    var id = getId(element);

    if (cache[id] !== undefined) {
      console.warn('You can\'t add another gremlin to this element, it already uses one!', element); // eslint-disable-line no-console, max-len
    } else {
        cache[id] = gremlin;
      }

    pendingSearches = pendingSearches.filter(function (search) {
      var wasSearchedFor = search.element === element;
      if (wasSearchedFor) {
        search.created(gremlin);
      }

      return !wasSearchedFor;
    });
  },
  getGremlin: function getGremlin(element) {
    var id = getId(element);
    var gremlin = cache[id];

    if (gremlin === undefined) {
      // console.warn(`This dom element does not use any gremlins!`, element);
    }
    return gremlin === undefined ? null : gremlin;
  },
  getGremlinAsync: function getGremlinAsync(element) {
    var _this = this;

    var timeout = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

    return new Promise(function (resolve) {
      var currentGremlin = _this.getGremlin(element);

      if (currentGremlin !== null) {
        resolve(currentGremlin);
      } else {
        (function () {
          var gremlinNotFoundTimeout = timeout !== null ? setTimeout(function () {
            resolve(null);
          }, timeout) : null;

          pendingSearches.push({
            element: element,
            created: function created(createdGremlin) {
              clearTimeout(gremlinNotFoundTimeout);
              resolve(createdGremlin);
            }
          });
        })();
      }
    });
  }
};
},{"./uuid":14}],2:[function(require,module,exports){
"use strict";

module.exports = {
  createInstance: function createInstance(element, Spec) {
    return Object.create(Spec, {
      el: {
        value: element,
        writable: false
      }
    });
  }
};
},{}],3:[function(require,module,exports){
'use strict';

var Mixins = require('./Mixins');
var GremlinElement = require('./GremlinElement');

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */

function extend(obj) {
  for (var _len = arguments.length, sources = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    sources[_key - 1] = arguments[_key];
  }

  sources.forEach(function (source) {
    if (source) {
      for (var prop in source) {
        if (source.hasOwnProperty(prop)) {
          var descriptor = Object.getOwnPropertyDescriptor(source, prop);
          Object.defineProperty(obj, prop, descriptor);
        }
      }
    }
  });
  return obj;
}

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
var specMap = {};

var addSpec = function addSpec(tagName, Spec) {
  return specMap[tagName] = Spec;
};
var hasSpec = function hasSpec(tagName) {
  return specMap[tagName] !== undefined;
};

var Gremlin = {
  created: function created() {},
  attached: function attached() {},
  detached: function detached() {},
  create: function create(tagName) {
    var Spec = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

    var Parent = this;
    var NewSpec = Object.create(Parent, {
      name: {
        value: tagName,
        writable: true
      }
    });

    if (typeof tagName !== 'string') {
      throw new TypeError('Gremlins.create expects the gremlins tag name as a first argument');
    }
    if (hasSpec(tagName)) {
      throw new Error('Trying to add new Gremlin spec, but a spec for ' + tagName + ' already exists.');
    }
    if (Spec.create !== undefined) {
      console.warn( // eslint-disable-line no-console
      'You are replacing the original create method for the spec of ' + tagName + '. You know what ' + 'you\'re doing, right?');
    }

    // set up the prototype chain
    extend(NewSpec, Spec);
    // extend the spec with it's Mixins
    Mixins.mixinProps(NewSpec);
    // remember this name
    addSpec(tagName, NewSpec);
    // and create the custom element for it
    GremlinElement.register(tagName, NewSpec);
    return NewSpec;
  },
  attributeDidChange: function attributeDidChange() {}
};

module.exports = Gremlin;
},{"./GremlinElement":4,"./Mixins":5}],4:[function(require,module,exports){
'use strict';

var Factory = require('./Factory');
var Data = require('./Data');

var canRegisterElements = typeof document.registerElement === 'function';

if (!canRegisterElements) {
  throw new Error('registerElement not available. Did you include the polyfill for older browsers?');
}

var styleElement = document.createElement('style');
var styleSheet = undefined;

document.head.appendChild(styleElement);
styleSheet = styleElement.sheet;

function createInstance(element, Spec) {
  var existingGremlins = Data.getGremlin(element);

  if (existingGremlins === null) {
    var gremlin = Factory.createInstance(element, Spec);
    Data.addGremlin(gremlin, element);

    if (typeof gremlin.initialize === 'function') {
      console.warn('<' + element.tagName + ' />\n' + 'the use of the `initialize` callback of a gremlin component is deprecated. ' + 'Use the `created` callback instead.');
      gremlin.initialize();
    } else {
      gremlin.created();
    }
  } else {
    // console.warn('exisiting gremlin found');
  }
}

function attachInstance(element) {
  var gremlin = Data.getGremlin(element);
  gremlin.attached();
}

function detachInstance(element) {
  var gremlin = Data.getGremlin(element);

  if (typeof gremlin.destroy === 'function') {
    console.warn('<' + element.tagName + ' />\n' + 'the use of the `destroy` callback of a gremlin component is deprecated. Use ' + 'the `detached` callback instead.');
    gremlin.destroy();
  } else {
    gremlin.detached();
  }
}

function updateAttr(element, name, previousValue, value) {
  var gremlin = Data.getGremlin(element);

  if (gremlin !== null) {
    gremlin.attributeDidChange(name, previousValue, value);
  }
}

module.exports = {
  register: function register(tagName, Spec) {
    var proto = {
      createdCallback: {
        value: function value() {
          createInstance(this, Spec);
        }
      },
      attachedCallback: {
        value: function value() {
          attachInstance(this);
        }
      },
      detachedCallback: {
        value: function value() {
          detachInstance(this);
        }
      },
      attributeChangedCallback: {
        value: function value(name, previousValue, _value) {
          updateAttr(this, name, previousValue, _value);
        }
      }
    };

    // insert the rule BEFORE registering the element. This is important because they may be inline
    // otherwise when first initialized.
    styleSheet.insertRule(tagName + ' { display: block }', 0);

    var El = document.registerElement(tagName, {
      name: tagName,
      prototype: Object.create(HTMLElement.prototype, proto)
    });

    return El;
  }
};
},{"./Data":1,"./Factory":2}],5:[function(require,module,exports){
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var objectAssign = require('object-assign');

function getMixins(gremlin) {
  if (Array.isArray(gremlin.mixins)) {
    return gremlin.mixins;
  }

  return gremlin.mixins ? [gremlin.mixins] : [];
}

function decorateProperty(gremlin, propertyName, property) {
  var gremlinProperty = gremlin[propertyName];
  var moduleProperty = property;
  var gremlinPropertyType = typeof gremlinProperty === 'undefined' ? 'undefined' : _typeof(gremlinProperty);
  var modulePropertyType = typeof moduleProperty === 'undefined' ? 'undefined' : _typeof(moduleProperty);
  var isSamePropType = gremlinPropertyType === modulePropertyType;

  if (isSamePropType && modulePropertyType === 'function') {
    gremlin[propertyName] = function () {
      // eslint-disable-line no-param-reassign, func-names
      // call the module first
      var moduleResult = moduleProperty.apply(this, arguments);
      var gremlinResult = gremlinProperty.apply(this, arguments);

      try {
        return objectAssign(moduleResult, gremlinResult);
      } catch (e) {
        return [moduleResult, gremlinResult];
      }
    };
  } else {
    console.warn( // eslint-disable-line no-console
    'Can\'t decorate gremlin property ' + ('<' + gremlin.tagName + ' />#' + propertyName + ':' + gremlinPropertyType + '« ') + ('with »Module#' + propertyName + ':' + modulePropertyType + '«. Only functions can be decorated!'));
  }
}

function mixinModule(gremlin, Module) {
  Object.keys(Module).forEach(function (propertyName) {
    var property = Module[propertyName];

    if (gremlin[propertyName] === undefined) {
      var descriptor = Object.getOwnPropertyDescriptor(Module, propertyName);
      Object.defineProperty(gremlin, propertyName, descriptor);
    } else {
      decorateProperty(gremlin, propertyName, property);
    }
  });
}

module.exports = {
  mixinProps: function mixinProps(gremlin) {
    var modules = getMixins(gremlin);
    // reverse the modules array to call decorated functions in the right order
    modules.reverse().forEach(function (Module) {
      return mixinModule(gremlin, Module);
    });
  }
};
},{"object-assign":16}],6:[function(require,module,exports){
'use strict';

var gremlins = require('../index'),
    Gremlin = require('../Gremlin');

describe('Gremlin', function () {
  var Gizmo = gremlins.create('gizmo-gremlin', {
    created: function created() {
      this.el.innerHTML = 'Gizmo created: ' + this.foo();
    },
    foo: function foo() {
      return 'foo';
    }
  });

  it('create inherits all basic methods and does not need a spec', function () {
    var G = gremlins.create('base-methods');
    Object.keys(Gremlin).forEach(function (key) {
      expect(G[key]).to.equal(Gremlin[key]);
    });
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
      bar: function bar() {
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
      bar: function bar() {
        return this.foo() + ' bar';
      }
    });

    expect(Stripe2.foo()).to.equal('foo');
    expect(Stripe2.bar()).to.equal('foo bar');
    expect(Stripe2.create).to.be.a('function');
  });

  it('lifecycle: uses a created callback', function (done) {
    var G1 = Gremlin.create('g1-gremlin', {
      created: function created() {
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
    var wasAttached = 0;
    Gremlin.create('attached-test-gremlin', {
      attached: function attached() {
        wasAttached++;

        try {
          if (wasAttached === 1) {
            expect(this.el.parentNode).to.equal(document.body);
          } else if (wasAttached === 2) {
            expect(this.el.parentNode).to.equal(container);
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
      created: function created() {
        count++;
      },
      detached: function detached() {
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
      created: function created() {
        count++;
      },
      detached: function detached() {
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
      created: function created() {
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
      created: function created() {},
      attributeDidChange: function attributeDidChange(attributeName, previousValue, value) {
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
      gremlins.create({}); //TODO improve
    }).to.throw();
  });

  it('can have getters and setters in the spec', function (done) {
    var G = Gremlin.create('gettersetter-gremlin', {
      created: function created() {
        this._foo = 'foo';

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
      }
    });

    var desc = Object.getOwnPropertyDescriptor(G, 'foo');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');

    var el = document.createElement('gettersetter-gremlin');
    document.body.appendChild(el);
  });

  it('uses mixins', function (done) {
    var called = 0;

    var Mixin = {
      foo: function foo() {
        called++;
      },

      Mixin1: 'Mixin1'
    };
    var Mixin2 = {
      foo: function foo() {
        called++;
      },

      Mixin2: 'Mixin2'
    };
    gremlins.create('g2-gremlin', {
      mixins: [Mixin, Mixin2],
      foo: function foo() {
        called++;
        if (called !== 3) {
          done(new Error('Mixins not called correctly'));
        }
      },
      attached: function attached() {
        this.foo();
        try {
          expect(this.el).to.be(el);
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
      attached: function attached() {
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

    this.timeout(5000);

    gremlins.findGremlin(el).then(function (component) {
      try {
        expect(component.el).to.equal(el);
        gremlins.findGremlin(el).then(function (componentInside) {
          try {
            expect(componentInside.el).to.equal(el);
            done();
          } catch (e) {
            done(e);
          }
        });
      } catch (e) {
        done(e);
      }
    });

    setTimeout(function () {
      gremlins.create('find-me', {});
      document.body.appendChild(el);
    }, 1000);
  });

  it('finds gremlins with the dom element but returns null if there is none if a timeout is set', function (done) {
    var el = document.createElement('find-me-not');

    this.timeout(5000);

    gremlins.findGremlin(el, 1000).then(function (component) {
      try {
        expect(component).to.be(null);
        done();
      } catch (e) {
        done(e);
      }
    });

    setTimeout(function () {
      gremlins.create('find-me-not', {});
      document.body.appendChild(el);
    }, 2000);
  });

  it('adds display block to all custom gremlin elements', function (done) {
    gremlins.create('display-test', {
      attached: function attached() {
        try {
          var style = window.getComputedStyle(this.el);
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
},{"../Gremlin":3,"../index":13}],7:[function(require,module,exports){
'use strict';

var GremlinElement = require('../GremlinElement');

describe('GremlinElement', function () {

  it('creates custom elements', function () {
    expect(GremlinElement.register).to.be.a('function');
    expect(function () {
      GremlinElement.register('foo');
      GremlinElement.register('foo-bar-without-spec');
    }).to.throw();

    var El = GremlinElement.register('gremlin-element-test-gremlin', {
      created: function created() {}
    });
    var el = document.createElement('gremlin-element-test-gremlin');
    expect(El).to.be.a('function');
    expect(el).to.be.a(HTMLElement);
    expect(el.tagName.toUpperCase()).to.equal('gremlin-element-test-gremlin'.toUpperCase());
  });
});
},{"../GremlinElement":4}],8:[function(require,module,exports){
'use strict';

var Mixins = require('../Mixins');

describe('Mixins', function () {

  it('mixes Mixins into objects', function () {
    var Module = {
      foo: function foo() {
        return 'foo';
      }
    };
    var G = {
      mixins: Module
    };

    Mixins.mixinProps(G);

    expect(G).to.have.property('foo');
    expect(G.foo()).to.equal('foo');
  });

  it('decorates exiting functions', function () {
    var fooCount = 0;

    var Module = {
      foo: function foo() {
        fooCount++;
      }
    };
    var G = {
      mixins: Module,
      foo: function foo() {
        fooCount++;
      }
    };

    Mixins.mixinProps(G);

    expect(G).to.have.property('foo');
    G.foo();
    expect(fooCount).to.equal(2);
  });

  it('does not change existing properties that are not functions', function () {
    var Module = {
      foo: 'foo2'
    };
    var G = {
      mixins: Module,
      foo: 'foo'
    };

    Mixins.mixinProps(G);

    expect(G).to.have.property('foo');
    expect(G.foo).to.equal('foo');
  });

  it('respects the order Mixins are included', function () {
    var fooStr = '';
    var Module = {
      foo: function foo() {
        fooStr += 'module1';
      }
    };
    var Module2 = {
      foo: function foo() {
        fooStr += 'module2';
      }
    };

    var G = {
      mixins: [Module, Module2],
      foo: function foo() {
        fooStr += 'gremlin';
      }
    };

    Mixins.mixinProps(G);
    G.foo();
    expect(fooStr).to.equal('module1module2gremlin');
  });

  it('supports mixins with getters and setters', function () {
    var Module = {
      get foo() {
        return this._foo || 'oldFoo';
      },
      set foo(val) {
        this._foo = val;
      }
    };

    var G = {
      mixins: Module
    };

    Mixins.mixinProps(G);
    var desc = Object.getOwnPropertyDescriptor(G, 'foo');
    expect(G).to.have.property('foo');
    expect(desc.get).to.be.a('function');
    expect(desc.set).to.be.a('function');
    expect(G.foo).to.be('oldFoo');

    G.foo = 'newFoo';
    expect(G.foo).to.be('newFoo');
    expect(G._foo).to.be('newFoo');
  });
});
},{"../Mixins":5}],9:[function(require,module,exports){
'use strict';

var gremlins = require('../index');
var Gremlin = require('../Gremlin');
describe('gremlins', function () {

	it('the namespace should exist', function () {
		expect(gremlins).to.be.an('object');
		expect(gremlins.create).to.be.a('function');
		expect(gremlins.findGremlin).to.be.a('function');
	});
});
},{"../Gremlin":3,"../index":13}],10:[function(require,module,exports){
'use strict';

require('./gremlins-tests');
require('./Gremlin-tests');
require('./Mixins-tests');
require('./GremlinElement-tests');
},{"./Gremlin-tests":6,"./GremlinElement-tests":7,"./Mixins-tests":8,"./gremlins-tests":9}],11:[function(require,module,exports){
(function (global){
'use strict';

/* eslint-disable no-console */
function noop() {}
var types = ['log', 'info', 'warn'];

module.exports = {
  create: function create() {
    if (console === undefined) {
      global.console = {};
    }
    types.forEach(function (type) {
      if (typeof console[type] !== 'function') {
        console[type] = noop();
      }
    });
  }
};
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],12:[function(require,module,exports){
'use strict';

/**
 * # gremlin.js
 * dead simple web components
 *
 * ## `gremlins`
 * The gremlin.js public namespace/module
 *
 */

/*!
 * Dependencies
 */
var consoleShim = require('./consoleShim');
var Gremlin = require('./Gremlin');
var Data = require('./Data');

// let's add a branding so we can't include more than one instance of gremlin.js
var BRANDING = 'gremlins_connected';

if (document.documentElement[BRANDING]) {
  throw new Error('You tried to include gremlin.js multiple times. This will not work');
}
consoleShim.create();

document.documentElement[BRANDING] = true;

module.exports = {
  /**
   * Creates a new gremlin specification.
   *
   * ### Example
   *     var gremlins = require('gremlins');
   *
   *     gremlins.create({
  *       name: 'Foo'
  *     });
   *
   * @param {Object} Spec The gremlin specification
   * @return {Object} The final spec created, later used as a prototype for new components of this
   * type
   * @method create
   * @api public
   */
  create: Gremlin.create.bind(Gremlin),
  findGremlin: function findGremlin(element, timeout) {
    return Data.getGremlinAsync(element, timeout);
  }
};
},{"./Data":1,"./Gremlin":3,"./consoleShim":11}],13:[function(require,module,exports){
'use strict';

/*!
 * The register element polyfill for older browsers
 *
 */

require('document-register-element');

module.exports = require('./gremlins');
},{"./gremlins":12,"document-register-element":15}],14:[function(require,module,exports){
"use strict";

// see https://gist.github.com/jed/982883
module.exports = function b(a) {
  return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, b); // eslint-disable-line max-len
};
},{}],15:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function rt(e,t){for(var n=0,r=e.length;n<r;n++)vt(e[n],t)}function it(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],nt(r,b[ot(r)])}function st(e){return function(t){j(t)&&(vt(t,e),rt(t.querySelectorAll(w),e))}}function ot(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!ut(n,t)?-1:r}function ut(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function at(e){var t=e.currentTarget,n=e.attrChange,r=e.attrName,i=e.target;Q&&(!i||i===t)&&t.attributeChangedCallback&&r!=="style"&&e.prevValue!==e.newValue&&t.attributeChangedCallback(r,n===e[a]?null:e.prevValue,n===e[l]?null:e.newValue)}function ft(e){var t=st(e);return function(e){X.push(t,e.target)}}function lt(e){K&&(K=!1,e.currentTarget.removeEventListener(h,lt)),rt((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&pt()}function ct(e,t){var n=this;q.call(n,e,t),G.call(n,{target:n})}function ht(e,t){D(e,t),et?et.observe(e,z):(J&&(e.setAttribute=ct,e[i]=Z(e),e.addEventListener(p,G)),e.addEventListener(c,at)),e.createdCallback&&Q&&(e.created=!0,e.createdCallback(),e.created=!1)}function pt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(n--,F.splice(t--,1),vt(e,o))}function dt(e){throw new Error("A "+e+" type is already registered")}function vt(e,t){var n,r=ot(e);-1<r&&(tt(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function mt(e){return e?(mt.prototype=e,new mt):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while((n=A(n))&&!N.call(n,t));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){J=!1,E.removeEventListener(c,W)},X,V=e.requestAnimationFrame||e.webkitRequestAnimationFrame||e.mozRequestAnimationFrame||e.msRequestAnimationFrame||function(e){setTimeout(e,10)},$=!1,J=!0,K=!0,Q=!0,G,Y,Z,et,tt,nt;O||M?(tt=function(e,t){N.call(t,e)||ht(e,t)},nt=ht):(tt=function(e,t){e[i]||(e[i]=n(!0),ht(e,t))},nt=tt),B?(J=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubbles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubbles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubbles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),J&&(G=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Z(t);for(s in r){if(!(s in n))return Y(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return Y(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return Y(2,t,s,n[s],r[s],l)}},Y=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,at(o)},Z=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){c=n.toUpperCase(),$||($=!0,P?(et=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o,u=0,a=r.length;u<a;u++)i=r[u],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,Q&&s.attributeChangedCallback&&i.attributeName!=="style"&&(o=s.getAttribute(i.attributeName),o!==i.oldValue&&s.attributeChangedCallback(i.attributeName,i.oldValue,o)))})}(st(s),st(o)),et.observe(t,{childList:!0,subtree:!0})):(X=[],V(function E(){while(X.length)X.shift().call(null,X.shift());V(E)}),t.addEventListener("DOMNodeInserted",ft(s)),t.addEventListener("DOMNodeRemoved",ft(o))),t.addEventListener(h,lt),t.addEventListener("readystatechange",lt),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=ut(i.toUpperCase(),n))),Q=!t.createElement.innerHTMLHelper,o&&nt(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=ot(t);return-1<n&&nt(t,b[n]),e&&it(t.querySelectorAll(w)),t}),-2<S.call(y,v+c)+S.call(y,d+c)&&dt(n);if(!m.test(c)||-1<S.call(g,c))throw new Error("The type "+n+" is invalid");var i=function(){return f?t.createElement(l,c):t.createElement(l)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():c,c,p;return f&&-1<S.call(y,d+l)&&dt(l),p=y.push((f?v:d)+c)-1,w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[p]=T.call(a,"prototype")?a.prototype:_(H),rt(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}],16:[function(require,module,exports){
/* eslint-disable no-unused-vars */
'use strict';
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}]},{},[10])(10)
});