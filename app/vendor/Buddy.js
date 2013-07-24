GremlinJS.define("Buddy", function () {
        this.content[0].innerHTML = "<h1>I'm listening!</h1>";
        this.$content.fadeTo(0, 0).fadeTo(500, 1);
    },
    {
        elements: {
            "div.content": "content"
        },
        
        onFoo: function (data) {
            console.dir(data);
            this.$content.after('Holly talked!')
        }
    },
    {
        interests: {
            'FOO': 'onFoo'
        },
        BUDDY: 'HOLLY'
    }
);