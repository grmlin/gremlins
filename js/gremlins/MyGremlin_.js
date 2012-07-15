define(['gremlinjs/jQuery/gremlinEvents'], function (events) {
    var MyGremlin;
    MyGremlin = function (view, data, id) {
        this.view = view;
        this.data = data;
        this.id = id;
        this.view.html("Hello, world! :) <br>"+
            "I'm the MyGremlin-gremlin and the ##{@id}. gremlin in this page. <br>"+
            "Use <code>@data</code> to access the data-object of this gremlin.");
    };
    MyGremlin.prototype = {
        getName : function () {
            return this.data.gremlinName;
        },
        triggerChange : function () {
            return this.view.trigger(events.CONTENT_CHANGED, [this]);
        }
    };
    return MyGremlin;
});