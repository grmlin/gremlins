define(['gremlinjs'], function (gremlinjs) {
    var HelloWorld = gremlinjs.create("HelloWorld", {
        elements: {
            "div.content": "content"
        },
        events: {
            "click div.content h1": function(){
                this.content.html("ouch");
                this.chatter("OUCH")
                this.triggerChange()
            }
        },
        initialize:function () {
            this.content.html("<h1>Hello World!</h1>");
        }
    });
    return HelloWorld;
});