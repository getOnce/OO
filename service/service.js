"use strict";
define(function() {
    return {
        post: function(url, data, success, error) {
            return qyerUtil.doAjax({
                url: url,
                type: 'POST',
                data: data,
                onSuccess: success,
                onError: error
            });
        },
        get: function(url, data, success, error) {
            return qyerUtil.doAjax({
                url: url,
                type: 'GET',
                data: data,
                onSuccess: success,
                onError: error
            });
        }
    };
});