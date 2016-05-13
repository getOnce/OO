/**
 * @fileOverview OO（类创建器）
 * @revision 1.0
 */
define(['../util/util', './aop', './oo-static'], function(util, aop, ooStatic) {
	"use strict";
	var
	newp = function(p) {
		var F = function(){};
		F.prototype = p;
		return new F;
	},
	/**
	 * @description 创建类
	 * @function
	 * @param {Function} [superClass=Parent] 所创建类的父类
	 * @param {Map} childObj 要创建类的方法和属性
	 * @param {Map} staticObj 静态方法和属性
	 * @returns {Function} 创建的新类
	 */
	createClass = function(s, c, staticObj) {
		if(!s) {
			s = Parent;
		} else if(typeof s != "function") {
			staticObj = c;
			c = s;
			s = Parent;
		}
		
		var F = createPrototype(s, function(){
			if(!(this instanceof F)) {
				return util.getInstance(F, arguments);
			}
			return F.superclass.prototype.constructor.apply(this, arguments);
		});
		//扩展的属性复制到F的prototype上
		extendPrototype(F, c);
		//父类的静态属性复制到F上
		util.extend(F, s);
		//参数中的静态属性复制到F上
		util.extend(F, staticObj);
		//父类
		F.superclass = s;

		return F;
	},
	createPrototype = function(s, F) {
		F.prototype = newp(s.prototype);
		F.prototype.constructor = F;
		
		return F;
	},
	extendPrototype = function(F, c) {
		for(var k in c) {
			if(c[k] instanceof Function 
			//如果是callSuper和callParent方法，不对__caller属性进行赋值
			&& k !=='callSuper' && k !=='callParent') {
				var wrapper = getWrapper(k, F, c[k]);
				F.prototype[k] = wrapper;
			} else {
				F.prototype[k] = c[k];
			}
		}
	},
	getWrapper = function(method, Class, f) {
		var caller;
		var wrapper = aop.wrapper(f, function() {
			caller = this.__caller;
			this.__caller = wrapper;
		}, function() {
			if(caller === undefined) {
				delete this.__caller;
			} else {
				this.__caller = caller;
			}
		});
		wrapper.__name = method;
		wrapper.__owner = Class;
		return wrapper;
	},
	Parent = createClass(function(){this.init.apply(this, arguments);}, {
		//构造函数
		init : function(arg0) {
			this.lang = arg0 && arg0.lang || this.lang;
		},
		
		//子类调用父类相关函数
		callParent : function(methodName/*, callMethodArguments ...*/) {
			var args = Array.prototype.slice.call(arguments);
			return this.__caller.__owner.superclass.prototype[args.shift(0)].apply(this, args);
		},
		callSuper : function(/*callMethodArguments ...*/) {
			return this.__caller.__owner.superclass.prototype[this.__caller.__name].apply(this, arguments);
		},
		
		before: function(method, f) {
			aop.before(this, method, getWrapper(method, this.constructor, function() {
				return f.apply(this, arguments);
			}));
			return this;
		},
		after: function(method, f) {
			aop.after(this, method, getWrapper(method, this.constructor, function() {
				return f.apply(this, arguments);
			}));
			return this;
		}
	}, {
		/**
		 * @description 创建类
		 * @function
		 * @param {Map} childObj 要创建类的方法和属性
		 * @param {Map} staticObj 静态方法和属性
		 * @returns {Function} 创建的新类
		 */
		createClass: function(childObj, staticObj) {
			return createClass.apply(this, Array.prototype.concat.apply([this], arguments));
		},
		/**
		 * @description 实现接口
		 * @function
		 * @param {Map} newMethod 要实现接口的方法和属性
		 * @returns {Function} 返回当前类，支持链式调用
		 */
		implement: function(newMethod) {
			extendPrototype(this, newMethod);
			return this;
		},
		/**
		 * @description 插件机制
		 * @function
		 * @param {Function} func
		 * @param {Array} args 调用参数
		 * @returns {Function} 返回当前类，支持链式调用
		 */
		plugin: function(func, args) {
			func instanceof Function && func.apply(this, args);
			return this;
		}
	}).plugin(ooStatic);
	
	var oo = {
		Parent : Parent,
		/**
		 * @description 创建类
		 * @function
		 * @param {Function} [superClass=Parent] 所创建类的父类
		 * @param {Map} childObj 要创建类的方法和属性
		 * @param {Map} staticObj 静态方法和属性
		 * @returns {Function} 创建的新类
		 */
		createClass : createClass
	};
	return oo;
});