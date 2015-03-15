(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.gremlins = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var Gremlin = {

	create: function create(spec) {
		var parent = this;
		Object.setPrototypeOf(spec, parent);
		return Object.create(spec);
	}

};

module.exports = Gremlin;

},{}],2:[function(require,module,exports){
"use strict";

var Gizmo = require("../Gremlin");

describe("Gizmo", function () {

	it("can create gremlin definitions", function () {

		var Gremlin = Gizmo.create({
			foo: function foo() {
				console.log("foo");
			}
		});
	});
});

},{"../Gremlin":1}]},{},[2])(2)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCIvVXNlcnMvYXcvRGV2L2dpdC9naXRodWIvZ3JtbGluL2dyZW1saW5zL2xpYi9HcmVtbGluLmpzIiwiL1VzZXJzL2F3L0Rldi9naXQvZ2l0aHViL2dybWxpbi9ncmVtbGlucy9saWIvX190ZXN0c19fL0dyZW1saW4tdGVzdHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0VBLElBQUksT0FBTyxHQUFHOztBQUViLE9BQU0sRUFBQSxnQkFBQyxJQUFJLEVBQUU7QUFDWixNQUFJLE1BQU0sR0FBRyxJQUFJLENBQUM7QUFDbEIsUUFBTSxDQUFDLGNBQWMsQ0FBQyxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQUM7QUFDcEMsU0FBTyxNQUFNLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDO0VBQzNCOztDQUVELENBQUM7O0FBRUYsTUFBTSxDQUFDLE9BQU8sR0FBRyxPQUFPLENBQUM7Ozs7O0FDWnpCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsQ0FBQzs7QUFFbEMsUUFBUSxDQUFDLE9BQU8sRUFBRSxZQUFVOztBQUczQixHQUFFLENBQUMsZ0NBQWdDLEVBQUUsWUFBWTs7QUFFaEQsTUFBSSxPQUFPLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQztBQUMxQixNQUFHLEVBQUEsZUFBRTtBQUNKLFdBQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUE7SUFDbEI7R0FDRCxDQUFDLENBQUM7RUFFSCxDQUFDLENBQUM7Q0FHSCxDQUFDLENBQUMiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiJ3VzZSBzdHJpY3QnO1xuXG52YXIgR3JlbWxpbiA9IHtcblxuXHRjcmVhdGUoc3BlYykge1xuXHRcdHZhciBwYXJlbnQgPSB0aGlzO1xuXHRcdE9iamVjdC5zZXRQcm90b3R5cGVPZihzcGVjLCBwYXJlbnQpO1xuXHRcdHJldHVybiBPYmplY3QuY3JlYXRlKHNwZWMpO1xuXHR9XG5cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gR3JlbWxpbjsiLCJ2YXIgR2l6bW8gPSByZXF1aXJlKCcuLi9HcmVtbGluJyk7XG5cbmRlc2NyaWJlKCdHaXptbycsIGZ1bmN0aW9uKCl7XG5cblxuXHRpdCgnY2FuIGNyZWF0ZSBncmVtbGluIGRlZmluaXRpb25zJywgZnVuY3Rpb24gKCkge1xuXG5cdFx0dmFyIEdyZW1saW4gPSBHaXptby5jcmVhdGUoe1xuXHRcdFx0Zm9vKCl7XG5cdFx0XHRcdGNvbnNvbGUubG9nKCdmb28nKVxuXHRcdFx0fVxuXHRcdH0pO1xuXG5cdH0pO1xuXG5cbn0pOyJdfQ==
