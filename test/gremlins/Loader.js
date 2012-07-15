define(["lib/gremlinjs/gremlins/Loader", "jquery", "lib/gremlinjs/event/eventTypes"], function (Loader, $) {
    //TODO test all code
    return function () {
        module("gremlinjs/gremlins/Loader");
        test("Loader is a constructor function", 2, function () {
            var loader = new Loader();
            ok(loader instanceof Loader, "instantiated loader");

            raises(function () {
                loader = Loader();
            }, "instantiation failed");
        });
        asyncTest("Loader loads gremlins", 2, function () {
            var c = 0;
            var t = function () {
                c++;
                if (c === 2) {
                    $gremlin.remove();
                    $lazygremlin.remove();
                    start();
                }else {
                    $(window).scrollTop(10000);
                    loader.bind(Loader.LOAD,function(event){
                        ok(true, "gremlin lazy loaded and event fired by loader");
                        t();
                    });
                }
            }

            var loader = new Loader('test/_gremlinClasses/');
            var $gremlin = $('<div class="gremlin" style="height: 10000px" data-gremlin-name="test"></div>');
            var $lazygremlin = $('<div class="gremlin" data-lazy-load="true" style="height: 10000px" data-gremlin-name="test"></div>');
            loader.bind(Loader.LOAD,function(event){
                loader.unbind(Loader.LOAD);
                ok(true, "gremlin loaded and event fired by loader");
                t();
            });
            $('body').append($gremlin);
            $('body').append($lazygremlin);
            loader.load();
        });
        asyncTest("Loader static methods",5, function(){
            var c = 0;
            var t = function () {
                c++;
                console.log(Loader.getAllGremlins().length)
                ok(Loader.getAllGremlins().length === c, "Loader returns gremlins from all Loader instances");
                if (c === 2) {
                    start();
                    $gremlin1.remove();
                    $gremlin2.remove();
                }
            }


            var loader1 = new Loader('test/_gremlinClasses/');
            var loader2 = new Loader('test/_gremlinClasses2/',"gremlin2");
            var $gremlin1 = $('<div id="one" class="gremlin" data-gremlin-name="test"></div>');
            var $gremlin2 = $('<div id="two" class="gremlin2" data-gremlin-name="test2"></div>');
            loader1.bind(Loader.LOAD,function(event){
                ok(Loader.getGremlinDomContainer(event.gremlin).attr("id") === "one","Loader returns the gremlins jquery object");
                ok(Loader.getGremlinName(event.gremlin) === "test","Loader returns the gremlin name");
                t();
            });
            loader2.bind(Loader.LOAD,function(event){
                ok(Loader.getGremlinName(event.gremlin) === "test2","Loader returns the gremlin name");
                t();
            });

            $('body').append($gremlin1);
            $('body').append($gremlin2);
            loader1.load();
            loader2.load();
        });
    };
});