(function() {
  var __hasProp = Object.prototype.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor; child.__super__ = parent.prototype; return child; };

  define(["gremlinjs/core/helper", "jquery", "gremlinjs/gremlins/AbstractGremlin", "text!/js/gremlins/lair/LairGremlin.js", "text!/js/gremlins/lair/LairGremlin.coffee"], function(helper, $, AbstractGremlin, LairGremlinJs, LairGremlinCoffee) {
    var Lair, gup, tpl;
    gup = function(name) {
      var regex, regexS, results;
      name = name.replace(/[\[]/, "\\\ [").replace(/[\]]/, "\\\]");
      regexS = "[\\?&]" + name + "=([^&#]*)";
      regex = new RegExp(regexS);
      results = regex.exec(window.location.href);
      if (results === null) {
        return "";
      } else {
        return results[1];
      }
    };
    tpl = function(template, model) {
      var key, value;
      for (key in model) {
        if (!__hasProp.call(model, key)) continue;
        value = model[key];
        template = template.replace(new RegExp('{{' + key + '}}', 'g'), value);
      }
      return template;
    };
    return Lair = (function(_super) {

      __extends(Lair, _super);

      Lair.PARAM_GREMLIN_NAME = "gremlinName";

      function Lair() {
        var getName,
          _this = this;
        Lair.__super__.constructor.apply(this, arguments);
        getName = gup(Lair.PARAM_GREMLIN_NAME);
        this._jForm = this.view.find('form');
        this._jPreview = this.view.find('.gremlin-preview');
        this._jName = this.view.find('input[name=gremlinName]');
        this._jName.val(getName);
        this._jForm.submit(function(e) {
          e.preventDefault();
          return _this._handleFormSubmit();
        });
        this.view.delegate('input[type=reset]', 'click', function() {
          return _this._clearPreview();
        });
        this.view.delegate('.gremlin-preview textarea', 'click', function() {
          return this.select();
        });
      }

      Lair.prototype._handleFormSubmit = function() {
        var name;
        name = this._jName.val();
        if (!helper.isEmptyString(name)) {
          return this._renderGremlin(name);
        } else {
          return this._jName.focus();
        }
      };

      Lair.prototype._renderGremlin = function(name) {
        var $previews, coffeeContent, coffeeFileUri, jsFileContent, jsFileUri;
        jsFileContent = tpl(LairGremlinJs, {
          name: name
        });
        coffeeContent = tpl(LairGremlinCoffee, {
          name: name
        });
        jsFileUri = "data:application/javascript;filename=" + name + ".js," + (encodeURIComponent(jsFileContent));
        coffeeFileUri = "data:application/javascript;filename=" + name + ".coffee," + (encodeURIComponent(coffeeContent));
        $previews = this._jPreview.children('div').slice(0, 2);
        $previews.html("");
        $previews.eq(0).append("<h2><a href=\"" + coffeeFileUri + "\">" + name + ".coffee</a></h2><pre><code><textarea rows=\"10\">" + coffeeContent + "</textarea></code></pre>");
        $previews.eq(1).append("<h2><a href=\"" + jsFileUri + "\">" + name + ".js</a></h2><pre><code><textarea rows=\"20\">" + jsFileContent + "</textarea></code></pre>");
        this._jPreview.show();
        this.view.addClass("submitted");
        return $('html,body').animate({
          scrollTop: this.view.find('.gremlin-preview').offset().top - 30
        });
      };

      Lair.prototype._clearPreview = function() {
        this._jPreview.children('div').slice(0, 2).html("");
        return this.view.removeClass("submitted");
      };

      return Lair;

    })(AbstractGremlin);
  });

}).call(this);
