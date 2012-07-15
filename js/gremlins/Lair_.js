/*global define, window*/
define(["gremlinjs/core/helper", "jquery"], function (helper, $) {
    'use strict';
    var gup = function (name) {
            name = name.replace(/[\[]/, "\\\ [").replace(/[\]]/, "\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)",
                regex = new RegExp(regexS),
                results = regex.exec(window.location.href);
            if (results === null) {
                return "";
            } else {
                return results[1];
            }
        },
        tpl = function (template, model) {
            helper.each(model, function (value, key) {
                template = template.replace(new RegExp('{{' + key + '}}', 'g'), value);
            });
            return template;
        },
        /**
         * @class A gremlin. <strong>gremlins/Lair</strong>
         * @constructs
         * @param {Object} view the dom element representing the gremlin view container
         * @param {jQuery} $view jQuery object of the gremlin view container
         * @param {int} index the index of the gremlin, a uid incrementing with every gremlin found in the site
         * @param {Object} data the data object required with $view.data()
         * @param {String} data.LairSrc the source of the Lair
         * @name gremlins/Lair
         */
        Lair = function ($view) {
            var _this = this,
                getName = gup(Lair.PARAM_GREMLIN_NAME),
                getNamespace = gup(Lair.PARAM_GREMLIN_NAMESPACE);
            this._$view = $view;
            this._$form = $view.find('form');
            this._$preview = $view.find('.gremlin-preview');
            this._$name = $view.find('input[name=gremlinName]');
            this._$namespace = $view.find('input[name=gremlinNamespace]');

            this._$name.val(getName);
            this._$namespace.val(getNamespace);


            this._$form.submit(function (e) {
                e.preventDefault();
                _this._handleFormSubmit();
            });

            $view.delegate('input[type=reset]', 'click', function () {
                _this._clearPreview();
            });
            $view.delegate('.gremlin-preview textarea', 'click', function () {
                this.select();
            });
        };
    Lair.prototype = {
        _handleFormSubmit: function () {
            var name = this._$name.val(),
                namespace = this._$namespace.val(),
                docName = helper.isEmptyString(namespace) ? name : namespace.replace(".", "/") + "/" + name;
            if (!helper.isEmptyString(name)) {
                this._renderGremlin(name, docName);
            } else {
                this._$name.focus();
            }
        },
        _renderGremlin: function (name, docName) {
            var fileContent, fileUri;
            fileContent = tpl($('#gremlin-file-template').html(), {
                name: name,
                docName: docName
            });
            fileUri = "data:application/javascript;filename=" + name + ".js," + encodeURIComponent(fileContent);
            this._$view.find('.gremlin-preview').html('<h2><a href="' + fileUri + '">' + docName + '.js</a></h2><pre><code><textarea>' + fileContent + '</textarea></code></pre>');
            this._$view.find('.download-file').attr("href", fileUri);
            this._$view.addClass("submitted");
            $('html,body').animate({
                scrollTop: this._$view.find('.gremlin-preview').offset().top - 30
            });
        },
        _clearPreview: function () {
            //window.location.href = window.location.href.replace(window.location.search, "");
            this._$preview.html("");
            this._$view.removeClass("submitted");
        }
    };
    Lair.PARAM_GREMLIN_NAME = "gremlinName";
    Lair.PARAM_GREMLIN_NAMESPACE = "gremlinNamespace";
    return Lair;
});