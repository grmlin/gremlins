define([
    "lib/gremlinjs/core/helper",
    "lib/gremlinjs/event/EventDispatcher"
], function (helper, EventDispatcher) {
    return function () {
        module("gremlinjs/event/EventDispatcher");

        var MyDispatcher = function () {
        };
        helper.mixin(MyDispatcher, EventDispatcher);
        var EVENT = "anEvent";
        stop();
        asyncTest("event dispatches", function () {
            expect(2);
            var observed = new MyDispatcher();
            observed.bind(EVENT, function (event) {
                ok(true, "Event was catched");
                equal(event.foo, 'bar', "Event object passed in correctly");
                start();
            });
            observed.dispatch(EVENT, {
                foo: 'bar'
            });
        });
        stop();
        asyncTest("events can be removed", 3,function () {
            var c = 0;
            var t = function(){
                c++;
                if (c === 3){
                    start();
                }
            }
            var observed = new MyDispatcher(),

                Klasse, k1, k2,
                cbOne = function (event) {
                    ok(true, "one Event was catched");
                    t();
                },
                cbTwo = function (event) {
                    ok(true, "another was still catched");
                    t();
                };
            Klasse = function (name) {
                this.name = name;
                observed.bind(EVENT, this.cb, this);
            };
            Klasse.prototype = {
                cb: function () {
                    ok(this.name !== 2, "Correct event was catched");
                    t();
                },
                shutUp: function () {
                    observed.unbind(EVENT, this.cb, this);
                }
            };
            k1 = new Klasse(1);
            k2 = new Klasse(2);
            observed.bind(EVENT, cbOne);
            observed.bind(EVENT, cbTwo);
            k2.shutUp();
            observed.dispatch(EVENT);
            observed.unbind(EVENT);//remove the rest
            observed.dispatch(EVENT);
        });
        test("can test for event listeners of a given type", function () {
            var observed = new MyDispatcher();
            observed.bind(EVENT, function () {
            });
            ok(observed.hasEventListener(EVENT), "There are listeners for event " + EVENT);
            observed.unbind(EVENT);
            ok(!observed.hasEventListener(EVENT), "There are no listeners anymore")
        });
    }

});