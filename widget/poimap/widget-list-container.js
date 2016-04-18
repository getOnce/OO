define(["../widget-service", '../../service/poimap/poi-service', './widget-auto-height', 'common/ui/pages/pages', 'common/ui/select/select'], function(Widget, poiService, AutoHeight, Page) {
    "use strict";
    var List = Widget.createClass({
        load: function(data, success, error) {
            this.$().removeClass(this.constructor.CLASSNAME.NODATA);
            this.$().addClass(this.constructor.CLASSNAME.LOADING);

            return this.callSuper(data, this.proxy(function() {
                this.$().removeClass(this.constructor.CLASSNAME.LOADING);
                success && success.apply(this, arguments);
            }), this.proxy(function() {
                this.$().removeClass(this.constructor.CLASSNAME.LOADING);
                error && error.apply(this, arguments);
            }));
        },
        getItemSelector: function() {
            return this.constructor.SELECTOR.ITEM;
        },
        $item: function(id) {
            return id ? this.$('[data-id="' + id + '"]', this.getItemSelector()) : this.$(this.getItemSelector());
        },
        $currentItem: function() {
            return this.$('.' + this.constructor.CLASSNAME.ON, this.getItemSelector());
        },
        getCurrentId: function() {
            return this.$currentItem().data('id') || 0;
        },
        change: function($node) {
            this.highlight($node);
            this.trigger(this.constructor.EVENTS.CHANGE);
        },
        highlight: function($node) {
            var className = this.constructor.CLASSNAME.ON;
            this.$item().removeClass(className);
            $node.addClass(className);
        }
    }, {
        SELECTOR: {
            ITEM: '>li'
        },
        CLASSNAME: {
            ON: 'on',
            NODATA: 'nodata',
            LOADING: 'loading'
        },
        EVENTS: {
            CHANGE: 'change-event'
        }
    });
    //头部 tags选择
    var Tags = List.createClass({
        events: [
            ['click', '_evt_click', 'li']
        ],
        _evt_click: function(evt) {
            this.change($(evt.currentTarget));
        },
        checkData: function(data) {
            this.$()[data && data.data && data.data.length ? 'removeClass' : 'addClass'](this.constructor.CLASSNAME.NODATA);
            return this.callSuper.apply(this, arguments);
        }
    }, {
        ATTRS: {
            $template: '#tags-tpl'
        }
    });

    //头部 吃住玩tabs
    var Tabs = Tags.createClass({
        change: function($node) {
            this.callSuper.apply(this, arguments);
            this.setSeparation($node);
        },
        //根据当前高亮的node获取需要设置分隔符的node数组
        $separation: function($node) {
            return this.$item().not(':last').not($node).not($node.prev())
        },
        setSeparation: function($node) {
            var className = this.constructor.CLASSNAME.SEPARATION;
            this.$item().removeClass(className);
            this.$separation($node).addClass(className);
        }
    }, {
        CLASSNAME: {
            SEPARATION: 'separation'
        }
    });

    var PoiListBase = List.createClass({
        events: [
            ['mouseenter', '_evt_mouseenter', '>li']
        ],
        _evt_mouseenter: function(evt) {
            this.change($(evt.currentTarget));
        },
        highlight: function($node) {
            var className = this.constructor.CLASSNAME.ON;
            this.$currentItem().find('.pin').removeClass(className);
            this.callSuper.apply(this, arguments);
            this.$currentItem().find('.pin').addClass(className);
            this.scrollIntoView($node);
        },
        scrollIntoView: function($node) {
            var top = $node.offset().top - this.$().offset().top;
            var scrollTop = this.$().parent().scrollTop();
            if(top < scrollTop
                || top + $node.height() > scrollTop + this.$().parent().height()) {
                this.$().parent().stop().animate({
                    scrollTop: top
                });
            }
        },
        load: function(params) {
            var type = params.type;
            var cateid = params.cateid;
            var args = Array.prototype.slice.apply(arguments);
            args[0] = this.params = $.extend({
                type: type,
                id: PLACE.PID,//国家或城市的id
                typename: PLACE.TYPE,//国家或城市(city|country)
                //hotel类型为空，food类型为78
                cateid: type === poiService.TYPE.HOTEL ? '' : type === poiService.TYPE.FOOD ? 78 : cateid,
                page: params.page,
                bottom_coordinate: '',
                top_coordinate: '',
                //hotel类型为星级，其他类型传空字符串
                qyer_star: type === poiService.TYPE.HOTEL ? cateid || this.params.qyer_star : '',
                //hotel类型为排序，其他类型传空字符串
                order_type: type === poiService.TYPE.HOTEL ? params.order_type : ''
            }, this.getCoordinate());

            this.$().empty();
            this.callSuper.apply(this, args);
        },
        checkData: function(data) {
            var hasData = data && data.data && data.data.res && data.data.res.length;
            this.$()[hasData ? 'removeClass' : 'addClass'](this.constructor.CLASSNAME.NODATA);
            return this.callSuper.apply(this, arguments);
        },
        refresh: function(params, success, error) {
            this.load($.extend(this.params || {}, params), success || function() {}, error || function() {});
        },
        getCoordinate: function() {
            return {
                bottom_coordinate: '',
                top_coordinate: ''
            };
        }
    }, {
        ATTRS: {
            $template: '#poi-list-tpl',
            service: poiService.getPoiList
        }
    });
    var PoiList = PoiListBase.createClass({
        load: function() {
            this.page && this.page.hide();
            this.callSuper.apply(this, arguments);
        },
        render: function(data) {
            this.callSuper.apply(this, arguments);
            this.initPage({
                total: data && data.data && data.data.count || 0
            });
        },
        initPage: function(obj) {
            this.destroyPage();
            if(obj.total <= this.pageCount){
                return;
            }
            $('<div id="listPage"></div>').appendTo('#listWrap');
            this.page = new Page({
                container: "#listPage",
                allCount: obj.total,
                curNum: this.params.page || 1,
                preCountNum: 2,
                nextCountNum: 2,
                pageCount: this.pageCount,
                preLabel:"上一页",
                nextLabel:"下一页"
            });
            this.page.render();
            $(this.page).unbind("firepage").bind("firepage", this.proxy(function(evt, idx) {
                this.refresh({
                    page: idx
                });
            }));
        },
        destroyPage: function() {
            this.page && this.page.destroy();
            this.page = null;
            $("#listPage").remove();
        }
    }, {
        ATTRS: {
            //每个页面总数量
            pageCount: 15,
        }
    });

    return Widget.createClass({
        init: function(params) {
            this.callSuper.apply(this, arguments);
            this.initList();
            this.initTabs();
            this.initTags();
            this.initSort();

            this.refresh();
        },
        initTabs: function() {
            // 头部tabs（玩、住、吃）
            this.tabs = new Tabs({
                $el: this.$('>.nav')
            }).on(Tabs.EVENTS.CHANGE, this.proxy(function() {
                this.refresh();
            }));
        },
        initTags: function() {
            this.tags = new Tags({
                $el: this.$('>.tags'),
                service: poiService.getPoiCate
            }).after('render', this.proxy(function() {
                this.autoHeight.setHeight();
            })).on(Tags.EVENTS.CHANGE, this.proxy(function() {
                this.list.refresh({
                    page: 1,
                    cateid: this.tags.getCurrentId()
                });
            }));
        },
        initList: function() {
            this.autoHeight = new AutoHeight({
                $el: '#listWrap'
            });
            this.list = new PoiList({
                $el: '#mapPlaceList'
            }).before('render', this.proxy(function(data) {
                this.setMsg(data);
                this.trigger(this.constructor.EVENTS.REFRESH, data);
            })).after('render', this.proxy(function() {
                this.autoHeight.setHeight();
            }));
        },
        initSort: function() {
            $('#sort').qyerSelect({
                onChange: this.proxy(function(node) {
                    this.list.refresh({
                        page: 1,
                        order_type: $(node).data('value')
                    });
                })
            });

            this.tabs.on(Tabs.EVENTS.CHANGE, this.proxy(function() {
                this.resetSort();
            }));
        },
        resetSort: function() {
            $('#sort').qyerSelect('setValue','1');
        },
        setMsg: function(data) {
            this.$msg.html(data ? this.getMsg(data) : '');
        },
        getMsg: function(data) {
            var count = data && data.data && data.data.count || 0;
            switch(this.tabs.getCurrentId()) {
                case 'fun': return '当前区域不可错过的' + count + '个去处';
                case 'hotel': return '当前区域' + count + '家酒店';
                case 'food': return '当前区域美食' + count + '个';
            }
        },
        refresh: function(type) {
            type = type || this.tabs.getCurrentId();
            this.$().removeClass().addClass('qmap-left loading type-' + type);
            this.tags.load(type, this.proxy(function(data) {
                this.$().removeClass('loading');
                this.list.refresh({
                    page: 1,
                    type: type,
                    cateid: this.tags.getCurrentId()
                });
            }), this.proxy(function(err) {
                this.$().removeClass('loading');
            }));
        }
    }, {
        ATTRS: {
            tabs: null,
            tags: null,
            autoHeight: null,
            list: null,
            $msg: '.msg,.criteria>span'
        },
        EVENTS: {
            REFRESH: 'refresh-event'
        }
    });
});