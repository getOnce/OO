"use strict";
define(['./util', './template/template'], function(util) {
	template.registerFunction('comm_poi_getstar', function() {
		return util.getStarHtml.apply(util, arguments);
	});

	return {
		registerFunction: template.registerFunction,
        render: function(tpl, data) {
            return template(tpl, data || {});
        }
    };
});