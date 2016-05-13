/**
 * @fileOverview util工具
 * @revision 1.0
 */
define(function() {
	"use strict";
	return {
		getInstance: function(Func, args) {
			args = args || [];
			switch(args.length) {
				case 0: return new Func;
				case 1: return new Func(args[0]);
				case 2: return new Func(args[0], args[1]);
				case 3: return new Func(args[0], args[1], args[2]);
				default: 
					var arr = [];
					for(var i = 0, len = args.length; i<len; i++) {
						arr.push('arguments[' + i + ']');
					}
					return new Function('return new this(' + arr.join(',') + ');').apply(Func, args);
			}
		},
		extend: function(target, source) {
			/*for(var k in source) {
				if(source.hasOwnProperty(k)) {
					target[k] = source[k];
				}
			}*/
			$.extend(true, target, source, target);
		},

		/**
		 * @description 根据分数生成星星评分的html片段
		 * @param {String} grade 分数（0-10）
		 * @param {String} fill 满的星星html
		 * @param {String} half 半颗星星html
		 * @param {String} empty 空的星星html
		 * @returns {String} 星星评分的html片段
		 */
		getStarHtml: function(grade, fill, half, empty) {
			grade = Math.floor(grade)/2;
			var arr = [];
			for(var i=1; i<=5; i++) {
				if(grade >= i) {
					arr.push(fill);
				} else if(grade+1 > i) {
					arr.push(half);
				} else {
					arr.push(empty);
				}
			}
			return arr.join('');
		}
	}
});