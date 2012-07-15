/*global define*/
define(function () {
    "use strict";
    var Item = function ($navigationItem, $navigationTarget) {
        if ($navigationTarget.length === 0) {
            throw new Error("NavigationItem# called with an empty target: " + $navigationTarget.selector);
        }
        this.$item = $navigationItem;
        this.$target = $navigationTarget;

        this.targetHeight = this.$target.outerHeight();
        this._targetOffset = this.$target.offset();
        this.targetTop = this._targetOffset.top;
        this.itemWidth = this.$item.outerWidth();
        this.itemHeight = this.$item.outerHeight();
        this._itemPosition = this.$item.parent().position();
        this.itemLeft = this._itemPosition.left;
    };
    Item.prototype = {
        reposition: function () {
            this._targetOffset = this.$target.offset();
            this.targetTop = this._targetOffset.top;
        }
    };
    return Item;
});