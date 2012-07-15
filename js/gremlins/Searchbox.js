/*global define: true*/
define(function () {
    'use strict';
    /**
     * @class A gremlin. <strong>gremlins/Searchbox</strong>
     * @description mead ibu brew heat exchanger yeast, caramel malt--aau specific gravity degrees plato. secondary fermentation pint glass reinheitsgebot units of bitterness. biere de garde, aroma hops tulip glass grainy. malt extract. black malt seidel brewpub attenuation bitter abbey sparge; tulip glass krug.
     * @constructs
     * @param {Object} view the dom element representing the gremlin view container
     * @param {jQuery} $view jQuery object of the gremlin view container
     * @param {int} index the index of the gremlin, a uid incrementing with every gremlin found in the site
     * @name gremlins/Searchbox
     */
    var Searchbox = function ($view) {
        $view.focus(
            function () {
                if (this.value == this.defaultValue) {
                    this.value = "";
                }
            }).blur(function () {
                if (!this.value.length) {
                    this.value = this.defaultValue;
                }
            });
    };


    return Searchbox;
});