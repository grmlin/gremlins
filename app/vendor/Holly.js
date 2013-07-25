var Holly = GremlinJS.define("Holly",
  function () {
    this.content[0].innerHTML = "<h1>I'm talking! Click me</h1>";
    this.$content.fadeTo(0, 0).fadeTo(500, 1);
  },
  {

    onClick: function () {
      this.emit("FOO", {foo: 'bar'})
    }
  },
  {
    FOO: "bar",
    elements: {
      "div.content": "content"
    },
    $events: {
      "click div.content": 'onClick'
    },
    $elements: {
      "div.content": "$content"
    }

  });