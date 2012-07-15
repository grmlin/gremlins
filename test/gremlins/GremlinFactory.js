define([
    "jquery",
    "lib/gremlinjs/gremlins/GremlinFactory"
], function ($, factory) {
    return function () {
        module("gremlinjs/gremlins/GremlinFactory");
        asyncTest("creates gremlins", 2, function () {
            var container = document.createElement("div");
            factory.createGremlin("test/_gremlinClasses/test", $(container), function (gremlin) {
                ok(true, "gremlin loaded!");
                strictEqual(gremlin.foo, "bar", "Gremlin created");
                start();
            });
        });
        asyncTest("Fails, if the gremlin returned isn't a function", 2, function () {
            var container = document.createElement("div");
            var gremlinName = "test/_gremlinClasses/test_fail";
            factory.createGremlin(gremlinName, $(container), function (gremlin) {
            }, function (name, message) {
                ok(true, "creating a non function gremlin failed");
                strictEqual(name, gremlinName);
                start();
            });
        });

    }
});