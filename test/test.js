QUnit.config.autostart = false;
require([
    "test/core/helper",
    "test/event/EventDispatcher",
    "test/gremlins/GremlinFactory",
    "test/gremlins/Loader"
], function () {
    QUnit.start();
    for (var i = 0, l=arguments.length;i<l;i+=1){
        arguments[i]()
    }
});