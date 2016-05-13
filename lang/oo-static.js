/**
 * @fileOverview oo静态方法和属性的扩展
 * @revision 1.0
 */
define(['../util/util'], function(util) {
	"use strict";
	return function() {
		util.extend(this, {
			/**
			 * @description 获取静态资源
			 * @function
			 * @param {String} k 获取静态资源的key
			 * @returns {Object} 返回相应的值
			 */
			getStatic: function(k) {
				return k ? this[k] : this;
			},
			/**
			 * @description 设置静态资源
			 * @function
			 * @param {String|Map} k 静态资源的key或者是key:value格式的Map
			 * @param {Object} v 静态资源的值
			 * @returns {Function} 返回当前类，支持链式调用
			 */
			setStatic: function(k, v) {
				if(arguments.length === 1) {
					util.extend(this, k);
				} else {
					this[k] = v;
				}
				return this;
			}
		});

		this.implement({
			/**
			 * @description 获取静态资源
			 * @function
			 * @param {String} k 获取静态资源的key
			 * @returns {Object} 返回相应的值
			 */
			getStatic: function(k) {
				return this.constructor.getStatic.apply(this.constructor, arguments);
			},
			/**
			 * @description 设置静态资源
			 * @function
			 * @param {String|Map} k 静态资源的key或者是key:value格式的Map
			 * @param {Object} v 静态资源的值
			 * @returns {Function} 返回当前类，支持链式调用
			 */
			setStatic: function(k, v) {
				this.constructor.setStatic.apply(this.constructor, arguments);
				return this;
			},
			/**
			 * @description 调用静态函数
			 * @function
			 * @param {String} methodName 静态函数名称
			 * @param {Array} args 调用参数
			 * @returns {Object} 返回执行结果
			 */
			callStatic: function(methodName, args) {
				return this.getStatic(methodName).apply(this.constructor, args);
			}
		});
	};
});