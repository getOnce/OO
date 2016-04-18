"use strict";
define(function() {
    return {
        //获取poi cate列表
        //{"error_code":0,"result":"ok","data":[{"cateid":151,"catename":"\u666f\u70b9\u89c2\u5149"},{"cateid":152,"catename":"\u4f11\u95f2\u5a31\u4e50"},{"cateid":153,"catename":"\u8d5b\u4e8b\u6f14\u51fa"},{"cateid":154,"catename":"\u8fd0\u52a8\u6237\u5916"},{"cateid":155,"catename":"\u6e38\u89c8\u7ebf\u8def"},{"cateid":156,"catename":"\u6587\u5316\u6d3b\u52a8"},{"cateid":147,"catename":"\u8d2d\u7269"}]}
        getPoiCate: '/map.php?action=poicate',

        //获取图片列表
        getPoiList: '/map.php?action=maplist',

        //获取poi详细信息
        getPoiDetail: '/map.php?action=getDetail',

        //获取地图中其他类别的poi
        getOtherCategoryPoi: '/map.php?action=getOtherCategoryPoiInMap'
    };
});