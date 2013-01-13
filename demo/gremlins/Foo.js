define(["gremlinjs"], function (gremlinjs) {
    var HelloWorld = gremlinjs.AbstractGremlin.extend("HelloWorld", {
        elements     : {
            ".content" : "content"
        },
        events       : {
           "click .content h1": "_handleClick"
        },
        initialize   : function () {
            this.$content.html("<h1>Hello World!</h1>")
            console.dir(this.$content)
        },
        _handleClick : function () {
            this.$content.html("<h1>OUCH</h1>");
        }
    }, {
        extensions : [gremlinjs.extensionTypes.JQUERY]
    });
    return HelloWorld;
});