define(['gremlinjs'], function (gremlinjs) {
    var HelloWorld = gremlinjs.create("HelloWorld", {
        elements: {
            "content": "div.content"
        },
        events: {
            "handleClick": "click div.content h1"
        },
        initialize:function () {
            this.content.html("<h1>Hello World!</h1>");
        },
        handleClick: function(){
            this.content.html("ouch");
            this.chatter("OUCH")
            this.triggerChange()
        }
    });
    return HelloWorld;
});