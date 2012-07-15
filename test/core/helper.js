//TODO      extend, isMobile
define(["jquery", "lib/gremlinjs/core/helper"], function ($, helper) {
    return function () {
        module("gremlinjs/core/helper");
        test("isJquery", function () {
            ok(helper.isJquery($('body')), "$('body') is a jQuery object");
            ok(!helper.isJquery(window), "window is no jQuery object");
        });
        test("isUndefined", function () {
            var aVarThatsnotDefined, aVarThatsDefined = "null";
            ok(helper.isUndefined(aVarThatsnotDefined), "undefined variable is undefined");
            ok(helper.isUndefined(), "no parameter is undefined");
            ok(!helper.isUndefined(aVarThatsDefined), "null is not undefined");
            ok(!helper.isUndefined(""), "empty string is not undefined");
            ok(!helper.isUndefined(false), "false is not undefined");
        });
        test("isFunction", function () {
            var foo = function () {
            }, bar = {};
            ok(helper.isFunction(foo), "a function object is a function");
            ok(!helper.isFunction(bar), " an object is not a function");
        });
        test("isObject", function () {
            var foo = {}, bar = function () {
            };
            ok(helper.isObject(foo), "an empty object literal is an object");
            ok(!helper.isObject(null), "null is not an object");
            ok(!helper.isObject("String"), "a string is not an object");
            ok(!helper.isObject(), "undefined parameter is not an object");
            ok(!helper.isObject([1, 2]), "an array is not an object");
            ok(!helper.isObject(bar), " a function is not a object");
        });
        test("isNumber", function () {
            ok(helper.isNumber(1), "1 is a number");
            ok(!helper.isNumber("1"), "the string 1 is not a number");
            ok(!helper.isNumber(function () {
            }), "a function is not a number");
            ok(!helper.isNumber({}), "an object literal is not a number");
            ok(!helper.isNumber(), "undefined is not a number");
        });
        test("isString", function () {
            ok(helper.isString(""), "Empty string is a string");
            ok(helper.isString("Hello world"), "'Hello world' is a string");
            ok(!helper.isString(null), "'null' is not a string");
            ok(!helper.isString({foo: "bar"}), "an object is not a string");
            ok(!helper.isString(), "no parameter is not a string");
            ok(!helper.isString(true), "'true' is not a string");
            ok(!helper.isString(false), "'false' is not a string");
        });
        test("isEmptyString", function () {
            ok(helper.isEmptyString(""), "'' is an empty string");
            ok(!helper.isEmptyString("Hello world"), "'Hello World' is not an empty string");
            ok(!helper.isEmptyString(null), "'null' is not an empty string");
            ok(!helper.isEmptyString(true), "'true' is not an empty string");
            ok(!helper.isEmptyString(false), "'false' is not an empty string");
            ok(!helper.isEmptyString(), "no parameter is not an empty string");
            ok(!helper.isEmptyString(0), "0 is not an empty string");
        });
        test("mixin", function () {
            var Target = function () {
            },
                bar = {foo: "bar"},
                mixed;
            helper.mixin(Target, bar);
            mixed = new Target();
            ok(!helper.isUndefined(mixed.foo), "Mixed in object properties not undefined");
            strictEqual(bar.foo, mixed.foo, "Mixed in object property has the correct value");
            raises(function () {
                helper.mixin("astring", bar);
            }, "Only functions or objects may be used to mixin objects");
        });
        /* test("each", function () {
         var arr = ["a", "b", "c"],
         obj = {
         a: "a",
         b: "b",
         c: "c"
         },
         objRes = "",
         arrRes = "";
         helper.each(arr, function (value) {
         arrRes += value;
         });
         helper.each(obj, function (value, key) {
         objRes += value + key;
         });
         strictEqual(arrRes, "abc", "can iterate an array");
         strictEqual(objRes, "aabbcc", "can iterate an object");
         });*/
    }

});
