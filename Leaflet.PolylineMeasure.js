(function (factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD
        define(['leaflet'], factory);
    } else if (typeof module !== 'undefined') {
        // Node/CommonJS
        module.exports = factory(require('leaflet'));
    } else {
        // Browser globals
        if (typeof window.L === 'undefined') {
            throw new Error('Leaflet must be loaded first');
        }
        factory(window.L);
    }
}(function (L) {
	var _measureControlId = 'polyline-measure-control';
	var _unicodeClass = 'polyline-measure-unicode-icon';
	/**
	 * Polyline Measure class
	 * @extends L.Control
	 */
	L.Control.PolylineMeasure = L.Control.extend({

		/**
		 * Default options for the tool
		 * @type {Object}
		 */
		options: {
			/**
			 * Position to show the control. Possible values are: 'topright', 'topleft', 'bottomright', 'bottomleft'
			 * @type {String}
			 * @default
			 */
			position: 'topleft',
			/**
			 * Show imperial or metric distances
			 * @type {Boolean}
			 * @default
			 */
			imperial: false,
			/**
			 * Title for the control
			 * @type {String}
			 * @default
			 */
			measureControlTitle: '',
			/**
			 * HTML to place inside the control. This should just be a unicode icon
			 * @type {String}
			 * @default
			 */
			measureControlLabel: '&#8614;',
			/**
			 * Classes to apply to the control
			 * @type {Array}
			 * @default
			 */
			measureControlClasses: [],
			/**
			 * Background color for control when selected
			 * @type {String}
			 * @default
			 */
			backgroundColor: '#8f8',
			/**
			 * Cursor type to show when creating measurements
			 * @type {String}
			 * @default
			 */
			cursor: 'crosshair',
			/**
			 * Clear the measurements on stop
			 * @type {Boolean}
			 * @default
			 */
			clearMeasurementsOnStop: true,
			/**
			 * Show a control to clear all the measurements
			 * @type {Boolean}
			 * @default
			 */
			showMeasurementsClearControl: false,
			/**
			 * Title text to show on the clear measurements control button
			 * @type {String}
			 * @default
 			 */
			clearControlTitle: 'Clear',
			/**
			 * Clear control inner html
			 * @type {String}
			 * @default
 			 */
			clearControlLabel: '&times;',
			/**
			 * Collection of classes to add to clear control button
			 * @type {Array}
			 * @default
			 */
			clearControlClasses: [],
			/**
			 * Styling settings for the temporary dashed line
             * @type {Object}
			 */
			tempLine: {
				/**
				 * Dashed line color
				 * @type {String}
				 * @default
				 */
				color: '#00f',
				/**
				 * Dashed line weight
				 * @type {Number}
				 * @default
				 */
				weight: 2
			},
			/**
			 * Styling for the solid line
			 * @type {Object}
			 */
			fixedLine: {
				/**
				 * Solid line color
				 * @type {String}
				 * @default
				 */
				color: '#006',
				/**
				 * Solid line weight
				 * @type {Number}
				 * @default
				 */
				weight: 2
			},
            /**
             * Style settings for circle marker indicating the starting point of the polyline
             * @type {Object}
             */
			startCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
				color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
				weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
				fillColor: '#0f0',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
				fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
				radius: 3
			},
            /**
             * Style settings for all circle markers between startCircle and endCircle
             * @type {Object}
             */
            intermedCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
				color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
				weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
				fillColor: '#ff0',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
				fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
				radius: 3
			},
            /**
             * Style settings for circle marker indicating the latest point of the polyline during drawing a line
             * @type {Object}
             */
			currentCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#f0f',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 3
			},
            /**
             * Style settings for circle marker indicating the end point of the polyline
             * @type {Object}
             */
			endCircle: {
                /**
                 * Color of the border of the circle
                 * @type {String}
                 * @default
                 */
                color: '#000',
                /**
                 * Weight of the circle
                 * @type {Number}
                 * @default
                 */
                weight: 1,
                /**
                 * Fill color of the circle
                 * @type {String}
                 * @default
                 */
                fillColor: '#f00',
                /**
                 * Fill opacity of the circle
                 * @type {Number}
                 * @default
                 */
                fillOpacity: 1,
                /**
                 * Radius of the circle
                 * @type {Number}
                 * @default
                 */
                radius: 3
			}
		},

		/**
		 * Method to fire on add to map
		 * @param {Object} 		map 	Map object
		 * @returns {Element}			Containing element
		 */
		onAdd: function(map) {
			var self = this;
			self._container = document.createElement('div');
			self._container.classList.add('leaflet-bar');
			L.DomEvent.disableClickPropagation(self._container); // otherwise drawing process would instantly start at controls' container or double click would zoom-in map
			var title = self.options.measureControlTitle ? self.options.measureControlTitle : 'Polyline Measure ' + (self.options.imperial ? '[imperial]' : '[metric]');
			var label = self.options.measureControlLabel;
			var classes = self.options.measureControlClasses;
			if (label.indexOf('&') != -1) {
				classes.push(_unicodeClass);
			}
			self._measureControl = self._createControl(label, title, classes, self._container, self._toggleMeasure, self);
			self._measureControl.setAttribute('id', _measureControlId);
			if (self.options.showMeasurementsClearControl) {
				var title = self.options.clearControlTitle;
                var label = self.options.clearControlLabel;
                var classes = self.options.clearControlClasses;
                if (label.indexOf('&') != -1) {
                    classes.push(_unicodeClass);
                }
                self._clearMeasureControl = self._createControl(label, title, classes, self._container, self._clearAllMeasurements, self);
                self._clearMeasureControl.classList.add('polyline-measure-clearControl')
			}
			return self._container;
		},

		/**
		 * Create a control button
		 * @param {String} 		label		    Label to add
		 * @param {String} 		title			Title to show on hover
		 * @param {Array} 		classesToAdd	Collection of classes to add
		 * @param {Element} 	container		Parent element
		 * @param {Function} 	fn				Callback function to run
		 * @param {Object} 		context			Context
		 * @returns {Element}					Created element
		 * @private
		 */
		_createControl: function (label, title, classesToAdd, container, fn, context) {
			var anchor = document.createElement('a');
			anchor.innerHTML = label;
			anchor.setAttribute('title', title);
			classesToAdd.forEach(function(c) {
				anchor.classList.add(c);
			});
			L.DomEvent.on (anchor, 'click', fn, context);
			container.appendChild(anchor);
			return anchor;
		},

		/**
		 * Toggle the measure functionality on or off
		 * @private
		 */
		_toggleMeasure: function () {
			var self = this;
			self._measuring = !self._measuring;
		    // if measuring being switched on
            if (self._measuring) {
				self._measureControl.style.backgroundColor = self.options.backgroundColor;
                self._oldCursor = self._map._container.style.cursor;          // save former cursor type
                self._map._container.style.cursor = self.options.cursor;
                self._doubleClickZoom = self._map.doubleClickZoom.enabled();  // save former status of doubleClickZoom
                self._map.doubleClickZoom.disable();
                self._map.on ('mousemove', self._mouseMove, self);   //  enable listing to 'mousemove', 'click', 'keydown' events
                self._map.on ('click', self._mouseClick, self);
                L.DomEvent.on (document, 'keydown', self._onKeyDown, self);
                // create LayerGroup "layerPaint" (only) the first time Measure Control is switched on
                if (!self._layerPaint) {
                    self._layerPaint = L.layerGroup().addTo(self._map);
                // init Variables, but just there isn't any line on the map whoch has been drawn before
                }
                if (!self._cntLine) {
                    self._cntLine = 0;
                    self._arrFixedLines = [];
                    self._arrTooltips = [];
                }
                self._resetPathVariables();
			// if measuring being switched off
            } else {
				self._measureControl.removeAttribute('style');
				self._map._container.style.cursor = self._oldCursor;
                self._map.off ('mousemove', self._mouseMove, self);
                self._map.off ('click', self._mouseClick, self);
                L.DomEvent.off (document, 'keydown', self._onKeyDown, self);
                if(self._doubleClickZoom) {
                    self._map.doubleClickZoom.enable();
                }
                if(self.options.clearMeasurementsOnStop && self._layerPaint) {
                    self._clearAllMeasurements();
                }
                // to remove temp. Line if line at the moment is being drawn and not finished while clicking the control
                if (self._cntCircle !== 0) {
                    self._finishPath();
                }
			}
		},

		/**
		 * Clear all measurements from the map
		 */
		_clearAllMeasurements: function() {
			var self = this;
			if (self._cntCircle !== 0) {
                    self._finishPath();
            }
            if (self._layerPaint) {
				self._layerPaint.clearLayers();
			}
            self._cntLine = 0;
            self._arrFixedLines = [];
            self._arrTooltips = [];
		},

        /**
         * Event to fire when a keyboard key is depressed.
         * Currently only watching for ESC key (= keyCode 27). 1st press finishes line, 2nd press turns Measutring off.
         * @param {Object} e Event
         * @private
         */
        _onKeyDown: function (e) {
			var self = this;
			if(e.keyCode == 27) {
				// if NOT drawing a line (= there's no currentCircle)
				if(!self._currentCircle) {
                    self._toggleMeasure();
				} else {
					self._finishPath(e);
				}
			}
		},

        /**
         * Get the distance in the format specified in the options
         * @param {Number} distance Distance to convert
         * @returns {{value: *, unit: *}}
         * @private
         */
		_getDistance: function (distance) {
			var self = this;
			var dist = distance;
			var unit;
			if (self.options.imperial === true) {
				unit = "mi";
				if (dist >= 1609344) {
					dist = (dist/1609.344).toFixed(0);
				} else if (dist >= 160934.4) {
					dist = (dist/1609.344).toFixed(1);
					// don't use 3 decimal digits, cause especially in countries using the "." as thousands seperator a number could optically be confused (e.g. "1.234mi": is it 1234mi or 1,234mi ?)
				} else if (dist >= 1609.344) {
					dist = (dist/1609.344).toFixed(2);
				} else {
					dist = (dist/0.9144).toFixed(1);
					unit = "yd";
				}
			} else {
				unit = "km";
				if (dist >= 1000000) {
					dist = (dist/1000).toFixed(0);
				} else if (dist >= 100000) {
					dist = (dist/1000).toFixed(1);
					// don't use 3 decimal digits, cause especially in countries using the "." as thousands seperator a number could optically be confused (e.g. "1.234km": is it 1234km or 1,234km ?)
				} else if (dist >= 1000) {
					dist = (dist/1000).toFixed(2);
				} else {
					dist = (dist).toFixed(1);
					unit = "m";
				}
			}
			return {value:dist, unit:unit};
		},

        /**
         * Update the tooltip distance
         * @param {Number} total        Total distance
         * @param {Number} difference   Difference in distance between 2 points
         * @private
         */
		_updateTooltipDistance: function(total, difference) {
			var self = this;
			var totalRound = self._getDistance(total);
			var differenceRound = self._getDistance(difference);
			var text = '<div class="polyline-measure-tooltip-total">' + totalRound.value + '&nbsp;' +  totalRound.unit + '</div>';
			if (differenceRound.value > 0 ) {
				text += '<div class="polyline-measure-tooltip-difference">(+' + differenceRound.value + '&nbsp;' +  differenceRound.unit + ')</div>';
			}
			self._tooltip._icon.innerHTML = text;
		},
        
		/**
		 * Event to fire on mouse move
		 * @param {Object} e Event
		 * @private
		 */
		_mouseMove: function(e) {
			var self = this;
            self._map.on ('click', self._mouseClick, self);  // necassary for _dragCircle. If switched on already within _dragCircle an unwanted click is fired at the end of the drag.
			if(!e.latlng || !self._currentCircle) {
				return;
			}
            self._tempLine.setLatLngs ([self._currentCircleCoords, e.latlng]);
            self._tooltip.setLatLng(e.latlng);
            var distance = e.latlng.distanceTo (self._currentCircleCoords);
            self._updateTooltipDistance (self._distance + distance, distance);
		},

		/**
		 * Event to fire on mouse click
		 * @param {Object} e Event
		 * @private
		 */
		_mouseClick: function(e) {
			var self = this;
			if (!e.latlng) {
				return;
			}
			// If we have a tooltip, update the distance and create a new tooltip,
			// leaving the old one exactly where it is (i.e. where the user has clicked)

            if(!self._tempLine) {
				self._tempLine = L.polyline ([], {
					// Style of temporary, dashed line while moving the mouse
					color: self.options.tempLine.color,
					weight: self.options.tempLine.weight,
					interactive: false,
					dashArray: '8,8'
				}).addTo(self._layerPaint).bringToBack();  // to move tempLine behind startCircle
			}

            if (self._currentCircle) {
				self._tooltip.setLatLng (e.latlng);
				var distance = e.latlng.distanceTo (self._currentCircleCoords);
				self._updateTooltipDistance (self._distance + distance, distance);
                self._arrTooltipsCurrentline.push (self._tooltip);
                self._distance += distance;
                self._currentCircle.off ('click', self._finishPath, self);
                var circleStyle = self.options.intermedCircle;
                // if just the startCircle is drawn yet

                if (self._cntCircle === 1) {
                    circleStyle = self.options.startCircle;
                    self._fixedLine = L.polyline([self._currentCircleCoords], {
                        // Style of fixed, solid line after mouse is clicked
                        color: self.options.fixedLine.color,
                        weight: self.options.fixedLine.weight,
                        interactive: false
                    }).addTo(self._layerPaint).bringToBack();   // to move the line behind the startCircle
                }
                self._currentCircle.setStyle ({
                    color: circleStyle.color,
                    weight: circleStyle.weight,
                    fillColor: circleStyle.fillColor,
                    fillOpacity: circleStyle.fillOpacity,
                    radius: circleStyle.radius
                });
                self._currentCircle.on ('mousedown', self._dragCircle, self);
			}

            self._prevTooltip = self._tooltip;
			var icon = L.divIcon({
				className: 'polyline-measure-tooltip',
				iconAnchor: [-4, -4]
			});

			self._tooltip = L.marker(e.latlng, {
				icon: icon,
				interactive: false
			}).addTo(self._layerPaint);
			if(self._fixedLine) {
				self._fixedLine.addLatLng(e.latlng);
			}

			// change color+radius of intermediate circle markers. These intermediate Circles are optical important, especially if a new segment of line the doesn't bend
			self._currentCircle = new L.CircleMarker(e.latlng, {
				// Style of the circle marking the latest point of the Polyline while still drawing
				color: self.options.currentCircle.color,
				weight: self.options.currentCircle.weight,
				fillColor: self.options.currentCircle.fillColor,
				fillOpacity: self.options.currentCircle.fillOpacity,
				radius: self.options.currentCircle.radius,
			}).addTo(self._layerPaint);
            self._currentCircle.cntLine = self._cntLine;
            self._currentCircle.cntCircle = self._cntCircle;
            self._cntCircle++;
            self._currentCircle.on ('click', self._finishPath, self);  // to handle a click within this circle which is the command to finish drawing the polyline
            self._currentCircleCoords = e.latlng;
		},

        /**
         * Finish the drawing of the path
         * @private
         */
		_finishPath: function(e) {
			var self = this;
            if (e) {
                L.DomEvent.stopPropagation(e);   // otherwise instantly a new line would be started because os the map.on ('click')-event.
            }
            self._currentCircle.off ('click', self._finishPath, self);
            // just execute following commands if there have been at least 2 Points of a line drawn and remove each "line" just consisting of the startCircle.
            if (self._cntCircle !== 1) {
                self._prevTooltip._icon.classList.add ('polyline-measure-tooltip-end'); // add Class e.g. another background-color to the Previous Tooltip (which is the last fixed tooltip, cause the moving tooltip is being deleted later)
                self._currentCircle.setStyle ({
				// Style of the circle marking the end of the whole Polyline
                    color: self.options.endCircle.color,
                    weight: self.options.endCircle.weight,
                    fillColor: self.options.endCircle.fillColor,
                    fillOpacity: self.options.endCircle.fillOpacity,
                    radius: self.options.endCircle.radius
                });
                self._arrFixedLines.push (self._fixedLine);
                self._cntLine++;
                self._arrTooltips.push (self._arrTooltipsCurrentline);
                self._currentCircle.on ('mousedown', self._dragCircle, self);
            } else {
                self._layerPaint.removeLayer (self._currentCircle);
            }
            self._layerPaint.removeLayer(self._tooltip);
            self._layerPaint.removeLayer(self._tempLine);
			self._resetPathVariables();
		},

        /**
         * After completing a path, reset all the values to prepare in creating the next polyline measurement
         * @private
         */
		_resetPathVariables: function() {
			var self = this;
            self._cntCircle = 0;
			self._distance = 0;
			self._tooltip = undefined;
			self._currentCircle = undefined;
			self._currentCircleCoords = undefined;
			self._fixedLine = undefined;
			self._tempLine = undefined;
            self._arrTooltipsCurrentline = [null];   // assign "null" to 1st element of array, cause there's no tooltip for 1st Circle
		},
      
        _dragCircle: function (e1) {
            var self = this;
            if ((self._measuring) && (self._cntCircle === 0)) {    // just execute drag-function if Measuring tool is active but no line is being drawn at the moment.
            
            self._map.dragging.disable();  // turn of moving of the map during drag of a circle
            self._map.off ('mousemove', self._mouseMove, self);
            self._map.off ('click', self._mouseClick, self);
            
            var mouseStartingLat = e1.latlng.lat;
            var mouseStartingLng = e1.latlng.lng;
            var circleStartingLat = e1.target._latlng.lat;
            var circleStartingLng = e1.target._latlng.lng;
            self._map.on ('mousemove', function (e2) {
                var mouseNewLat = e2.latlng.lat;
                var mouseNewLng = e2.latlng.lng;
                var latDifference = mouseNewLat - mouseStartingLat;
                var lngDifference = mouseNewLng - mouseStartingLng;
                var currentCircleCoords = L.latLng (circleStartingLat + latDifference, circleStartingLng + lngDifference);
                e1.target.setLatLng (currentCircleCoords);
                lineNr = e1.target.cntLine;
                circleNr = e1.target.cntCircle;
                lineCoords = self._arrFixedLines[lineNr].getLatLngs()  // get Coords of each Point of the current Polyline
                lineCoords [circleNr] = currentCircleCoords;
                self._arrFixedLines[lineNr].setLatLngs (lineCoords);
                
                if (circleNr >= 1) {     // just update tooltip position of 2nd, 3rd, 4th etc. Circle of a line
                    self._tooltip = self._arrTooltips[lineNr][circleNr];
                    self._tooltip.setLatLng(currentCircleCoords);
                }    
                self._distance = 0;
                // update tooltip texts of each tooltip but not tooltip of 1st Circle (which doesnt't have a tooltip)
                lineCoords.map (function (item, index) {    
                    if (index >= 1)  {
                        self._tooltip = self._arrTooltips[lineNr][index];
                        var distance = lineCoords[index].distanceTo (lineCoords[index-1]);
                        self._updateTooltipDistance(self._distance + distance, distance);
                        self._distance += distance;
                    }
                });
                
                self._map.on ('mouseup', function () { 
                    self._resetPathVariables();
                    self._map.off ('mousemove');
                    self._map.dragging.enable();
                    self._map.on ('mousemove', self._mouseMove, self);
                    self._map.off ('mouseup');
                });
            });
            }
        }
	});

//======================================================================================

	L.Map.mergeOptions({
		PolylineMeasureControl: false
	});

	L.Map.addInitHook(function () {
		var self = this;
		if (self.options.polylineMeasureControl) {
			self.PMControl = new L.Control.PolylineMeasure();
			self.addControl(self.PMControl);
		}
	});

	L.control.polylineMeasure = function (options) {
		return new L.Control.PolylineMeasure (options);
	};
}));