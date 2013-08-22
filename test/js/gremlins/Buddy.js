GremlinJS.define("Buddy", function () {
  $(this.el).find('.content').html("<h1>Hello World, Buddy here!</h1>").fadeTo(0, 0).fadeTo(500, 1);
});