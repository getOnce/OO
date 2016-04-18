define(["../widget-service", '../../service/poimap/poi-service', 'common/ui/gmap/gmap3', './widget-auto-height'], function(Widget, poiService, mapUtils, AutoHeight) {
    "use strict";
    var SimpleCard = Widget.createClass({
        events: [
            ['mousemove', function(evt) {
                evt.stopPropagation();
            }]
        ],
        init: function() {
            var args = Array.prototype.slice.apply(arguments);
            args[0] = args[0] || {};
            args[0].$el = $('<div></div>');
            this.callSuper.apply(this, args);
        },
        initInfoWindow: function() {
            !this.infoWindow && (this.infoWindow = mapUtils.createDiyInfoWindow({
                content: this.$()[0],
                pixelOffset: new google.maps.Size(-this.getSize().width/2 + this.pixelOffset.x || 0, this.pixelOffset.y || 0)
            }));
        },
        getSize: function() {
            var $node = this.$();
            if($node.parent().length === 0) {
                $node.addClass(this.constructor.CLASSNAME.FRAGMENT).appendTo(document.body);
                var size = this._getSize();
                $node.removeClass(this.constructor.CLASSNAME.FRAGMENT).appendTo(document.createDocumentFragment());
                return size;
            }
            return this._getSize();
        },
        _getSize: function() {
            return {
                width: this.$().width(),
                height: this.$().height()
            };
        },
        render: function() {
            this.callSuper({data: this.poi});
            this.open();
        },
        open: function() {
            this.initInfoWindow();
            this.infoWindow.open(mapUtils.map, this.marker);
        },
        close: function() {
            this.abort();
            this.infoWindow && this.infoWindow.close();
        }
    }, {
        ATTRS: {
            $template: '#simple-card-tpl',
            poi: null,
            marker: null,
            pixelOffset: {
                x: 0,
                y: -60
            }
        },
        CLASSNAME: {
            FRAGMENT: 'fragment'
        }
    });
    var Card = SimpleCard.createClass({
        load: function(success, error) {
            return this.callSuper({id: this.poi.id, type: this.poi.type}, this.proxy(function(data) {
                $.extend(this.poi, data && data.data);
                success && success(data);
            }), error);
        }
    }, {
        ATTRS: {
            $template: '#card-tpl',
            service: poiService.getPoiDetail,
        }
    });
    var OtherCard = SimpleCard.createClass();

    return Widget.createClass({
        mapUtils: mapUtils,
        init: function(param) {
            this.callSuper.apply(this, arguments);

            this.autoHeight = new AutoHeight({
                $el: this.$()
            });
            this.autoHeight.setHeight();

            this.initMap();
        },
        mapAlready: false,
        initMap: function(callback) {
            $(mapUtils).one("mapalready", this.proxy(function() {
                this.mapAlready = true;
                callback && callback();
            }));
            mapUtils.init('map', {
                streetViewControl: true,
                lat: this.lat,
                lng: this.lng
            });
        },
        ready: function(callback) {
            if(this.mapAlready) {
                callback && callback();
                return;
            } else {
                $(mapUtils).one("mapalready", function(){
                    callback && callback();
                });
            }
        },
        empty: function() {
            window.mapUtils = mapUtils;
            this.closeCard();
            mapUtils.empty();
            this.emptyCircle();
        },
        addEvent: function(marker, evtType, callback) {
            $.isArray(marker) ? $.each(marker, this.proxy(function(i, item) {
                this.addEvent(item, evtType, callback);
            })) : mapUtils.addEvent(marker, evtType, callback);
        },
        getIconOption: function(item, i) {
            return {
                url: "http://place.qyerstatic.com/project/images/map/map-marker-2016" + (window.devicePixelRatio > 1 ? '@2x.png' : '.png'),
                size: {
                    w: 28,
                    h: 39
                },
                point: {
                    x: 68,
                    y: 45 * i
                },
                scaledSize: {
                    width: 300,
                    height: 1200
                }
            };
        },
        getBigIconOption: function(item, i) {
            return $.extend(this.getIconOption.apply(this, arguments), {
                size: {
                    w: 36,
                    h: 51
                },
                point: {
                    x: 108,
                    y: 55 * i - 1
                }
            });
        },
        createMarkerOption:function(item, i, iconOptionCallback) {
            return {
                lat: item.lat,
                lng: item.lng,
                icon: iconOptionCallback.call(this, item, i),
                poi: item
            };
        },
        createMarkersOption:function(data, iconOptionCallback) {
            var marker = [];
            $.each(data, this.proxy(function(i, item) {
                marker.push(this.createMarkerOption(item, i, iconOptionCallback));
            }));
            return marker;
        },
        addMarkersByData: function(poiArr, fitBounds) {
            var markersOption = this.createMarkersOption(poiArr, this.getIconOption);
            var markers = this.addMarkers(markersOption);
            fitBounds && mapUtils.fitBounds(markers);
            return markers;
        },
        /**
         * 在地图上打点
         * @method addMarker
         * @param obj{object}地图上的点的设置{icon:{url:"",size:{},point:{}},lat:"",lng:""}
         */
        addMarker: function(obj) {
            return mapUtils.addMarker(obj);
        },
        addMarkers: function(markers) {
            return $.map(markers, this.proxy(function(item) {
                return this.addMarker(item);
            }));
        },
        getMarkerByPoi: function(poi) {
            var markers = mapUtils.map.markers || [];
            for(var i = 0, marker; marker = markers[i]; i++) {
                if(marker.poi.id == poi.id) return marker;
            }
        },
        getPoiByMarker: function(marker) {
            return marker.poi;
        },
        bindMarkersEvent: function(markers) {
            markers && $.each(markers, this.proxy(function(i, marker) {
                this.bindMarkerEvent(marker);
            }));
        },
        bindMarkerEvent: function(marker) {
            var _this = this;

            this.addEvent(marker, "click", function() {
                if(!_this.currentCard || _this.currentCard.constructor === SimpleCard) {
                    _this.showCard(this);
                } else {
                    _this.closeCard();
                    _this.showIcon(this);
                }
            });
            this.addEvent(marker, "mouseover", function() {
                if(!_this.currentCard || _this.currentCard.poi.id !== _this.getPoiByMarker(marker).id) {
                    _this.showBigIcon(this);
                    _this.showSimpleCard(this);

                    _this.emptyCircle();
                    _this.addCircle({
                        center: this.getPosition()
                    });
                }
            });
            this.addEvent(marker, "mouseout", function() {
                if(!_this.currentCard || _this.currentCard.constructor === SimpleCard) {
                    _this.showIcon(this);
                    _this.closeCard(250);
                    _this.emptyCircle();
                }
            });
        },
        /*changeIcon: function(marker, iconOption) {
            var image = new Image();
            image.onload = this.proxy(function() {
                this._changeIcon(marker, iconOption);
            });
            image.src = iconOption.url;
        },*/
        changeIcon: function(marker, iconOption) {
            mapUtils.changeMarkerIcon({
                "lat": marker.position.lat(),
                "lng": marker.position.lng()
            }, {
                "icon": iconOption
            });
        },
        showIcon: function(marker) {
            marker.setZIndex(10000);
            var poi = this.getPoiByMarker(marker);
            this.changeIcon(marker, this.getIconOption(poi, poi.index));
        },
        showBigIcon: function(marker) {
            marker.setZIndex(10001);
            var poi = this.getPoiByMarker(marker);
            this.changeIcon(marker, this.getBigIconOption(poi, poi.index));
            this.currentCard && this.currentCard.constructor !== OtherCard && this.showIcon(this.currentCard.marker);
        },
        currentCard: null,
        closeCardTimer: null,
        clearCardTimer: function() {
            this.closeCardTimer && clearTimeout(this.closeCardTimer);
            this.closeCardTimer = null;
        },
        closeCard: function(delay) {
            this.clearCardTimer();
            if(delay) {
                this.closeCardTimer = setTimeout(this.proxy(this._closeCard), delay);
            } else {
                this._closeCard();
            }
        },
        _closeCard: function() {
            this.currentCard && this.currentCard.close();
            this.currentCard = null;
        },
        showCard: function(marker) {
            this.closeCard();
            var card = this.currentCard = new Card({
                poi: this.getPoiByMarker(marker),
                marker: marker
            });
            card.load(this.proxy(function() {
                
            }));
        },
        showSimpleCard: function(marker) {
            this.closeCard();
            var simpleCard = this.currentCard = new SimpleCard({
                poi: this.getPoiByMarker(marker),
                marker: marker
            });
            simpleCard.render();
            simpleCard.delegateEvent('mouseenter', this.proxy(this.clearCardTimer));
            simpleCard.delegateEvent('mouseleave', this.proxy(function() {
                this.closeCard();
            }));
        },
        _circles: null,
        addCircle: function(option) {
            var center = mapUtils.map.getCenter();
            var circle = new google.maps.Circle($.extend({
              strokeColor: '#10b041',
              strokeOpacity: 1,
              strokeWeight: .5,
              fillColor: '#FFFFFF',
              fillOpacity: 0,
              map: mapUtils.map,
              center: center,
              radius: 5000
            }, option));

            this._circles = this._circles || [];
            this._circles.push(circle);
        },
        emptyCircle: function() {
            this._circles && $.each(this._circles, function(i, circle) {
                circle.setMap(null);
            });
            this._circles = null;
        }
    }, {
        ATTRS: {
            lat: null,
            lng: null
        }
    }).implement({
        showOtherCategoryPoi: function(params) {
            poiService.getOtherCategoryPoi(params, this.proxy(function(data) {
                if(data && data.data) {
                    var markersFun = data.data.fun && this.addOtherMarkersByData(data.data.fun);
                    var markersHotel = data.data.hotel && this.addOtherMarkersByData(data.data.hotel);
                    var markersFood = data.data.food && this.addOtherMarkersByData(data.data.food);
                    this.bindOtherMarkersEvent(markersFun);
                    this.bindOtherMarkersEvent(markersHotel);
                    this.bindOtherMarkersEvent(markersFood);

                    //交通相关marker
                    var markersTransportation = data.data.transportation && this.addTransportationMarkersByData(data.data.transportation);
                    this.bindOtherMarkersEvent(markersTransportation);
                }
            }), function() {});
        },
        bindOtherMarkersEvent: function(markers) {
            markers && $.each(markers, this.proxy(function(i, marker) {
                this.bindOtherMarkerEvent(marker);
            }));
        },
        bindOtherMarkerEvent: function(marker) {
            var _this = this;

            this.addEvent(marker, "mouseover", function() {
                if(!_this.currentCard || _this.currentCard.poi.id !== _this.getPoiByMarker(this).id) {
                    _this.showOtherCard(this);
                    _this.emptyCircle();
                }
            });
            this.addEvent(marker, "mouseout", function() {
                if(!_this.currentCard || _this.currentCard.constructor === OtherCard) {
                    _this.closeCard(250);
                }
            });
        },
        getOtherIconOption: function(item, i) {
            var y = 498;
            switch(item.type) {
                case poiService.TYPE.FUN: 
                    y = 498; break;
                case poiService.TYPE.HOTEL: 
                    y = 558; break;
                case poiService.TYPE.FOOD: 
                    y = 528; break;
            }
            return $.extend(this.getIconOption.apply(this, arguments), {
                size: {
                    w: 17,
                    h: 17
                },
                point: {
                    x: 206,
                    y: y
                }
            });
        },
        addOtherMarkersByData: function(poiArr) {
            var markersOption = this.createMarkersOption(poiArr, this.getOtherIconOption);
            var markers = this.addMarkers(markersOption);
            return markers;
        },
        showOtherCard: function(marker) {
            //如果当前打开的card不是OtherCard类，显示小图标
            var currentCard = this.currentCard;
            currentCard && !(currentCard.constructor === OtherCard) && this.showIcon(currentCard.marker);
            this.closeCard();

            var poi = this.getPoiByMarker(marker);
            var otherCard = this.currentCard = new OtherCard({
                poi: poi,
                marker: marker,
                pixelOffset: {
                    x: 0,
                    y: poi.transporation_tag_type ? -45 : -28
                }
            });
            otherCard.render();
            otherCard.delegateEvent('mouseenter', this.proxy(this.clearCardTimer));
            otherCard.delegateEvent('mouseleave', this.proxy(function() {
                this.closeCard();
            }));
        },

        getTransportationIconOption: function(item, i) {
            var y = 0;
            switch(item.transporation_tag_type) {
                case 'airport': 
                    y = 0; break;
                case 'bus': 
                    y = 45; break;
                case 'wharf': 
                    y = 90; break;
                case 'railway': 
                    y = 180; break;
            }
            return $.extend(this.getIconOption.apply(this, arguments), {
                size: {
                    w: 27,
                    h: 35
                },
                point: {
                    x: 158,
                    y: y
                }
            });
        },
        addTransportationMarkersByData: function(poiArr) {
            var markersOption = this.createMarkersOption(poiArr, this.getTransportationIconOption);
            var markers = this.addMarkers(markersOption);
            return markers;
        }
    });
});