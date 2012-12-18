define(["gremlinjs"], function (gremlinjs) {
    var HelloWorld = gremlinjs.Gremlin.extend("HelloWorld", {
        elements     : {
            ".content" : "content"
        },
        events       : {
           "click .content h1": "_handleClick"
        },
        initialize   : function () {
            this.content[0].innerHTML = "<h1>Hello World!</h1>";
            console.dir(this.$content)
        },
        _handleClick : function () {
            this.content[0].innerHTML = "<h1>OUCH</h1>";
        }
    }, {
        extensions : [gremlinjs.extensions.ZEPTO]
    });
    return HelloWorld;
});