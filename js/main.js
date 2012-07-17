require.config({
    //baseUrl : "./",
    paths : {
        "jquery" : "jquery-1.7.1.min",
        "gremlinjs" : "gremlin.min"
    }
});

require(["gremlinjs"], function (gremlinjs) {
    'use strict';
    gremlinjs.getLoader("gremlins/").load();
});