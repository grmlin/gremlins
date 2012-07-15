define(['gremlinjs/jQuery/gremlinEvents'], function (events) {
    var {{name}};
    {{name}} = function (view, data, id) {
        this.view = view;
        this.data = data;
        this.id = id;
        this.view.html("Hello, world! :) <br>"+
                       "I'm the {{name}}-gremlin and the ##{@id}. gremlin in this page. <br>"+
                       "Use <code>@data</code> to access the data-object of this gremlin.");
    };
    {{name}}.prototype = {
        getName : function () {
            return this.data.gremlinName;
        },
        triggerChange : function () {
            return this.view.trigger(events.CONTENT_CHANGED, [this]);
        }
    };
    return {{name}};
});