define(["gremlinjs"], function (gremlinjs) {
    var A = gremlinjs.Gremlin.extend("A", {
        elements     : {
            ".content h1" : "content"
        },
        events       : {
           "click .content h1": "_handleClick"
        },
        initialize   : function () {
        },
        _handleClick : function () {
            console.log("Chattering");
            this.chatter("B");
            this.chatter("C");
        }
    }, {
        extensions : [gremlinjs.extensions.JQUERY]
    });
    return A;
});