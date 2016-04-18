define(['../service', './urls', '../../util/template'], function(service, urls, template) {
    "use strict";
    var poiService = {
        TYPE_NAME: {
            CITY: 'city',
            COUNTRY: 'country'
        },
        TYPE: {
            FUN: 'fun',//玩
            HOTEL: 'hotel',//住
            FOOD: 'food'//吃
        },
        STAR: {
            LOW: 1,//1-2星级
            MEDIUM: 2,//3-4星级
            HIGH: 3//5星级
        },
        ORDER: {
            HOT: 1,//按热度排序
            PRICE_LOW_HIGH: 2,//价格由低到高
            PRICE_HIGH_LOW: 3//价格由高到低
        },

        //地图页面获取cate
        getPoiCate: function(type, success, error) {
            switch(type) {
                case poiService.TYPE.HOTEL:
                    return poiService.getHotelCate(success, error);
                case poiService.TYPE.FOOD:
                    return poiService.getFoodCate(success, error);
                default:
                    return poiService.getFunCate(success, error);
            }
        },
        //地图页面获取玩的cate
        //{"error_code":0,"result":"ok","data":[{"cateid":151,"catename":"\u666f\u70b9\u89c2\u5149"},{"cateid":152,"catename":"\u4f11\u95f2\u5a31\u4e50"},{"cateid":153,"catename":"\u8d5b\u4e8b\u6f14\u51fa"},{"cateid":154,"catename":"\u8fd0\u52a8\u6237\u5916"},{"cateid":155,"catename":"\u6e38\u89c8\u7ebf\u8def"},{"cateid":156,"catename":"\u6587\u5316\u6d3b\u52a8"},{"cateid":147,"catename":"\u8d2d\u7269"}]}
        getFunCate: function(success, error) {
            /*var timer = setTimeout(function() {
                success({"error_code":0,"result":"ok","data":[{"cateid":151,"catename":"\u666f\u70b9\u89c2\u5149"},{"cateid":152,"catename":"\u4f11\u95f2\u5a31\u4e50"},{"cateid":153,"catename":"\u8d5b\u4e8b\u6f14\u51fa"},{"cateid":154,"catename":"\u8fd0\u52a8\u6237\u5916"},{"cateid":155,"catename":"\u6e38\u89c8\u7ebf\u8def"},{"cateid":156,"catename":"\u6587\u5316\u6d3b\u52a8"},{"cateid":147,"catename":"\u8d2d\u7269"}]})
            }, 0);
            return {
                abort: function() {
                    clearTimeout(timer);
                }
            };*/

            return service.get(urls.getPoiCate, {}, success, error);
        },
        //地图页面获取酒店cate
        getHotelCate: function(success, error) {
            return success({
                "error_code": 0,
                "result": "ok",
                "data": [
                    {
                        "cateid": poiService.STAR.LOW,
                        "catename": "1-2星级"
                    },
                    {
                        "cateid": poiService.STAR.MEDIUM,
                        "catename": "3-4星级"
                    },
                    {
                        "cateid": poiService.STAR.HIGH,
                        "catename": "5星级"
                    }
                ]
            });
        },
        //地图页面获取吃的cate
        getFoodCate: function(success, error) {
            return success({
                "error_code": 0,
                "result": "ok",
                "data": []
            });
        },
        _poiListFilter: function(params, poiList) {
            $.each(poiList || [], function(i, item) {
                item.type = params.type;
                item.index = i;
                
                //hotel相关
                if(params.type === poiService.TYPE.HOTEL) {
                    item.id = item.id || item.hotel_id;
                    item.lat = item.lat || item.hotel_lat;
                    item.lng = item.lng || item.hotel_lng;
                    item.chinesename = item.chinesename || item.hotel_chinesename;
                    item.englishname = item.englishname || item.hotel_englishname;
                    item.price = item.price || item.hotel_price;
                    item.url = item.url || item.hotel_url;
                }
            });
        },
        /*
            url: http://place.qyer.com/map.php?action=maplist
            params: 
                type:               fun(玩) or food(吃) or hotel(住)
                id:                 城市的id or 国家的id
                typename:           city or country
                cateid:             分类的id
                    详细说明cateid
                    玩:
                        全部, cateid = 0, 否则传入cateid的值, 对应的id在ajax接口中有了
                    住:
                        无
                    吃: 
                        78, 定死的, 需要前端自己写死
                page:               分页的页码
                bottom_coordinate:  52.513905,13.378719 (左 or 右上角经纬度, eg: 经度,纬度)
                top_coordinate:     52.517296,13.413818 (左 or 右下角经纬度, eg: 经度,纬度)
                qyer_star:          住星级1(1,2星) 2(2,3星) 3(5星)
                order_type:         1(热度高到低) 2(价格 低->高) 3(价格 高->低)
        */
        getPoiList: function(params, success, error) {
            var callback = function(data) {
                poiService._poiListFilter(params, data && data.data && data.data.res);
                success(data);
            };

            /*console.log('getPoiList', params);
            var data = {
                fun: {"error_code":0,"result":"ok","data":{"res":[{"id":"46973","chinesename":"\u5409\u8428\u91d1\u5b57\u5854","englishname":"Giza Pyramids: Pyramid of Cheops, Sphinx etc","price":"60\u57c3\u9551","lat":"29.976610","lng":"31.131069","url":"http:\/\/place.qyer.com\/poi\/V2AJZVFvBzFTZw\/","tags":[{"id":"191","tag_name":"\u5386\u53f2\u9057\u5740","tag_alias_name":"","tag_name_py":"lishiyizhi","state":"1","createtime":"1451014143","updatetime":"1451014143","cn_name":"\u5386\u53f2\u9057\u5740","catename":"\u5386\u53f2\u9057\u5740","en_name":"lishiyizhi","catename_en":"lishiyizhi","catename_py":"lishiyizhi","poi_category_id":0,"parentid":0,"status":"1"},{"id":"183","tag_name":"\u5efa\u7b51","tag_alias_name":"","tag_name_py":"jianzhu","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5efa\u7b51","catename":"\u5efa\u7b51","en_name":"jianzhu","catename_en":"jianzhu","catename_py":"jianzhu","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.976610%26longitude%3D31.131069%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226941820%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":20},{"id":"59512","chinesename":"\u57c3\u53ca\u535a\u7269\u9986","englishname":"Egyptian Museum","price":"\u95e8\u796860\u57c3\u9551\uff0c\u6301\u56fd\u9645\u5b66\u751f\u8bc1(ISIC)\u4eab\u53d7\u534a\u4ef7\u4f18\u60e0\u3002\u535a\u7269\u9986\u5185\u53e6\u6709\u4e00\u4e2a\u6728\u4e43\u4f0a\u9986\uff0c\u9700\u8981\u989d\u5916\u8d2d\u7968\uff0c\u7968\u4ef7100\u57c3\u9551\uff0c\u5b66\u751f\u8bc1\u534a\u4ef7\u3002","lat":"30.047464","lng":"31.233690","url":"http:\/\/place.qyer.com\/poi\/V2EJalFjBzdTZg\/","tags":[{"id":"175","tag_name":"\u535a\u7269\u9986","tag_alias_name":"","tag_name_py":"bowuguan","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u535a\u7269\u9986","catename":"\u535a\u7269\u9986","en_name":"bowuguan","catename_en":"bowuguan","catename_py":"bowuguan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.047464%26longitude%3D31.233690%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226942086%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":121},{"id":"62000","chinesename":"\u72ee\u8eab\u4eba\u9762\u50cf","englishname":"Great Sphinx of Giza","price":"\u6210\u4eba60\u57c3\u9551\uff0c\u6301\u56fd\u9645\u5b66\u751f\u8bc1\u4eab\u53d7\u534a\u4ef7\u4f18\u60e0\u3002\u8fdb\u5165\u80e1\u592b\u91d1\u5b57\u5854\u9700\u53e6\u5916\u8d2d\u7968\uff0c\u7968\u4ef7100\u57c3\u9551\uff0c\u5b66\u751f\u8bc1\u65e0\u4f18\u60e0\u3002","lat":"29.975294","lng":"31.137732","url":"http:\/\/place.qyer.com\/poi\/V2IJYVFmBzZTZA\/","tags":[{"id":"191","tag_name":"\u5386\u53f2\u9057\u5740","tag_alias_name":"","tag_name_py":"lishiyizhi","state":"1","createtime":"1451014143","updatetime":"1451014143","cn_name":"\u5386\u53f2\u9057\u5740","catename":"\u5386\u53f2\u9057\u5740","en_name":"lishiyizhi","catename_en":"lishiyizhi","catename_py":"lishiyizhi","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.975294%26longitude%3D31.137732%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226945900%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":19},{"id":"52822","chinesename":"\u80e1\u592b\u91d1\u5b57\u5854","englishname":"Great Pyramid of Khufu","price":"\u6210\u4eba60\u57c3\u9551\uff0c\u6301\u56fd\u9645\u5b66\u751f\u8bc1\u4eab\u53d7\u534a\u4ef7\u4f18\u60e0\u3002\u8fdb\u5165\u80e1\u592b\u91d1\u5b57\u5854 \u9700\u53e6\u5916\u8d2d\u7968\uff0c\u7968\u4ef7100\u57c3\u9551\uff0c\u5b66\u751f\u8bc1\u65e0\u4f18\u60e0\u3002","lat":"29.979807","lng":"31.134439","url":"http:\/\/place.qyer.com\/poi\/V2EJYVFuBzRTZg\/","tags":[{"id":"203","tag_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","tag_alias_name":"","tag_name_py":"jinianbeidiaosupenquan","state":"1","createtime":"1451014144","updatetime":"1451014144","cn_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","catename":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","en_name":"jinianbeidiaosupenquan","catename_en":"jinianbeidiaosupenquan","catename_py":"jinianbeidiaosupenquan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.979807%26longitude%3D31.134439%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226942024%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":20},{"id":"61818","chinesename":"\u54c8\u5229\u5229\u5e02\u573a","englishname":"Khan El-Khalili","price":"\u65e0\u95e8\u7968\u3002","lat":"30.047722","lng":"31.262230","url":"http:\/\/place.qyer.com\/poi\/V2IJYlFuBzdTbA\/","tags":[{"id":"1239","tag_name":"\u96c6\u5e02","tag_alias_name":"","tag_name_py":"jishi","state":"1","createtime":"1451014116","updatetime":"1451014116","cn_name":"\u96c6\u5e02","catename":"\u96c6\u5e02","en_name":"jishi","catename_en":"jishi","catename_py":"jishi","poi_category_id":0,"parentid":0,"status":"1"},{"id":"266","tag_name":"\u624b\u5de5\u827a\u54c1","tag_alias_name":"","tag_name_py":"shougongyipin","state":"1","createtime":"1451014101","updatetime":"1451014101","cn_name":"\u624b\u5de5\u827a\u54c1","catename":"\u624b\u5de5\u827a\u54c1","en_name":"shougongyipin","catename_en":"shougongyipin","catename_py":"shougongyipin","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.047722%26longitude%3D31.262230%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226947588%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":106},{"id":"49397","chinesename":"\u5361\u592b\u62c9\u91d1\u5b57\u5854","englishname":"Pyramid of Khafre","price":"adult\/student E&Acirc;&pound;30\/15 ","lat":"29.976730","lng":"31.131392","url":"http:\/\/place.qyer.com\/poi\/V2AJalFlBz9TYw\/","tags":[{"id":"203","tag_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","tag_alias_name":"","tag_name_py":"jinianbeidiaosupenquan","state":"1","createtime":"1451014144","updatetime":"1451014144","cn_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","catename":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","en_name":"jinianbeidiaosupenquan","catename_en":"jinianbeidiaosupenquan","catename_py":"jinianbeidiaosupenquan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.976730%26longitude%3D31.131392%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226944700%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":20},{"id":"61817","chinesename":"\u7a46\u7f55\u9ed8\u5fb7\u00b7\u963f\u91cc\u6e05\u771f\u5bfa","englishname":"Mosque of Muhammad Ali ","price":"","lat":"29.996193","lng":"31.241018","url":"http:\/\/place.qyer.com\/poi\/V2IJYlFuBzdTYw\/","tags":[{"id":"188","tag_name":"\u5bfa\u5e99","tag_alias_name":"","tag_name_py":"simiao","state":"1","createtime":"1451014143","updatetime":"1451014143","cn_name":"\u5bfa\u5e99","catename":"\u5bfa\u5e99","en_name":"simiao","catename_en":"simiao","catename_py":"simiao","poi_category_id":0,"parentid":0,"status":"1"},{"id":"184","tag_name":"\u5893\u5730","tag_alias_name":"","tag_name_py":"mudi","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5893\u5730","catename":"\u5893\u5730","en_name":"mudi","catename_en":"mudi","catename_py":"mudi","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.996193%26longitude%3D31.241018%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226943279%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":18},{"id":"59511","chinesename":"\u56fe\u5766\u5361\u8499\u7684\u8d22\u5bcc","englishname":"Tutankhamun's Treasure","price":"60\u57c3\u53ca\u9551","lat":"30.045099","lng":"31.235428","url":"http:\/\/place.qyer.com\/poi\/V2EJalFjBzdTZQ\/","tags":[{"id":"175","tag_name":"\u535a\u7269\u9986","tag_alias_name":"","tag_name_py":"bowuguan","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u535a\u7269\u9986","catename":"\u535a\u7269\u9986","en_name":"bowuguan","catename_en":"bowuguan","catename_py":"bowuguan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.045099%26longitude%3D31.235428%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226946004%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":121},{"id":"62005","chinesename":"\u5b5f\u83f2\u65af ","englishname":"Memphis","price":"","lat":"29.837772","lng":"31.239092","url":"http:\/\/place.qyer.com\/poi\/V2IJYVFmBzZTYQ\/","tags":[{"id":"191","tag_name":"\u5386\u53f2\u9057\u5740","tag_alias_name":"","tag_name_py":"lishiyizhi","state":"1","createtime":"1451014143","updatetime":"1451014143","cn_name":"\u5386\u53f2\u9057\u5740","catename":"\u5386\u53f2\u9057\u5740","en_name":"lishiyizhi","catename_en":"lishiyizhi","catename_py":"lishiyizhi","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.837772%26longitude%3D31.239092%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226949361%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":0},{"id":"46939","chinesename":"\u5de6\u585e\u5c14\u91d1\u5b57\u5854","englishname":"Pyramid of Djoser","price":"","lat":"29.887672","lng":"31.237692","url":"http:\/\/place.qyer.com\/poi\/V2AJZVFvBzVTbQ\/","tags":[{"id":"203","tag_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","tag_alias_name":"","tag_name_py":"jinianbeidiaosupenquan","state":"1","createtime":"1451014144","updatetime":"1451014144","cn_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","catename":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","en_name":"jinianbeidiaosupenquan","catename_en":"jinianbeidiaosupenquan","catename_py":"jinianbeidiaosupenquan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.887672%26longitude%3D31.237692%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226946365%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":2},{"id":"61824","chinesename":"\u8428\u62c9\u4e01\u57ce\u5821","englishname":"Salah El-Din Citadel","price":"50\u57c3\u9551\uff0c\u56fd\u9645\u5b66\u751f\u8bc1\u534a\u4ef7\u3002","lat":"30.029362","lng":"31.260952","url":"http:\/\/place.qyer.com\/poi\/V2IJYlFuBzRTYA\/","tags":[{"id":"211","tag_name":"\u5bab\u6bbf\/\u57ce\u5821","tag_alias_name":"","tag_name_py":"gongdianchengbao","state":"1","createtime":"1451014144","updatetime":"1451014144","cn_name":"\u5bab\u6bbf\/\u57ce\u5821","catename":"\u5bab\u6bbf\/\u57ce\u5821","en_name":"gongdianchengbao","catename_en":"gongdianchengbao","catename_py":"gongdianchengbao","poi_category_id":0,"parentid":0,"status":"1"},{"id":"183","tag_name":"\u5efa\u7b51","tag_alias_name":"","tag_name_py":"jianzhu","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5efa\u7b51","catename":"\u5efa\u7b51","en_name":"jianzhu","catename_en":"jianzhu","catename_py":"jianzhu","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.029362%26longitude%3D31.260952%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226948063%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":94},{"id":"55264","chinesename":"\u827e\u8d44\u54c8\u5c14\u6e05\u771f\u5bfa","englishname":"Al-Azhar Mosque","price":"\u514d\u8d39","lat":"30.046076","lng":"31.261862","url":"http:\/\/place.qyer.com\/poi\/V2EJZlFkBzBTYA\/","tags":[{"id":"188","tag_name":"\u5bfa\u5e99","tag_alias_name":"","tag_name_py":"simiao","state":"1","createtime":"1451014143","updatetime":"1451014143","cn_name":"\u5bfa\u5e99","catename":"\u5bfa\u5e99","en_name":"simiao","catename_en":"simiao","catename_py":"simiao","poi_category_id":0,"parentid":0,"status":"1"},{"id":"183","tag_name":"\u5efa\u7b51","tag_alias_name":"","tag_name_py":"jianzhu","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5efa\u7b51","catename":"\u5efa\u7b51","en_name":"jianzhu","catename_en":"jianzhu","catename_py":"jianzhu","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.046076%26longitude%3D31.261862%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226946092%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":107},{"id":"49438","chinesename":"\u5f00\u7f57\u57ce\u5821","englishname":"Cairo Citadel","price":"50\u57c3\u9551&nbsp;","lat":"30.029819","lng":"31.261490","url":"http:\/\/place.qyer.com\/poi\/V2AJalFiBzVTbA\/","tags":[{"id":"183","tag_name":"\u5efa\u7b51","tag_alias_name":"","tag_name_py":"jianzhu","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5efa\u7b51","catename":"\u5efa\u7b51","en_name":"jianzhu","catename_en":"jianzhu","catename_py":"jianzhu","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.029819%26longitude%3D31.261490%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226942177%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":94},{"id":"48096","chinesename":"\u60ac\u7a7a\u6559\u5802","englishname":"The Hanging Church","price":"","lat":"30.005239","lng":"31.230200","url":"http:\/\/place.qyer.com\/poi\/V2AJa1FmBz9TYg\/","tags":[{"id":"183","tag_name":"\u5efa\u7b51","tag_alias_name":"","tag_name_py":"jianzhu","state":"1","createtime":"1451014142","updatetime":"1451014142","cn_name":"\u5efa\u7b51","catename":"\u5efa\u7b51","en_name":"jianzhu","catename_en":"jianzhu","catename_py":"jianzhu","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D30.005239%26longitude%3D31.230200%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226942666%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":53},{"id":"46821","chinesename":"\u7ea2\u8272\u91d1\u5b57\u5854","englishname":"Red Pyramid","price":"incl all sights adult\/student &Acirc;&pound;E25\/&Acirc;&pound;E15 ","lat":"29.812361","lng":"31.186579","url":"http:\/\/place.qyer.com\/poi\/V2AJZVFuBzRTZQ\/","tags":[{"id":"203","tag_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","tag_alias_name":"","tag_name_py":"jinianbeidiaosupenquan","state":"1","createtime":"1451014144","updatetime":"1451014144","cn_name":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","catename":"\u7eaa\u5ff5\u7891\/\u96d5\u5851\/\u55b7\u6cc9","en_name":"jinianbeidiaosupenquan","catename_en":"jinianbeidiaosupenquan","catename_py":"jinianbeidiaosupenquan","poi_category_id":0,"parentid":0,"status":"1"}],"planto":0,"hotel_url":"http:\/\/www.qyer.com\/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.812361%26longitude%3D31.186579%26radius%3D5%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14599226944950%26lang%3Dzh-cn%26ifl%3D%26ss%3D","discount":false,"hotel_count":0}],"count":79,"counts":79,"pager":"<div class=\"ui_page\"><a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|1\" href=\"javascript:1(1)\" class='ui_page_item ui_page_item_current'>1<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|2\" href=\"javascript:1(2)\" class='ui_page_item'>2<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|3\" href=\"javascript:1(3)\" class='ui_page_item'>3<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|4\" href=\"javascript:1(4)\" class='ui_page_item'>4<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|5\" href=\"javascript:1(5)\" class='ui_page_item'>5<\/a>\n<a data-bn-ipg=\"pages-4\" data-ra_arg=\"ra_null|6\" href=\"javascript:1(6)\" class='ui_page_item' title=\"...6\">...6<\/a>\n<a data-bn-ipg=\"pages-5\" data-ra_arg=\"ra_null|2\" href=\"javascript:1(2)\" class='ui_page_item ui_page_next' title=\"\u4e0b\u4e00\u9875\">\u4e0b\u4e00\u9875<\/a>\n<\/div>"}},
                hotel: {"error_code":0,"result":"ok","data":{"res":[{"hotel_id":"202176","hotel_index":1,"hotel_chinesename":"\u5f00\u7f57\u8428\u4f5b\u9152\u5e97","hotel_englishname":"Safir Hotel Cairo","hotel_qyer_star":"5","hotel_rank":"9","hotel_count":199,"hotel_reference_price":532.05,"hotel_price":"497.19","hotel_price_currency":"CNY","hotel_price_discount":7,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/safircairo.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16003\/16732322\/1410522722\/90","hotel_lat":"30.0352258912","hotel_lng":"31.2130647897"},{"hotel_id":"202220","hotel_index":2,"hotel_chinesename":"\u5f00\u7f57\u7d22\u83f2\u7279\u827e\u5c14\u683c\u5179\u62c9\u9152\u5e97","hotel_englishname":"Sofitel Cairo El Gezirah","hotel_qyer_star":"5","hotel_rank":"3","hotel_count":199,"hotel_reference_price":1544.175,"hotel_price":"978.49","hotel_price_currency":"CNY","hotel_price_discount":37,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/el-gezirah-cairo.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16089\/16339904\/1410522918\/90","hotel_lat":"30.0389317917","hotel_lng":"31.2249577045"},{"hotel_id":"235047","hotel_index":3,"hotel_chinesename":"\u5f00\u7f57\u585e\u7c73\u52d2\u7c73\u65af\u6d32\u9645\u9152\u5e97 ","hotel_englishname":"InterContinental Cairo Semiramis","hotel_qyer_star":"5","hotel_rank":"4","hotel_count":199,"hotel_reference_price":1972.26,"hotel_price":"880.64","hotel_price_currency":"CNY","hotel_price_discount":55,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/intercontinental-cairo-semiramis.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/235266\/13403316\/1410982529\/90","hotel_lat":"30.0429161766","hotel_lng":"31.2318670749"},{"hotel_id":"202256","hotel_index":4,"hotel_chinesename":"\u5f00\u7f57\u4e07\u8c6a\u9152\u5e97\u53ca\u5965\u9a6c\u5c14\u6d77\u4e9a\u59c6\u8d4c\u573a","hotel_englishname":"Cairo Marriott Hotel & Omar Khayyam Casino","hotel_qyer_star":"5","hotel_rank":"1","hotel_count":199,"hotel_reference_price":22933.275,"hotel_price":"894.70","hotel_price_currency":"CNY","hotel_price_discount":96,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/cairo-marriott-omar-khayyam-casino.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16174\/7855727\/1410523028\/90","hotel_lat":"30.0570877716","hotel_lng":"31.2239062786"},{"hotel_id":"321406","hotel_index":5,"hotel_chinesename":"\u4e50\u8499\u96f7\u8482\u6069\u5f00\u7f57\u673a\u573a","hotel_englishname":"Le Meridien Cairo Airport","hotel_qyer_star":"5","hotel_rank":"30","hotel_count":199,"hotel_reference_price":1666.485,"hotel_price":"913.66","hotel_price_currency":"CNY","hotel_price_discount":45,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/le-meridien-cairo-airport.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/676629\/37323868\/1415678016\/90","hotel_lat":"30.1136448155","hotel_lng":"31.3953396677"},{"hotel_id":"412571","hotel_index":6,"hotel_chinesename":"\u7c73\u90a3\u4e4b\u5bb6\u9152\u5e97\uff08\u539f\u7c73\u90a3\u5bab\u9152\u5e97\uff09","hotel_englishname":"Mena House Hotel (Formerly Mena House Oberoi)","hotel_qyer_star":"5","hotel_rank":"25","hotel_count":199,"hotel_reference_price":473.955,"hotel_price":"550.40","hotel_price_currency":"CNY","hotel_price_discount":false,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/mena-house-oberoi.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/316358\/17480965\/1431299036\/90","hotel_lat":"29.9866927483","hotel_lng":"31.1332368850"},{"hotel_id":"235045","hotel_index":7,"hotel_chinesename":"\u8d39\u5c14\u8499\u5c3c\u7f57\u6cb3\u57ce\u5e02\u9152\u5e97","hotel_englishname":"Fairmont Nile City","hotel_qyer_star":"5","hotel_rank":"2","hotel_count":199,"hotel_reference_price":12231.08,"hotel_price":"917.33","hotel_price_currency":"CNY","hotel_price_discount":93,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/fairmont-nile-city.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/235262\/16801740\/1410982548\/90","hotel_lat":"30.0714732090","hotel_lng":"31.2274172902"},{"hotel_id":"205821","hotel_index":8,"hotel_chinesename":"\u8d6b\u5229\u5965\u6ce2\u5229\u65af\u8d39\u5c14\u8499\u7279\u5927\u697c\u9152\u5e97","hotel_englishname":"Fairmont Towers, Heliopolis","hotel_qyer_star":"5","hotel_rank":"12","hotel_count":199,"hotel_reference_price":3149.505,"hotel_price":"917.33","hotel_price_currency":"CNY","hotel_price_discount":71,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/fairmont-towers.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/27945\/3017447\/1410567297\/90","hotel_lat":"30.1070714800","hotel_lng":"31.3653123378"},{"hotel_id":"202224","hotel_index":9,"hotel_chinesename":"\u8bfa\u5bcc\u7279\u5f00\u7f57\u673a\u573a\u9152\u5e97","hotel_englishname":"Novotel Cairo Airport","hotel_qyer_star":"4","hotel_rank":"29","hotel_count":199,"hotel_reference_price":553.455,"hotel_price":"423.81","hotel_price_currency":"CNY","hotel_price_discount":23,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/novotel-cairo-airport.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16095\/25184161\/1410522943\/90","hotel_lat":"30.1218185296","hotel_lng":"31.4019191265"},{"hotel_id":"202231","hotel_index":10,"hotel_chinesename":"\u827e\u7f8e\u91d1\u5b57\u5854\u9152\u5e97\u53caSpa\u4e2d\u5fc3","hotel_englishname":"Le M\u00e9ridien Pyramids Hotel & Spa","hotel_qyer_star":"5","hotel_rank":"24","hotel_count":199,"hotel_reference_price":667.785,"hotel_price":"385.40","hotel_price_currency":"CNY","hotel_price_discount":42,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/le-meridien-pyramids-giza.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16118\/20593307\/1410523067\/90","hotel_lat":"29.9887649966","hotel_lng":"31.1299216747"},{"hotel_id":"268432","hotel_index":11,"hotel_chinesename":"\u5c3c\u7f57\u6cb3\u5927\u53a6\u9152\u5e97","hotel_englishname":"Grand Nile Tower","hotel_qyer_star":"5","hotel_rank":"21","hotel_count":199,"hotel_reference_price":9631.975,"hotel_price":"444.91","hotel_price_currency":"CNY","hotel_price_discount":95,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/grand-nile-tower.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/348358\/6047786\/1411444047\/90","hotel_lat":"30.0338326597","hotel_lng":"31.2270069122"},{"hotel_id":"239278","hotel_index":12,"hotel_chinesename":"\u5f00\u7f57\u51ef\u5bbe\u65af\u57fa\u5c3c\u7f57\u9152\u5e97","hotel_englishname":"Kempinski Nile Hotel, Cairo","hotel_qyer_star":"5","hotel_rank":"6","hotel_count":199,"hotel_reference_price":9631.975,"hotel_price":"727.75","hotel_price_currency":"CNY","hotel_price_discount":92,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/kempinski-nile-cairo.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/247640\/5811295\/1427408024\/90","hotel_lat":"30.0386578013","hotel_lng":"31.2303435802"},{"hotel_id":"202177","hotel_index":13,"hotel_chinesename":"\u5f00\u7f57\u57c3\u5c14\u8428\u62c9\u59c6\u548c\u7766\u9152\u5e97","hotel_englishname":"Concorde El Salam Hotel Cairo","hotel_qyer_star":"5","hotel_rank":"18","hotel_count":199,"hotel_reference_price":1681.775,"hotel_price":"703.29","hotel_price_currency":"CNY","hotel_price_discount":58,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/swissotelcairo.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/16014\/13576126\/1410522787\/90","hotel_lat":"30.1199420423","hotel_lng":"31.3507651398"},{"hotel_id":"292920","hotel_index":14,"hotel_chinesename":"\u536b\u62a5\u65c5\u9986","hotel_englishname":"Guardian Guest House","hotel_qyer_star":"2","hotel_rank":"51","hotel_count":199,"hotel_reference_price":183.465,"hotel_price":"183.47","hotel_price_currency":"CNY","hotel_price_discount":false,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/guardian-guest-house.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/447854\/25016077\/1411721127\/90","hotel_lat":"29.9749321525","hotel_lng":"31.1410582065"},{"hotel_id":"211518","hotel_index":15,"hotel_chinesename":"\u5f00\u7f57\u57c3\u4f2f\u683c\u8bfa\u6c83\u7279\u9152\u5e97","hotel_englishname":"Hotel Novotel Cairo El Borg","hotel_qyer_star":"4","hotel_rank":"20","hotel_count":199,"hotel_reference_price":516.765,"hotel_price":"519.82","hotel_price_currency":"CNY","hotel_price_discount":false,"hotel_booking_url":"http:\/\/www.booking.com\/hotel\/eg\/novotel-cairo-el-borg.html","hotel_photo":"http:\/\/pic.qyer.com\/partner\/48622\/26373621\/1410618211\/90","hotel_lat":"30.0444485897","hotel_lng":"31.2269639968"}],"count":199,"counts":199,"pager":"<div class=\"ui_page\"><a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|1\" href=\"javascript:1(1)\" class='ui_page_item ui_page_item_current'>1<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|2\" href=\"javascript:1(2)\" class='ui_page_item'>2<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|3\" href=\"javascript:1(3)\" class='ui_page_item'>3<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|4\" href=\"javascript:1(4)\" class='ui_page_item'>4<\/a>\n<a data-bn-ipg=\"pages-3\" data-ra_arg=\"ra_null|5\" href=\"javascript:1(5)\" class='ui_page_item'>5<\/a>\n<a data-bn-ipg=\"pages-4\" data-ra_arg=\"ra_null|14\" href=\"javascript:1(14)\" class='ui_page_item' title=\"...14\">...14<\/a>\n<a data-bn-ipg=\"pages-5\" data-ra_arg=\"ra_null|2\" href=\"javascript:1(2)\" class='ui_page_item ui_page_next' title=\"\u4e0b\u4e00\u9875\">\u4e0b\u4e00\u9875<\/a>\n<\/div>"}}
            };
            var timer = setTimeout(function() {
                callback(data[params.type]);
            }, 0);
            return {
                abort: function() {
                    clearTimeout(timer);
                }
            };*/

            return service.get(urls.getPoiList, params, callback, error);
        },

        //获取poi详细信息
        getPoiDetail: function(params, success, error) {
            var timer = setTimeout(function() {
                success(window.test={
                    "error_code": 0,
                    "result": "ok",
                    "data": {
                        "chinesename": "协和广场",
                        "englishname": "Place de la Concorde",
                        "introduction": "<p>协和广场(Place de la Concorde)，法国巴黎市中心的一个大广场，面积约8.4万平方米。\n广场的中心摆放著巨大的埃及方尖碑，上头装饰著象形文字赞扬法老王拉美西斯二世的统治。方尖碑曾经竖立在卢克索神庙的入口处。1829年，奥斯曼帝国的埃及总督穆罕默德·阿里把卢克索方尖碑送给法国。方尖碑在1833年12月21日抵达巴黎，三年之后，1836年10月25日，法国国王路易菲利浦将它竖立在协和广场的中央。因为原始的尖顶遗失，1998年法国政府在方尖碑的顶端加上了金色的金字塔尖顶。</p>\n",
                        "url": "http://place.qyer.com/poi/V2AJZVFiBzNTZg/",
                        "photo": [
                            "http://pic.qyer.com/album/user/238/32/Q0pdQRgFYw/index/90",
                            "http://pic.qyer.com/album/1be/f8/2060529/index/90"
                        ],
                        "discount": [
                            {
                                "title": "520秒杀1520秒杀1520秒杀1520秒杀1520秒杀1520秒杀1520秒杀1自由行11",
                                "price": "<em>11</em>元起",
                                "url": "http://z.qyer.com/deal/20283/"
                            }
                        ],
                        "hotel": {
                            currency_code: "CNY",
                            nearby_hotel_count: 19,
                            percent: 10,
                            price: "56.06",
                            search_url: "http://www.qyer.com/goto.php?url=http%3A%2F%2Fwww.booking.com%2Fsearchresults.html%3Flatitude%3D29.975294%26longitude%3D31.137732%26radius%3D5000%3Faid%3D362577%26si%3Dai%252Cco%252Cci%252Cre%252Cdi%26label%3Dguid_56a9eb36-c698-e9a5-f28c-13334a1e0c4b_datetime_14600861154794%26lang%3Dzh-cn%26ifl%3D%26ss%3D",
                            url: "http://www.booking.com/hotel/eg/pyramids-view-cairo1.html"
                        },
                        "planto": 1
                    }
                });
            }, 0);
            return {
                abort: function() {
                    clearTimeout(timer);
                }
            };

            return service.get(urls.getPoiDetail, params, success, error);
        },
        getOtherCategoryPoi: function(params, success, error) {
            var callback = function(data) {
                if(data.data) {
                    var fun = data.data.fun;
                    poiService._poiListFilter({type: poiService.TYPE.FUN}, fun);

                    var hotel = data.data.hotel && data.data.hotel.res;
                    poiService._poiListFilter({type: poiService.TYPE.HOTEL}, hotel);
                    //覆盖hotel（统一接口为数组，实际接口返回的是object）
                    hotel && (data.data.hotel = hotel);

                    var food = data.data.food;
                    poiService._poiListFilter({type: poiService.TYPE.FOOD}, food);
                }

                //console.log('getOtherCategoryPoi', data);

                success(data);
            };

            return service.get(urls.getOtherCategoryPoi, params, callback, error);
        }
    };
    return poiService;
});