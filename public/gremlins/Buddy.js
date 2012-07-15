define(['gremlinjs'], function (gremlinjs) {
    var Buddy = gremlinjs.create("Buddy", {
        elements:{
            "div.content":"content"
        },
        events:{
            "click div.content h1":function () {
                this.content.html("ouch")
            }
        },
        interests:["OUCH"],
        initialize:function () {
            this.content.html("<h1>I'm watching you!</h1>");
        },
        inform:function (interest, notificationData) {
            this.content.html("poor boy");
        }
    });
    return Buddy;
});