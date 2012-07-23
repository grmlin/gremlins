define(['gremlinjs'], function (gremlinjs) {
    var G = gremlinjs.create("G", {
        interests : ["OUCH"],
        initialize : function () {
        },
        inform : function (interest, notificationData) {
            this.content.html("poor boy");
        }
    });
    return G;
});