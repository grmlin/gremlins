/*!gremlins.js 0.8.0 - (c) 2013-2015 Andreas Wehr - https://github.com/grmlin/gremlins - Licensed under MIT license*/
(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var uuid = require("./uuid");

var exp = "gremlins_" + uuid(),
    cache = {};

var gremlinId = (function () {
	var id = 1;
	return function () {
		return id++;
	};
})();

var hasId = function (element) {
	return element[exp] !== undefined;
},
    setId = function (element) {
	return element[exp] = gremlinId();
},
    getId = function (element) {
	return hasId(element) ? element[exp] : setId(element);
};

module.exports = {
	addGremlin: function addGremlin(gremlin, element) {
		var id = getId(element);

		if (cache[id] !== undefined) {
			console.warn("You can't add another gremlin to this element, it already uses one!", element);
		} else {
			cache[id] = gremlin;
		}
	},

	getGremlin: function getGremlin(element) {
		var id = getId(element),
		    gremlin = cache[id];

		if (gremlin === undefined) {
			console.warn("This dom element does not use any gremlins!", element);
		}
		return gremlin;
	}
};

},{"./uuid":8}],2:[function(require,module,exports){
"use strict";

function initialize(gremlin, element) {

	function init() {
		this.el = element;
		// call the constructor
		this.initialize();
	}

	init.call(gremlin);
}

module.exports = {
	createInstance: function createInstance(element, Spec) {
		//var Spec = Pool.get(name);
		//var name = Spec.name;
		//console.info(`Creating gremlin ${name}`, element);
		var gremlin = Object.create(Spec);
		initialize(gremlin, element);
		return gremlin;
	}
};

},{}],3:[function(require,module,exports){
"use strict";

var objectAssign = require("object-assign"),
    Mixins = require("./Mixins"),
    GremlinElement = require("./GremlinElement");

/**
 * ## `Gremlin`
 * The base prototype used for all gremlin components/specs
 *
 *
 */

/*!
 * All the Specs already added.
 *
 * Used to detect multi adds
 */
var specMap = {};

var addSpec = function (name, Spec) {
	return specMap[name] = Spec;
};
var hasSpec = function (name) {
	return specMap[name] !== undefined;
};

var Gremlin = {

	initialize: function initialize() {},

	destroy: function destroy() {},

	create: function create(Spec) {
		var Parent = this,
		    NewSpec = Object.create(Parent),
		    name = Spec.name;

		if (typeof name !== "string") {
			throw new Error("A gremlin spec needs a »name« property! It can't be found otherwise");
		}
		if (hasSpec(name)) {
			throw new Error("Trying to add new Gremlin spec, but a spec for " + name + " already exists.");
		}
		if (Spec.create !== undefined) {
			console.warn("You are replacing the original create method for the spec " + name + ". You know what you're doing, right?");
		}

		// set up the prototype chain
		objectAssign(NewSpec, Spec);
		// extend the spec with it's Mixins
		Mixins.mixinProps(NewSpec);
		// remember this name
		addSpec(name, NewSpec);
		// and create the custom element for it
		GremlinElement.register(NewSpec);
		return NewSpec;
	}

};

module.exports = Gremlin;

},{"./GremlinElement":4,"./Mixins":5,"object-assign":9}],4:[function(require,module,exports){
"use strict";

var Factory = require("./Factory"),
    Data = require("./Data");

var canRegisterElements = typeof document.registerElement === "function";

if (!canRegisterElements) {
	throw new Error("registerElement not available. Did you include the polyfill for older browsers?");
}

var addInstance = function addInstance(element, Spec) {
	var gremlin = Factory.createInstance(element, Spec);
	Data.addGremlin(gremlin, element);
};

var removeInstance = function removeInstance(element) {
	Data.getGremlin(element).destroy();
};

module.exports = {
	register: function register(Spec) {
		var name = Spec.name,
		    tagName = Spec.tagName,
		    hasTagName = typeof tagName === "string",
		    proto = {
			attachedCallback: {
				value: function value() {
					addInstance(this, Spec);
				}
			},
			detachedCallback: {
				value: function value() {
					removeInstance(this);
				}
			}
		};

		tagName = hasTagName ? tagName : name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase() + "-gremlin";

		var El = document.registerElement(tagName, {
			name: tagName,
			prototype: Object.create(HTMLElement.prototype, proto)
		});
		return El;
	}
};

},{"./Data":1,"./Factory":2}],5:[function(require,module,exports){
"use strict";

var getMixins = function (gremlin) {
	return Array.isArray(gremlin.mixins) ? gremlin.mixins : gremlin.mixins ? [gremlin.mixins] : [];
};

function mixinModule(gremlin, Module) {

	Object.keys(Module).forEach(function (propertyName) {
		var property = Module[propertyName];

		if (gremlin[propertyName] === undefined) {
			gremlin[propertyName] = property;
		} else {
			decorateProperty(gremlin, propertyName, property);
		}
	});
}
function decorateProperty(gremlin, propertyName, property) {
	var gremlinProperty = gremlin[propertyName],
	    moduleProperty = property,
	    gremlinPropertyType = typeof gremlinProperty,
	    modulePropertyType = typeof moduleProperty,
	    isSamePropType = gremlinPropertyType === modulePropertyType;

	if (isSamePropType && modulePropertyType === "function") {
		gremlin[propertyName] = function () {
			// call the module first
			return [moduleProperty.apply(this, arguments), gremlinProperty.apply(this, arguments)];
		};
	} else {
		console.warn("Can't decorate gremlin property »" + gremlin.name + "#" + propertyName + ":" + gremlinPropertyType + "« with »Module#" + propertyName + ":" + modulePropertyType + "«.\n\t\tOnly functions can be decorated!");
	}
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

},{}],6:[function(require,module,exports){
(function (global){
"use strict";

var noop = function noop() {};
var types = ["log", "info", "warn"];
module.exports = {
	create: function create() {
		if (console === undefined) {
			global.console = {};
		}
		types.forEach(function (type) {
			if (typeof console[type] !== "function") {
				console[type] = noop();
			}
		});
	}
};

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}],7:[function(require,module,exports){
"use strict";

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
var consoleShim = require("./consoleShim"),
    Gremlin = require("./Gremlin");

// let's add a branding so we can't include more than one instance of gremlin.js
var BRANDING = "gremlins_connected";

if (document.documentElement[BRANDING]) {
  throw new Error("You tried to include gremlin.js multiple times. This will not work");
}
consoleShim.create();

document.documentElement[BRANDING] = true;

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
 * @return {Object} The final spec created, later used as a prototype for new components of this type
 * @method create
 * @api public
 */
exports.create = Gremlin.create;

},{"./Gremlin":3,"./consoleShim":6}],8:[function(require,module,exports){
"use strict";

module.exports = function b(a) {
	return a ? (a ^ Math.random() * 16 >> a / 4).toString(16) : ([10000000] + -1000 + -4000 + -8000 + -100000000000).replace(/[018]/g, b);
};
// see https://gist.github.com/jed/982883

},{}],9:[function(require,module,exports){
'use strict';

function ToObject(val) {
	if (val == null) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

module.exports = Object.assign || function (target, source) {
	var from;
	var keys;
	var to = ToObject(target);

	for (var s = 1; s < arguments.length; s++) {
		from = arguments[s];
		keys = Object.keys(Object(from));

		for (var i = 0; i < keys.length; i++) {
			to[keys[i]] = from[keys[i]];
		}
	}

	return to;
};

},{}],10:[function(require,module,exports){
/*! (C) WebReflection Mit Style License */
(function(e,t,n,r){"use strict";function et(e,t){for(var n=0,r=e.length;n<r;n++)ct(e[n],t)}function tt(e){for(var t=0,n=e.length,r;t<n;t++)r=e[t],Z(r,b[rt(r)])}function nt(e){return function(t){j(t)&&(ct(t,e),et(t.querySelectorAll(w),e))}}function rt(e){var t=e.getAttribute("is"),n=e.nodeName.toUpperCase(),r=S.call(y,t?v+t.toUpperCase():d+n);return t&&-1<r&&!it(n,t)?-1:r}function it(e,t){return-1<w.indexOf(e+'[is="'+t+'"]')}function st(e){var t=e.currentTarget,n=e.attrChange,r=e.prevValue,i=e.newValue;t.attributeChangedCallback&&e.attrName!=="style"&&t.attributeChangedCallback(e.attrName,n===e[a]?null:r,n===e[l]?null:i)}function ot(e){var t=nt(e);return function(e){t(e.target)}}function ut(e){$&&($=!1,e.currentTarget.removeEventListener(h,ut)),et((e.target||t).querySelectorAll(w),e.detail===o?o:s),B&&lt()}function at(e,t){var n=this;q.call(n,e,t),J.call(n,{target:n})}function ft(e,t){D(e,t),G?G.observe(e,z):(V&&(e.setAttribute=at,e[i]=Q(e),e.addEventListener(p,J)),e.addEventListener(c,st)),e.createdCallback&&(e.created=!0,e.createdCallback(),e.created=!1)}function lt(){for(var e,t=0,n=F.length;t<n;t++)e=F[t],E.contains(e)||(F.splice(t,1),ct(e,o))}function ct(e,t){var n,r=rt(e);-1<r&&(Y(e,b[r]),r=0,t===s&&!e[s]?(e[o]=!1,e[s]=!0,r=1,B&&S.call(F,e)<0&&F.push(e)):t===o&&!e[o]&&(e[s]=!1,e[o]=!0,r=1),r&&(n=e[t+"Callback"])&&n.call(e))}if(r in t)return;var i="__"+r+(Math.random()*1e5>>0),s="attached",o="detached",u="extends",a="ADDITION",f="MODIFICATION",l="REMOVAL",c="DOMAttrModified",h="DOMContentLoaded",p="DOMSubtreeModified",d="<",v="=",m=/^[A-Z][A-Z0-9]*(?:-[A-Z0-9]+)+$/,g=["ANNOTATION-XML","COLOR-PROFILE","FONT-FACE","FONT-FACE-SRC","FONT-FACE-URI","FONT-FACE-FORMAT","FONT-FACE-NAME","MISSING-GLYPH"],y=[],b=[],w="",E=t.documentElement,S=y.indexOf||function(e){for(var t=this.length;t--&&this[t]!==e;);return t},x=n.prototype,T=x.hasOwnProperty,N=x.isPrototypeOf,C=n.defineProperty,k=n.getOwnPropertyDescriptor,L=n.getOwnPropertyNames,A=n.getPrototypeOf,O=n.setPrototypeOf,M=!!n.__proto__,_=n.create||function ht(e){return e?(ht.prototype=e,new ht):this},D=O||(M?function(e,t){return e.__proto__=t,e}:L&&k?function(){function e(e,t){for(var n,r=L(t),i=0,s=r.length;i<s;i++)n=r[i],T.call(e,n)||C(e,n,k(t,n))}return function(t,n){do e(t,n);while(n=A(n));return t}}():function(e,t){for(var n in t)e[n]=t[n];return e}),P=e.MutationObserver||e.WebKitMutationObserver,H=(e.HTMLElement||e.Element||e.Node).prototype,B=!N.call(H,E),j=B?function(e){return e.nodeType===1}:function(e){return N.call(H,e)},F=B&&[],I=H.cloneNode,q=H.setAttribute,R=H.removeAttribute,U=t.createElement,z=P&&{attributes:!0,characterData:!0,attributeOldValue:!0},W=P||function(e){V=!1,E.removeEventListener(c,W)},X=!1,V=!0,$=!0,J,K,Q,G,Y,Z;O||M?(Y=function(e,t){N.call(t,e)||ft(e,t)},Z=ft):(Y=function(e,t){e[i]||(e[i]=n(!0),ft(e,t))},Z=Y),B?(V=!1,function(){var e=k(H,"addEventListener"),t=e.value,n=function(e){var t=new CustomEvent(c,{bubles:!0});t.attrName=e,t.prevValue=this.getAttribute(e),t.newValue=null,t[l]=t.attrChange=2,R.call(this,e),this.dispatchEvent(t)},r=function(e,t){var n=this.hasAttribute(e),r=n&&this.getAttribute(e),i=new CustomEvent(c,{bubles:!0});q.call(this,e,t),i.attrName=e,i.prevValue=n?r:null,i.newValue=t,n?i[f]=i.attrChange=1:i[a]=i.attrChange=0,this.dispatchEvent(i)},s=function(e){var t=e.currentTarget,n=t[i],r=e.propertyName,s;n.hasOwnProperty(r)&&(n=n[r],s=new CustomEvent(c,{bubles:!0}),s.attrName=n.name,s.prevValue=n.value||null,s.newValue=n.value=t[r]||null,s.prevValue==null?s[a]=s.attrChange=0:s[f]=s.attrChange=1,t.dispatchEvent(s))};e.value=function(e,o,u){e===c&&this.attributeChangedCallback&&this.setAttribute!==r&&(this[i]={className:{name:"class",value:this.className}},this.setAttribute=r,this.removeAttribute=n,t.call(this,"propertychange",s)),t.call(this,e,o,u)},C(H,"addEventListener",e)}()):P||(E.addEventListener(c,W),E.setAttribute(i,1),E.removeAttribute(i),V&&(J=function(e){var t=this,n,r,s;if(t===e.target){n=t[i],t[i]=r=Q(t);for(s in r){if(!(s in n))return K(0,t,s,n[s],r[s],a);if(r[s]!==n[s])return K(1,t,s,n[s],r[s],f)}for(s in n)if(!(s in r))return K(2,t,s,n[s],r[s],l)}},K=function(e,t,n,r,i,s){var o={attrChange:e,currentTarget:t,attrName:n,prevValue:r,newValue:i};o[s]=e,st(o)},Q=function(e){for(var t,n,r={},i=e.attributes,s=0,o=i.length;s<o;s++)t=i[s],n=t.name,n!=="setAttribute"&&(r[n]=t.value);return r})),t[r]=function(n,r){p=n.toUpperCase(),X||(X=!0,P?(G=function(e,t){function n(e,t){for(var n=0,r=e.length;n<r;t(e[n++]));}return new P(function(r){for(var i,s,o=0,u=r.length;o<u;o++)i=r[o],i.type==="childList"?(n(i.addedNodes,e),n(i.removedNodes,t)):(s=i.target,s.attributeChangedCallback&&i.attributeName!=="style"&&s.attributeChangedCallback(i.attributeName,i.oldValue,s.getAttribute(i.attributeName)))})}(nt(s),nt(o)),G.observe(t,{childList:!0,subtree:!0})):(t.addEventListener("DOMNodeInserted",ot(s)),t.addEventListener("DOMNodeRemoved",ot(o))),t.addEventListener(h,ut),t.addEventListener("readystatechange",ut),t.createElement=function(e,n){var r=U.apply(t,arguments),i=""+e,s=S.call(y,(n?v:d)+(n||i).toUpperCase()),o=-1<s;return n&&(r.setAttribute("is",n=n.toLowerCase()),o&&(o=it(i.toUpperCase(),n))),o&&Z(r,b[s]),r},H.cloneNode=function(e){var t=I.call(this,!!e),n=rt(t);return-1<n&&Z(t,b[n]),e&&tt(t.querySelectorAll(w)),t});if(-2<S.call(y,v+p)+S.call(y,d+p))throw new Error("A "+n+" type is already registered");if(!m.test(p)||-1<S.call(g,p))throw new Error("The type "+n+" is invalid");var i=function(){return t.createElement(l,f&&p)},a=r||x,f=T.call(a,u),l=f?r[u].toUpperCase():p,c=y.push((f?v:d)+p)-1,p;return w=w.concat(w.length?",":"",f?l+'[is="'+n.toLowerCase()+'"]':l),i.prototype=b[c]=T.call(a,"prototype")?a.prototype:_(H),et(t.querySelectorAll(w),s),i}})(window,document,Object,"registerElement");
},{}]},{},[10,7])(10)
});