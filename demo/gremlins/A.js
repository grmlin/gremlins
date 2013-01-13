define(["gremlinjs"], function (gremlinjs) {
    var A = gremlinjs.AbstractGremlin.extend("A", {
        elements     : {
            ".content h1" : "content"
        },
        events       : {
           "click .content h1": "_handleClick"
        },
        initialize   : function () {
            console.log("Gremlin A initialized")
        },
        _handleClick : function () {
            console.log("Chattering");
            this.chatter("B");
            this.chatter("C");
        }
    }, {
        extensions : [gremlinjs.extensionTypes.JQUERY]
    });
    return A;
});