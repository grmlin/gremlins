require.config({
    baseUrl : "./",
    paths : {
        "jquery" : "js/jquery-1.7.1.min",
        "gremlinjs" : "js/gremlin.min"
    }
});

require(["gremlinjs"], function (gremlinjs) {
    'use strict';
    gremlinjs.getLoader("js/gremlins/").load();
});