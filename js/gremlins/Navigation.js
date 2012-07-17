/*global define, window, screen, document*/
define(['jquery', 'gremlinjs', 'gremlinjs/core/helper', './navigation/NavigationItem'], function ($, gremlinjs, helper, NavigationItem) {
    'use strict';


    var $window = $(window),
        $scrollTarget = $('html,body'),
        $document = $(document),
        windowHeight = $window.height(),
        SCROLL_PUFFER = windowHeight / 3,
        SCROLL_TO_FILL = SCROLL_PUFFER - 80,
        Navigation = gremlinjs.create("Navigation", {
            elements : {
                "_$navigationItems" : ".jumper",
                "_$marker" : ".scroll-mark",
                "_$markerHighlight" : ".scroll-mark > div",
                "_$progress" : ".progress"
            },
            events : {
            },
            initialize : function () {
                this._items = {};
                this._$navigationTargets = $([]);
                if (screen.width > 600) {
                    this._createItems();
                    this._bindScroll();
                    this._bindItemClick();
                    $window.scroll();
                }
            },
            _createItems : function () {
                var _this = this,
                    targetId,
                    $target,
                    $item;
                this._$navigationItems.each(function (index) {
                    targetId = this.getAttribute("href");
                    $target = $(targetId);
                    $item = $(this);
                    _this._$navigationTargets = _this._$navigationTargets.add($target);
                    _this._items[targetId] = new NavigationItem($item, $target);
                    if (index === 0) {
                        _this._items[targetId].targetTop = 0;
                    }
                });
                $window.resize(function () {
                    helper.each(_this._items, function (item, index) {
                        item.reposition();
                        if (index === 0) {
                            item.targetTop = 0;
                        }
                    });
                });
            },
            _bindScroll : function () {
                var _this = this;
                $window.bind('scroll', function () {
                    _this._handleScroll();

                });
            },
            _bindItemClick : function () {
                this._$navigationItems.click(function (e) {
                    e.preventDefault();
                    $scrollTarget.animate({
                        scrollTop : $(this.getAttribute("href")).offset().top - SCROLL_TO_FILL
                    }, 500);
                });
            },
            _handleScroll : function () {
                var scrollTop = $window.scrollTop(),
                    scrollPercentage = (scrollTop + windowHeight) * 100 / $document.height(),
                    currentItem,
                    height2calc,
                    visibleTargetPx,
                    visibleTargetPercentage,
                    name, item;
                for (name in this._items) {
                    if (this._items.hasOwnProperty(name)) {
                        item = this._items[name];
                        if (item.targetTop < scrollTop + SCROLL_PUFFER) {
                            currentItem = item;
                            this._$navigationItems.removeClass("current");
                            item.$item.addClass("current");
                            this._$marker.css({
                                width : item.itemWidth,
                                height : item.itemHeight,
                                left : item.itemLeft
                            });
                            this._$markerHighlight.css({
                                borderLeftWidth : item.itemWidth / 2,
                                borderRightWidth : item.itemWidth / 2,
                                marginLeft : -item.itemWidth / 2
                            });
                        }
                    }
                }

                if (!helper.isUndefined(currentItem)) {
                    height2calc = windowHeight > currentItem.targetHeight ? windowHeight : currentItem.targetHeight;
                    visibleTargetPx = scrollTop + (SCROLL_PUFFER) - currentItem.targetTop;
                    visibleTargetPercentage = visibleTargetPx * 100 / height2calc;
                    visibleTargetPercentage = visibleTargetPercentage < 0 ? 0 : visibleTargetPercentage;
                    visibleTargetPercentage = scrollPercentage > 90 ? scrollPercentage : visibleTargetPercentage;
                    this._$progress.css({
                        width : currentItem.itemLeft + (currentItem.itemWidth * visibleTargetPercentage / 100)
                    });
                }

            }
        });

    $window.resize(function () {
        windowHeight = $window.height();
        SCROLL_PUFFER = windowHeight / 3;
        SCROLL_TO_FILL = SCROLL_PUFFER - 80;
    });
    return Navigation;
});