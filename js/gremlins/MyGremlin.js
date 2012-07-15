(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["gremlinjs/gremlins/AbstractGremlin"], function(AbstractGremlin) {
    var MyGremlin;
    return MyGremlin = (function(_super) {

      __extends(MyGremlin, _super);

      function MyGremlin() {
        MyGremlin.__super__.constructor.apply(this, arguments);
        this.view.html("Hello, world! :) <br>            I'm the MyGremlin-gremlin and the #" + this.id + ". gremlin in this page. <br>            Use <code>@data</code> to access the data-object of this gremlin.");
      }

      return MyGremlin;

    })(AbstractGremlin);
  });

}).call(this);
