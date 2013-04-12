GremlinJS.define("Buddy", {
    elements: {
        "div.content": "content"
    },
    interests: {
        'FOO': 'onFoo'
    },
    initialize: function () {
        this.content[0].innerHTML = "<h1>I'm listening!</h1>";
        this.$content.fadeTo(0, 0).fadeTo(500, 1);
    },
    onFoo: function (data) {
        console.dir(data);
        this.$content.after('Holly talked!')
    }
});