define(["gremlinjs"], function (gremlinjs) {
    var B = gremlinjs.AbstractGremlin.extend("B", {
        elements  : {
            ".content ul" : "li"
        },
        interests : ["B"],
        inform    : function (interest, notificationData) {
            if (interest === "B") {
                this.$li.append("<li><p>B chattered</p></li>")
            }
        }
    }, {
        extensions : [gremlinjs.extensionTypes.JQUERY]
    });
    return B;
});