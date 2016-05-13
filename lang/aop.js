/**
 * @fileOverview aop拦截器
 * @revision 1.0
 */
define(function() {
	"use strict";
	var
	_add = function(o, name, before, after) {
		var flag = $.isFunction(o), old, f;
		//重载，如果o是函数
		if(flag) {
			old = o;
		after = before;
			before = name;
		} else {
			old = o[name];
		}
		f = old;
			if($.isFunction(before)) {
				f = getFunc(before, f, 1);
				for(var k in old) {
					f[k] = old[k];
				}
			}
		if($.isFunction(after)) {
			f = getFunc(f, after, 0);
			for(var k in old) {
				f[k] = old[k];
			}
		}
			
		if(!flag) {
			o[name] = f;
		}
			
		return f;
	},
	getFunc = function(before, after, returnVal) {
		return function() {
			var
			v1 = before.apply(this, arguments),
			v2 = after.apply(this, arguments);
			return returnVal == 0 ? v1 : v2;
		};
	},
	/** 
	 * @description 方法前增加拦截
	 * @function
	 * @param {Object} obj 要增加拦截的对象
	 * @param {String} name 要增加拦截的方法
	 * @param {Function} func 执行的函数
	 * @returns {Function} 添加拦截器之前的函数
	 */
	before = function(o, name, fn) {
		return _add(o, name, fn, null);
	},
	/** 
	 * @description 方法后增加拦截
	 * @function
	 * @param {Object} obj 要增加拦截的对象
	 * @param {String} name 要增加拦截的方法
	 * @param {Function} func 执行的函数
	 * @returns {Function} 添加拦截器之前的函数
	 */
	after = function(o, name, fn) {
		return _add(o, name, null, fn);
	},
	/** 
	 * @description 方法前后都增加拦截
	 * @function
	 * @param {Object} obj 要增加拦截的对象
	 * @param {String} methodName 要增加拦截的方法
	 * @param {Function} before 在目前函数之前执行的函数
	 * @param {Function} after 在目前函数之后执行的函数
	 * @returns {Function} 添加拦截器之前的函数
	 */
	wrapper = function(o, name, before, after) {
		return _add(o, name, before, after);
	};
	
	return {
		/** 
		 * @description 方法前增加拦截
		 * @function
		 * @param {Object} obj 要增加拦截的对象
		 * @param {String} methodName 要增加拦截的方法
		 * @param {Function} func 执行的函数
		 * @returns {Function} 添加拦截器之前的函数
		 */
		before: before,
		/** 
		 * @description 方法后增加拦截
		 * @function
		 * @param {Object} obj 要增加拦截的对象
		 * @param {String} methodName 要增加拦截的方法
		 * @param {Function} func 执行的函数
		 * @returns {Function} 添加拦截器之前的函数
		 */
		after: after,
		/** 
		 * @description 方法前后都增加拦截
		 * @function
		 * @param {Object} obj 要增加拦截的对象
		 * @param {String} methodName 要增加拦截的方法
		 * @param {Function} before 在目前函数之前执行的函数
		 * @param {Function} after 在目前函数之后执行的函数
		 * @returns {Function} 添加拦截器之前的函数
		 */
		wrapper: wrapper
	};
});