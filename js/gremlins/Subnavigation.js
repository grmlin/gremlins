/*global define: true*/
define(function () {
    'use strict';

    var Subnavigation = gremlinjs.create("Subnavigation", {
        elements: {
        },
        events: {
        },
        initialize:function () {
        }
    });
    /**
     * @class A gremlin. <strong>gremlins/Subnavigation</strong>
     * @description Lorem Ipsum in here
     * @constructs
     * @param {jQuery} $view jQuery object of the gremlin view container
     * @param {Object} data the data object of the gremlin's dom container fetched with <code>$view.data()</code>
     * @param {int} index the index of the gremlin, a uid incrementing with every gremlin found in the site
     * @name gremlins/Subnavigation
     */
    var Subnavigation = function ($view, data, index) {
        /**
         * The jquery object of the dom element
         * @private
         * @type {jQuery}
         * @name gremlins/Subnavigation#_$view
         */
        this._$view = $view;
        /**
         * The gremlin's data object
         * @private
         * @type {Object}
         * @name gremlins/Subnavigation#_data
         */
        this._data = data;
        /**
         * The gremlin's id
         * @private
         * @type {int}
         * @name gremlins/Subnavigation#_id
         */
        this._id = index;
    };


    Subnavigation.prototype = {
        /**
         * A private method
         * @private
         * @method
         * @name gremlins/Subnavigation#_myPrivateMethod
         */
        _myPrivateMethod: function () {

        },
        /**
         * A public method
         * @param {String} [foo=bar] a parameter
         * @method
         * @name gremlins/Subnavigation#myPublicMethod
         */
        myPublicMethod: function (foo) {

        }
    };

    return Subnavigation;
});
