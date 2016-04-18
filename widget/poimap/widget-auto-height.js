define(["../widget-service"], function(Widget) {
    "use strict";
    return Widget.createClass({
        $box: document.body,
        init: function(arg0) {
            this.callSuper.apply(this, arguments);
            this._id = new Date().getTime();
            this.bindEvents();
        },
        bindEvents: function() {
            $(window).on('resize.' + this._id, $.proxy(this.setHeight, this));
        },
        unbindEvents: function() {
            $(window).off('resize.' + this._id);
        },
        setHeight: function() {
            this.$().height(this.getHeight());
        },
        getHeight: function() {
            return this.$box.height() - this.$().offset().top;
        },
        destroy: function() {
            this.unbindEvents();
            this.callSuper.apply(this, arguments);
        }
    }, {
        ATTRS: {
            $box: document.body
        }
    });
});