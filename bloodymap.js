import React, {Component} from 'react';
import PaginationSync from './PaginationSync';
import CPagination from './Pagination';
import Footer from './Footer';

import {connect} from 'react-redux';

import $ from 'jquery';
import {YMaps, Map, ObjectManager} from 'react-yandex-maps';

import ib from './imgs/elven.jpg';	

console.log(ib);

//import {Pagination} from 'react-bootstrap';

import './map.less';    

function	getMyBalloonLayout(ymaps) { 
 var MyBalloonLayout = ymaps.templateLayoutFactory.createClass(
            '<div class="popover top">' + 
            /*'<a class="close" href="#">&times;</a>' +*/
            /*'<div class="arrow"></div>' +*/
            '<div class="popover-inner">' +
            '$[properties.balloonContent]' +   
            '</div>' +  
            '</div>', {
                build: function() {
                    this.constructor.superclass.build.call(this);
                    this._$element = $('.popover.top', this.getParentElement());
                    this.applyElementOffset();
                    //this._$element.find('.close').on('click', $.proxy(this.onCloseClick, this));
                },

                clear: function() {
                    //this._$element.find('.close').off('click');
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

                /*onCloseClick: function(e) {
                    e.preventDefault();
                    this.events.fire('userclose');
                },*/

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

 return MyBalloonLayout;

}
let mapState = {
	center: [55.76, 37.64],     
	zoom: 10
}

let mapWidth = '600px'; 
let mapHeight = '600px'; 

var that;
export default class App extends Component {
	constructor(props) {
		super(props);   
		this.state = {
			MyBalloonLayout: null
		};
		this.MyBalloonLayout = undefined;
		this.getFeatures = this.getFeatures.bind(this);  
		this.mapInitialized = this.mapInitialized.bind(this);
	} 


	componentWillReceiveProps(nextProps) {
		console.log('componentWillReceiveProps');
	}

/*	handleApiAvaliable(ymaps) {
		let layout = getMyBalloonLayout(ymaps);
		this.props.updated(layout);
	}*/

/*	componentDidMount() {
		//$(function() {
			ymaps.ready(function() {
			let layout = getMyBalloonLayout(ymaps);
				let map = new ymaps.Map(
					'native-map',
		            {
	                	center: [55.76, 37.64],
	                	zoom: 7
	        		}, 
	            	{
	            		balloonContent: 'New super Balloon!',
	                	balloonLayout: layout 
	            	}
				)

			        var objectManager = new ymaps.ObjectManager();
			        map.geoObjects.add(objectManager);

			        objectManager.add([{
			            type: 'Feature',
			            id: 1,
			            geometry: {
			                type: 'Point',
			                coordinates: [55.755381, 37.619044]
			            },
			            properties: {
			                balloonContent: 'New super Balloon!'
			            }
			        }]);			
			})
		//})
	}*/

	handleApiAvaliable(ymaps) {
		this.setState({
			MyBalloonLayout: getMyBalloonLayout(ymaps)	
		})
	}

	createFeature(coords, id) {
		return {
			type: 'Feature',
        	id,
        	geometry: {
            	type: 'Point',
            	coordinates: coords
        	},
    	    properties: {
                balloonContent: `<div class='oneone'>${id}jkkqjweiqwjewjq</div>`
            },
        	options: {
/*                balloonLayout: "default#imageWithContent",
                balloonShadow: false, 
                balloonImageHref: ib,
                balloonImageSize: [96, 96],
                hideIconOnBalloonOpen: false,
                balloonCloseButton: false ,
                balloonAutoPan: true,
                balloonShadow: false,
                balloonOffset: [30, -96]*/
        	}
		}   
	} 
  
	getFeatures() {
		let features = [[55.755381, 37.619044], [55.755381, 37.819044]];
		return features.map((coords, i) => {
			return this.createFeature(coords, i);
		}) 
	}

	mapInitialized(map) {
		map.events.add('balloonopen', function(e) {
		    map.events.add('click', function(e) {
		        if(e.get('target') === map) { // Если клик был на карте, а не на геообъекте
		            map.balloon.close();
		        }
		    });
		});
	}

	render() {
		/*return (
			<div className=''>
				<h3>Main App</h3>
				<PaginationSync reducer='offersReducer' as='offersReducer'/>
				<PaginationSync reducer='offersReducer' as='offersReducer'/>
				<PaginationSync reducer='cardsReducer' as='cardsReducer'/>
				<PaginationSync reducer='cardsReducer' as='cardsReducer'/>
				<hr/>
				<Footer/>	 
			</div>	
		)*/ 
		console.log('render');
		return (
			<div>
			<img src={ib} alt='' />
			<div>	
					<YMaps onApiAvaliable={ymaps => this.handleApiAvaliable(ymaps)}> 
 						<Map 
 							instanceRef={this.mapInitialized}
							state={mapState}
							width={mapWidth}
							height={mapHeight}
							options={{
		        				balloonLayout: this.state.MyBalloonLayout
		        			}}
						>
						<ObjectManager
							features={this.getFeatures()}
						/>
						</Map>

					</YMaps>
				</div>
{/*				<div id='box'> 
					<div id="native-map">  

					</div>
				</div>*/}
			</div>
		)
	}
}

let mapStateToProps = state => {
	return {
		b: state.mapReducer.b
	}
}

let mapDispatchToProps = dispatch => ({
	updated(b) {
		dispatch({
			type: 'B_UPDATED',
			b
		})
	}
}) 

//export default connect(mapStateToProps, mapDispatchToProps)(App);