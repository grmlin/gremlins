define([
    "jquery",
    "gremlinjs/gremlins/AbstractGremlin"
], function ($, AbstractGremlin) {
    return function () {
        module("gremlinjs/gremlins/AbstractGremlin");
        var gremlin, $gremlin;
        $gremlin = $("<div id='mygremlin'></div>");
        $('body').append($gremlin);
        gremlin = new AbstractGremlin($gremlin, $gremlin.data(), 0);
        test("The AbstractGremlins constants are there", function () {
            strictEqual(typeof AbstractGremlin.NOTIFICATION, "string", "notification event name");
            strictEqual(typeof AbstractGremlin.CONTENT_CHANGED, "string", "content changed event name");
        });
        test("The gremlin has default properties", function () {
            deepEqual(gremlin.klass, AbstractGremlin, "reference to AbstractGremlin class exists");
            strictEqual(typeof gremlin.view, "object", "gremlin.view is an object");
            strictEqual(typeof gremlin.view.jquery, "string", "gremlin.view is an jquery object");
            strictEqual(gremlin.view.attr("id"), $gremlin.attr("id"), "gremlin.view references the correct jquery object");
            deepEqual(gremlin.data, $gremlin.data(), "gremlin.data is the correct data object");
            strictEqual(gremlin.id, 0, "gremlin.id is the correct id");
        });
        test("gremlins have a name", 1, function () {
            strictEqual(typeof gremlin.name, "string", "the gremlins name is a string");
        });

    }

});