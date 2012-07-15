/*global define, window, screen*/
define(['jquery', 'gremlinjs'], function ($, gremlinjs) {
    'use strict';

    var Expanding = gremlinjs.create("Expanding", {
        initialize : function () {
            if (screen.width > 600) {
                this._expand();
            }
        },
        _expand : function () {
            var $clicked = null,
                $opened = $([]);
            this.view.find("a.jumper").each(
                function () {
                    var $link = $(this);
                    $link.click(function (e) {
                        e.preventDefault();
                        if ($clicked !== null) {
                            $clicked.removeClass("current");
                        }
                        $clicked = $(this);
                        $clicked.addClass("current");
                        $opened.removeClass("current");
                        $opened = $($link.attr("href"));
                        $opened.addClass("current");
                    });
            }).eq(0).click();
        }
    });

    return Expanding;
});