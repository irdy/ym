var ready = (fn) => {
    document.addEventListener("DOMContentLoaded", function() {
        if (document.readyState === 'interactive') {
            fn();
        }
    });
}

ready(function() {

    ymaps.ready(init);
    var myMap;

    function init() {

        var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top">' +
            '<a class="close" href="#">&times;</a>' +
            '<div class="arrow"></div>' +
            '<div class="popover-inner">' +
            '$[properties.balloonContent]' +
            '</div>' +
            '</div>', {
                build: function() {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.popover.top', this.getParentElement());
                    this.applyElementOffset();
                    this._$element.find('.close').on('click', $.proxy(this.onCloseClick, this));
                },

                clear: function() {
                    this._$element.find('.close').off('click');
                    this.constructor.superclass.clear.call(this);
                },

                onSublayoutSizeChange: function() {
                    MyBalloonLayout.superclass.onSublayoutSizeChange.apply(this, arguments);

                    if (!this._isElement(this._$element)) {
                        return;
                    }

                    this.applyElementOffset();
                    this.events.fire('shapechange');
                },

                applyElementOffset: function() {
                    this._$element.css({
                        left: -(this._$element[0].offsetWidth / 2),
                        top: -(this._$element[0].offsetHeight),
                        position: 'relative'
                    });
                },

                onCloseClick: function(e) {
                    e.preventDefault();
                    this.events.fire('userclose');
                },

                getShape: function() {
                    if (this._isElement(this._$element)) {
                        return MyBalloonLayout.superclass.getShape.call(this);
                    }
                    var position = this._$element.position();

                    return new ymaps.shape.Rectangle(new ymaps.geometry.pixel.Rectangle([
                        [position.left, position.top],
                        [
                            position.left + this._$element[0].offsetWidth,
                            position.top + this._$element[0].offsetHeight
                        ]
                    ]));
                },

                _isElement: function(element) {
                    return element && element[0];
                }
            }
        );

        console.log(MyBalloonLayout);

        myMap = new ymaps.Map(
            "map", 
            {
                center: [55.76, 37.64],
                zoom: 7
            }, 
            {
                balloonLayout: MyBalloonLayout
            }
        );

        console.log(myMap);



        //myMap.options.set('balloonLayout', MyBalloonLayout);
        var objectManager = new ymaps.ObjectManager();
        myMap.geoObjects.add(objectManager);

        objectManager.add([{
            type: 'Feature',
            id: 1,
            geometry: {
                type: 'Point',
                coordinates: [55.755381, 37.619044]
            },
            properties: {
                balloonContent: 'New super Balloon!'
                //balloonLayout: MyBalloonLayout
            }
        }]);
        /*
                var myPlacemark = window.myPlacemark = new ymaps.Placemark(myMap.getCenter(), {
                    balloonHeader: 'Заголовок балуна',
                    balloonContent: 'Контент балуна' // properties
                }, {
                    balloonShadow: false, //
                    balloonLayout: MyBalloonLayout,
                    //balloonContentLayout: MyBalloonContentLayout,
                    balloonPanelMaxMapArea: 0
                    // Не скрываем иконку при открытом балуне.
                    // hideIconOnBalloonOpen: false,
                    // И дополнительно смещаем балун, для открытия над иконкой.
                    // balloonOffset: [3, -40]
                });

                myMap.geoObjects.add(myPlacemark);
        */
    }
});

//observeSize minWidth=235 maxWidth=235 maxHeight=350