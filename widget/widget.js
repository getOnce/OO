"use strict";
define(["../lang/oo", "../lang/oo-event", '../lang/i18n'], function(oo, ooEvent, i18n) {
    return oo.createClass({
        $el: null,
        _event_alias: '__widget',
        /**
         * @params.events 事件代理
         * [
         *      [事件类型, 事件处理函数, selector],
         *      ['click', 'show', 'div.classname'],
         *      ['click', function(evt, widget){...}, 'div.classname'],
         *      ['click', function(evt, widget){...}, function() { return 'div.classname'; }],
         * ]
         */
        init: function(params) {
            this.callSuper.apply(this, arguments);
            this.setAttrs(params || {});
            this.delegateEvents(this.events);
            this.delegateEvents(params.events);
        },
        setAttrs: function(name, value) {
            if(arguments.length === 1) {
                value = name;
                name = this.getStatic('ATTRS');
            }
            //console.log(name, value);
            this._setAttrs(name, value);
        },
        _setAttrs: function(name, value) {
            $.each(name, this.proxy(function(k, v) {
                this.setAttr(k, value[k]);
            }));
        },
        setAttr: function(name, value) {
            value = typeof value === 'undefined' ? this.getStatic('ATTRS')[name] : value;
            //如果以$开头的属性名，进行$包装
            value = name.charAt(0) === '$' ? $(value) : value;
            this[name] = value;
        },
        $: function(selector) {
            return selector ? $(selector, this.$el) : this.$el;
        },
        delegateEvents: function(events) {
            events && $.each(events, $.proxy(function(index, eventItem) {
                this.delegateEvent.apply(this, eventItem);
            }, this));
            return this;
        },
        delegateEvent: function(eventType, callback, selector) {
            if(eventType && callback) {
                callback = typeof callback === 'string' && $.isFunction(this[callback]) ? $.proxy(this[callback], this) : $.proxy(callback, this);
                this.$el.on(eventType + '.' + this._event_alias, $.isFunction(selector) ? selector.call(this) : selector, callback);
            }
            return this;
        },
        undelegateEvents: function() {
            this.$el.off('.' + this._event_alias);
        },
        proxy: function(method/*, ...args*/) {
            //在第一个和第二个参数之间增加this [method, this, ...args]
            Array.prototype.splice.call(arguments, 1, 0, this);
            return $.proxy.apply($, arguments);
        },
        destroy: function() {
            this.undelegateEvents();
            for(var k in this) {
                if(this.hasOwnProperty(k)) {
                    //console.log(k, this[k]);
                    if(this[k] && $.isFunction(this[k].destroy)) {
                        try {
                            this[k].destroy();
                        } catch(e) {}
                    }
                    delete this[k];
                }
            }
        }
    }, {
        ATTRS: {
            $el: document.body
        }
    }).implement(ooEvent).plugin(i18n);
});