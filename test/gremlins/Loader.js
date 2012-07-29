define(["gremlinjs/gremlins/Loader", "gremlinjs/gremlins/GremlinLair", "jquery"], function (Loader, Lair, $) {
    return function () {
        module("gremlinjs/gremlins/Loader");

        define("test_gremlins/gremlin1", ['gremlinjs'], function (gremlinjs) {
            var c = 0;
            return Lair.create("aname", {
                initialize : function () {
                    c++;
                    ok(true, "Gremlin loaded");
                    if (c === 2) {
                        c = 0;
                        start();
                    } else {
                        $(window).scrollTop($(document).height());
                    }
                    this.view.remove();
                }
            });

        });
        define("test_gremlins/gremlin2", ['gremlinjs'], function (gremlinjs) {
            var c = 0;
            return Lair.create("aname", {
                initialize : function () {
                    throw Error("Should not be loaded");
                }
            });

        });
        define("test_gremlins/gremlin3", ['gremlinjs'], function (gremlinjs) {
            var c = 0;
            return Lair.create("aname", {
                initialize : function () {
                    ok(true, "Gremlin loaded");
                    start();
                }
            });

        });


        asyncTest("Loader loads gremlins", 2, function () {
            var loader = new Loader('test_gremlins/', 'gremlin');
            var $gremlin = $('<div class="gremlin" style="height: 10000px" data-gremlin-name="gremlin1"></div>');
            var $lazygremlin = $('<div class="gremlin" data-lazy-load="true" data-gremlin-name="gremlin1"></div>');
            $('body').append($gremlin);
            $('body').append($lazygremlin);
            loader.load();
        });
        asyncTest("Loader loads gremlins inside a specific element", 2, function () {
            var loader = new Loader('test_gremlins/', 'gremlin');
            var $gremlin = $('<div class="gremlin" style="height: 10000px" data-gremlin-name="gremlin1"></div>');
            var $lazygremlin = $('<div class="gremlin" data-lazy-load="true" data-gremlin-name="gremlin1"></div>');
            var $badgremlin = $('<div class="gremlin" data-gremlin-name="gremlin2"></div>');
            $('body').append('<div id="foo"></div>');
            $('#foo').append($gremlin);
            $('#foo').append($lazygremlin);
            $('body').append($badgremlin);
            loader.load($('#foo'));
        });
        asyncTest("Resetting lazy loaded gremlins", 2, function () {
            $('#foo').remove();
            $('.gremlin').remove();
            var loader = new Loader('test_gremlins/', 'gremlin');
            var $lazygremlin = $('<div id="bar" class="gremlin" data-lazy-load="true" data-gremlin-name="gremlin3"></div>');
            $('body').prepend($lazygremlin);
            $('body').prepend('<div id="foo" style="height: 10000px;"></div>');
            loader.load();
            ok(!$('#bar').hasClass("gremlin-loading"), "Gremlin not yet loading");
            $('#foo').remove();
            $(window).scrollTop(0);
            loader.resetLazyGremlins();
        });
    };
});