define(["gremlinjs"], function (gremlinjs) {
    var C = gremlinjs.Gremlin.extend("C", {
        elements  : {
            ".content ul" : "li"
        },
        interests : ["C"],
        inform    : function (interest, notificationData) {
            if (interest === "C") {
                this.$li.append("<li><p>C chattered</p></li>")
            }
        }
    }, {
        extensions : [gremlinjs.extensions.JQUERY]
    });
    return C;
});