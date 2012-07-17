define(['gremlinjs'], function (gremlinjs) {
    var HelloWorld = gremlinjs.create("HelloWorld", {
        elements : {
            "content" : ".content"
        },
        events : {
            "_handleClick" : "click .content h1"
        },
        initialize : function () {
            this.content.html("<h1>Hello World!</h1>");
        },
        _handleClick : function () {
            this.content.html("<h2>OUCH</h2>");
        }
    });
    return HelloWorld;
});