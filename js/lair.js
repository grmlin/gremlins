require.config({
    baseUrl: "./",
    paths: {
        "jquery": "js/jquery-1.7.1.min",
        "text":"js/text",
        "gremlinjs/gremlins/Loader": "js/gremlinjs_min",
        "gremlinjs/core/helper":"js/gremlinjs_min"
    }
});

require(['jquery', 'gremlinjs/gremlins/Loader'], function ($, Loader) {
    'use strict';
    var myLoader = new Loader("js/gremlins/");
    myLoader.load();
});