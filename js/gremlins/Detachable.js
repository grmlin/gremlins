/*global define, window, screen*/
define(['jquery', 'gremlinjs'], function ($, gremlinjs) {
    'use strict';

    var $window = $(window),
        Detachable = gremlinjs.create("Detachable", {
            elements : {
            },
            events : {
            },
            initialize : function () {
                this._detachBottom = this.data.detachBottom;
                this._reattach = this.data.reattach;

                if (screen.width > 600) {
                    this._bindScrolling();
                }
            },
            _bindScrolling : function () {
                var _this = this,
                    scrollTop,
                    detached,
                    top = this.view.offset().top + (this._detachBottom ? this.view.height() : 0);

                $window.bind('scroll', function () {
                    scrollTop = $window.scrollTop();
                    detached = scrollTop > top;
                    if (_this._reattach && detached) {
                        detached = scrollTop < top + _this.view.height() - screen.height / 3;
                    }
                    _this.view[detached ? "addClass" : "removeClass"](Detachable.DETACH_CLASS);
                });

                $window.scroll();
            }
        });
    Detachable.DETACH_CLASS = "detached";
    return Detachable;
});