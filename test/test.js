QUnit.config.autostart = true;
require([
    "gremlinjs",//include gremlinjs once so we have no dependency trouble later
    "core/helper.js",
    "event/EventDispatcher",
    "gremlins/GremlinLair",
    "gremlins/GremlinFactory"
], function () {
    for (var i = 1, l=arguments.length;i<l;i+=1){
        arguments[i]()
    }
});
/*
require([
    "test/core/helper",
    "test/event/EventDispatcher",

    "test/gremlins/Loader"
], function () {
    QUnit.start();
    for (var i = 0, l=arguments.length;i<l;i+=1){
        arguments[i]()
    }
});*/
