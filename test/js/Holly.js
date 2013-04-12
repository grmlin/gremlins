GremlinJS.define("Holly", {
    elements : {
        "div.content" : "content"
    },
    events : {
        "click div.content": 'onClick'
    },
    initialize : function () {
        this.content[0].innerHTML = "<h1>I'm talking! Click me</h1>";
        this.$content.fadeTo(0,0).fadeTo(500,1);
    },
    onClick: function(){
        this.emit("FOO", {foo:'bar'})
    }
});