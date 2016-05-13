/**
 * @fileOverview i18n国际化扩展
 * @revision 1.0
 */
define(function() {
	"use strict";
	var i18n_implement = {
		lang: 'zh',
        i18n: function(k) {
            return this.callStatic('getI18n', [this.lang, k]);
        }
	};
	var i18n_static = {
		i18n_key: 'i18n',
		lang: 'zh',
		i18n: function(lang, obj) {
			if(arguments.length === 1) {
				obj = lang;
				lang = this.lang;
			}

			var i18nStatic = this.getStatic(this._i18n_key) || {};
			i18nStatic[lang] = obj;
			this.setStatic(this._i18n_key, i18nStatic);
			return this;
		},
		getI18n: function(lang, k) {
			var i18nStatic = (this.getStatic(this._i18n_key) || {})[lang];
			return k ? i18nStatic[k] : i18nStatic;
		}
	};

	return function() {
		this.implement(i18n_implement);
		this.setStatic(i18n_static);
	};
});