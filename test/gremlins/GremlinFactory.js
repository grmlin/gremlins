define([
    "jquery",
    "gremlinjs/gremlins/GremlinFactory"
], function ($, factory) {
    return function () {
        module("gremlinjs/gremlins/GremlinFactory");
        asyncTest("creates gremlins", 2, function () {
            factory.createGremlin("_gremlinClasses/test", $('<div>foo</div>'), function (gremlin) {
                ok(true, "gremlin loaded!");
                strictEqual(gremlin.view.text(), "foo", "Gremlin created");
                start();
            });
        });
        asyncTest("Fails, if the gremlin returned isn't a function", 2, function () {
            factory.createGremlin("_gremlinClasses/test_fail", $('<div></div>'), function (gremlin) {
            });
            factory.error = function (name) {
                ok(true, "create error fetched.");
                strictEqual(name, "_gremlinClasses/test_fail", "the correct gremlin failed");
                start();
            };
        });

    }
});