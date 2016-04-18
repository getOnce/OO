define(['common/widget/widget-tpl', 'common/util/template'], function(Widget, template) {
    "use strict";
    return Widget.createClass({
        status: 0,
        _xhr: null,
        _load: function() {
            this.abort();
            return this._xhr = this.service.apply(this.service, arguments);
        },
        load: function(/*request, success, err*/) {
            var args = Array.prototype.slice.apply(arguments);

            var success = args[args.length - 2];
            args[args.length - 2] = $.proxy(function(data) {
                this.status = this.getStatic('STATUS').NORMAL;
                $.isFunction(success) && success.call(this, data);
                this.checkData.apply(this, [data].concat(args)) && this.renderData(data);
            }, this);

            var error = args[args.length - 1];
            args[args.length - 1] = $.proxy(function() {
                this.status = this.getStatic('STATUS').NORMAL;
                $.isFunction(error) && error.apply(this, arguments);
            }, this);

            this.status = this.getStatic('STATUS').LOADING;
            return this._load.apply(this, args);
        },
        abort: function() {
            this._xhr && this._xhr.abort && this._xhr.abort();
        },
        renderData: function(data) {
            this.render(data);
        },
        checkData: function(data, request) {
            return true;
        }
    }, {
        ATTRS: {
            service: null
        },
        STATUS: {
            NORMAL: 0,
            LOADING: 1
        }
    });
});