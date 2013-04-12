GremlinJS.define("Buddy", {
    elements : {
        "div.content" : "content"
    },
    interests : ["OUCH"],
    initialize : function () {
        this.content.html("<h1>I'm watching you!</h1>");
    },
    inform : function (interest, notificationData) {
        this.content.html("poor boy");
    }
});