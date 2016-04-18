/**
 * @fileOverview 为Class增加Event扩展
 * @author pk 
 * @revision 1.0
 */
define(['./aop'], function(aop) {
	"use strict";
	var eventInterface = {
		getEventproxy: function() {
			return $(this);
		},
		bind: function (name, func) {
			var eventproxy = this.getEventproxy();
			eventproxy.bind.apply(eventproxy, arguments);
			return this;
		},
		unbind: function (name, func) {
			var eventproxy = this.getEventproxy();
			eventproxy.unbind.apply(eventproxy, arguments);
			return this;
		},
		on: function() {
			return this.bind.apply(this, arguments);
		},
		off: function() {
			return this.unbind.apply(this, arguments);
		},
		one: function (name, func) {
			var self = this;
			var f = arguments[1] = aop.before(arguments[1], function() {
				this.unbind(name, f);
			});
			this.bind.apply(this, arguments);
			return this;
		},
		trigger: function (name, data) {
			var eventproxy = this.getEventproxy();
			eventproxy.trigger.apply(eventproxy, arguments);
			return this;
		}
	};
	
	return eventInterface;
});