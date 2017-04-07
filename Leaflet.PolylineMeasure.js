(function() {

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
			title: '',
			/**
			 * HTML to place inside the control. This should just be a unicode icon
			 * @type {String}
			 * @default
			 */
			innerHtml: '&#8614;',
			/**
			 * Classes to apply to the control
			 * @type {Array}
			 * @default
			 */
			classesToApply: [],
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
			clearControlInnerHtml: '&times;',
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
			line: {
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
			startingPoint: {
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
             * Style settings for circle marker indicating the last point of the polyline
             * @type {Object}
             */
			lastPoint: {
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
                fillColor: '#fa8d00',
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
             * Style settings for circle marker indicating the last point of the polyline
             * @type {Object}
             */
			endPoint: {
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
		onAdd: function (map) {
			var self = this;
			self._createContainer();
			self._createMeasurementControl();

			if (self.options.showMeasurementsClearControl) {
				self._createClearMeasurementControl();
			}

			return self._container;
		},

		/**
		 * Create the container for the controls
		 * @private
		 */
		_createContainer: function() {
			var self = this;
			var classLeafletBar = 'leaflet-bar';  // class of control-container
			self._container = document.createElement('div');
			self._container.classList.add(classLeafletBar);
			L.DomEvent.disableClickPropagation(self._container);
		},

		/**
		 * Create the measurement control
		 * @private
		 */
		_createMeasurementControl: function() {
			var self = this;
			var title = self._getTitle();
			var contents = self.options.innerHtml;
			var classes = self.options.classesToApply;

			if (contents.includes('&')) {
				classes.push(_unicodeClass);
			}

			self._measureControl = self._createControl(contents, title, classes, self._container, self._toggleMeasure, self);
			self._measureControl.setAttribute('id', _measureControlId);
		},

		/**
		 * Create a control to clear all the measurements from the map
		 * @private
		 */
		_createClearMeasurementControl: function() {
			var self = this;
			var title = self.options.clearControlTitle;
			var contents = self.options.clearControlInnerHtml;
			var classes = self.options.clearControlClasses;

			if (contents.includes('&')) {
				classes.push(_unicodeClass);
			}

			self._clearMeasureControl = self._createControl(contents, title, classes, self._container, self.clearAllMeasurements, self);
		},

		/**
		 * Get the title for the button
		 * @returns {String} The provided title or a default based on measurement type
		 * @private
		 */
		_getTitle: function() {
			var self = this;
			return self.options.title ? self.options.title : 'Polyline Measure ' + (self.options.imperial ? '[imperial]' : '[metric]');
		},

		/**
		 * Create a control button
		 * @param {String} 		contents		innerHTML to add
		 * @param {String} 		title			Title to show on hover
		 * @param {Array} 		classesToAdd	Collection of classes to add
		 * @param {Element} 	container		Parent element
		 * @param {Function} 	fn				Callback function to run
		 * @param {Object} 		context			Context
		 * @returns {Element}					Created element
		 * @private
		 */
		_createControl: function (contents, title, classesToAdd, container, fn, context) {
			var anchor = document.createElement('a');
			anchor.innerHTML = contents;
			anchor.setAttribute('title', title);

			classesToAdd.forEach(function(c) {
				anchor.classList.add(c);
			});
			L.DomEvent.on(anchor, 'click', fn, context);
			container.appendChild(anchor);
			return anchor;
		},

		/**
		 * Toggle the measure functionality on or off
		 * @private
		 */
		_toggleMeasure: function () {
			var self = this;
			this._measuring = !this._measuring;
			self._updateSelectedControl();
		},

		/**
		 * Update the control when measuring is enabled or disabled
		 * @private
		 */
		_updateSelectedControl: function() {
			var self = this;
			if(self._measuring) {
				self._measureControl.style.backgroundColor = self.options.backgroundColor;
				self._startMeasuring();
			} else {
				self._measureControl.removeAttribute('style');
				self._stopMeasuring();
			}
		},

		/**
		 * Enable measuring on the map
		 * @private
		 */
		_startMeasuring: function() {
			var self = this;
			self._changeCursor();
			self._disableDoubleClick();
			self._activateMapEvents();
			self._createLayerPaint();
			self._createPoints();
		},

		/**
		 * Change cursor to default type
		 * @private
		 */
		_changeCursor: function() {
			var self = this;
			self._oldCursor = self._map._container.style.cursor;
			self._map._container.style.cursor = self.options.cursor;
		},

		/**
		 * Revert cursor back to cursor originally set for map
		 * @private
		 */
		_revertCursor: function() {
			var self = this;
			self._map._container.style.cursor = self._oldCursor;
		},

		/**
		 * Disable map double click and enable zoom on double click
		 * @private
		 */
		_disableDoubleClick: function() {
			var self = this;
			self._doubleClickZoom = self._map.doubleClickZoom.enabled();
			self._map.doubleClickZoom.disable();
		},

		/**
		 * Enable the map double click event
		 * @private
		 */
		_enableDoubleClick: function() {
			var self = this;
			if(self._doubleClickZoom) {
				self._map.doubleClickZoom.enable();
			}
		},

		/**
		 * Activate mouse events on map
		 * @private
		 */
		_activateMapEvents: function() {
			var self = this;
			L.DomEvent.on(self._map, 'mousemove', self._mouseMove, self);
			L.DomEvent.on(self._map, 'click', self._mouseClick, self);
			L.DomEvent.on(document, 'keydown', self._onKeyDown, self);
		},

		/**
		 * Deactivate mouse events on map
		 * @private
		 */
		_deactivateMapEvents: function() {
			var self = this;
			L.DomEvent.off(document, 'keydown', self._onKeyDown, self);
			L.DomEvent.off(self._map, 'mousemove', self._mouseMove, self);
			L.DomEvent.off(self._map, 'click', self._mouseClick, self);
		},

		/**
		 * Create a layer group to hold measurements, in not already created
		 * @private
		 */
		_createLayerPaint: function() {
			var self = this;
			if(!self._layerPaint) {
				self._layerPaint = L.layerGroup().addTo(self._map);
			}
		},

		/**
		 * Create an array to hold the points, if not already existing
		 * @private
		 */
		_createPoints: function() {
			var self = this;
			if(!self._points) {
				self._points = [];
			}
		},

		/**
		 * Stop the measuring functionality on the map
		 * @private
		 */
		_stopMeasuring: function() {
			var self = this;
			self._revertCursor();
			self._deactivateMapEvents();
			self._enableDoubleClick();
			if(self.options.clearMeasurementsOnStop && self._layerPaint) {
				self.clearAllMeasurements();
			}
			self._restartPath();
		},

		/**
		 * Clear all measurements from the map
		 */
		clearAllMeasurements: function() {
			var self = this;
			if (self._layerPaint) {
				self._layerPaint.clearLayers();
			}
		},

		/**
		 * Event to fire on mouse move
		 * @param {Object} e Event
		 * @private
		 */
		_mouseMove: function(e) {
			var self = this;
			// The following line was added, because from Leaflet v1.0 on after each "dblclick" another "click" is fired too.
			// Which would cause the plugin to immediately start a new polyline at the position where the former line ended.
			// "click"-event will be activated again if mouse is being moved.
			L.DomEvent.on(self._map, 'click', self._mouseClick, self);

			if(!e.latlng || !self._lastPoint) {
				return;
			}

			if(!self._layerPaintPathTemp) {
				self._layerPaintPathTemp = L.polyline([self._lastPoint, e.latlng], {
					// Style of temporary, dashed line while moving the mouse
					color: self.options.tempLine.color,
					weight: self.options.tempLine.weight,
					interactive: false,
					dashArray: '8,8'
				}).addTo(self._layerPaint);
				// The following 5 lines replaced 1 line in the original plugin (source: Github Pull Request),
				// which was causing an error starting from Leaflet v1.0 on
			} else {
				if (self._layerPaintPathTemp.spliceLatLngs) {
					self._layerPaintPathTemp.spliceLatLngs(0, 2, self._lastPoint, e.latlng);
				} else {
					self._layerPaintPathTemp.setLatLngs([self._lastPoint, e.latlng]);
				}
			}
			if(self._tooltip) {
				if(!self._distance) {
					self._distance = 0;
				}
				self._updateTooltipPosition(e.latlng);
				var distance = e.latlng.distanceTo(self._lastPoint);
				self._updateTooltipDistance(self._distance + distance, distance);
			}
		},

		/**
		 * Event to fire on mouse click
		 * @param {Object} e Event
		 * @private
		 */
		_mouseClick: function(e) {
			var self = this;
			// Skip if no coordinates
			if(!e.latlng) {
				return;
			}
			// If we have a tooltip, update the distance and create a new tooltip,
			// leaving the old one exactly where it is (i.e. where the user has clicked)
			if(self._lastPoint && self._tooltip) {
				if(!self._distance) {
					self._distance = 0;
				}
				self._updateTooltipPosition(e.latlng);
				var distance = e.latlng.distanceTo(self._lastPoint);
				self._updateTooltipDistance(self._distance + distance, distance);
				self._distance += distance;
			}
			self._createTooltip(e.latlng);

			// If this is already the second click, add the location to the fix path (create one first if we don't have one)
			if(self._lastPoint && !self._layerPaintPath) {
				self._layerPaintPath = L.polyline([self._lastPoint], {
					// Style of fixed, solid line after mouse is clicked
					color: self.options.line.color,
					weight: self.options.line.weight,
					interactive: false
				}).addTo(self._layerPaint);
				self._startCircle = new L.CircleMarker(self._lastPoint, {
					// Style of the Circle marking the start of the Polyline
					color: self.options.startingPoint.color,
					weight: self.options.startingPoint.weight,
					fillColor: self.options.startingPoint.fillColor,
					fillOpacity: self.options.startingPoint.fillOpacity,
					radius: self.options.startingPoint.radius,
					interactive: false
				}).addTo(self._layerPaint);
			}

			if(self._layerPaintPath) {
				self._layerPaintPath.addLatLng(e.latlng);
			}

			// change color+radius of intermediate circle markers. markers optical important if new segment of line the doesn't bend
			if(self._lastCircle) {
				self._lastCircle.setStyle ({radius:2, fillColor:'#000'});
				self._lastCircle.off();
			}

			self._lastCircle = new L.CircleMarker(e.latlng, {
				// Style of the circle marking the latest point of the Polyline while still drawing
				color: self.options.lastPoint.color,
				weight: self.options.lastPoint.weight,
				fillColor: self.options.lastPoint.fillColor,
				fillOpacity: self.options.lastPoint.fillOpacity,
				radius: self.options.lastPoint.radius,
				interactive: true  // to handle a click within this circle which is the command to finish drawing the polyline
			}).addTo(self._layerPaint);
			self._lastCircle.on('click', function() { self._finishPath(); }, self);  // to handle a click within this circle which is the command to finish drawing the polyline
			// Save current location as last location
			self._lastPoint = e.latlng;
		},

        /**
         * Finish the drawing of the path
         * @private
         */
		_finishPath: function() {
			var self = this;
			// Remove the last end marker as well as the last (moving tooltip)
			// The following line was added, cause from Leaflet v1.0 on after each "dblclick" another "click" is fired too.
			// Which would cause the plugin to immediately start a new polyline at the position where the former line ended.
			// And/or the last tooltip-window got drawed two times on top of each other.
			// "click"-event will be activated again if mouse is being moved.
			L.DomEvent.off(self._map, 'click', self._mouseClick, self);

			self._finishCircle = new L.CircleMarker(self._lastPoint, {
				// Style of the circle marking the end of the whole Polyline
				color: self.options.endPoint.color,
				weight: self.options.endPoint.weight,
				fillColor: self.options.endPoint.fillColor,
				fillOpacity: self.options.endPoint.fillOpacity,
				radius: self.options.endPoint.radius,
				interactive: false
			}).addTo(self._layerPaint);

			if(self._lastCircle) {
				self._layerPaint.removeLayer(self._lastCircle);
			}
			if(self._tooltip) {
				self._layerPaint.removeLayer(self._tooltip);
			}
			if(self._layerPaint && self._layerPaintPathTemp) {
				self._layerPaint.removeLayer(self._layerPaintPathTemp);
			}
			// Reset everything
			self._restartPath();
		},

        /**
         * After completing a path, reset all the values to prepare in creating the next polyline measurement
         * @private
         */
		_restartPath: function() {
			var self = this;
			self._distance = 0;
			self._tooltip = undefined;
			self._lastCircle = undefined;
			self._lastPoint = undefined;
			self._layerPaintPath = undefined;
			self._layerPaintPathTemp = undefined;
		},

        /**
         * Create a tooltip at the provided position
         * @param {LatLng} position
         * @private
         */
		_createTooltip: function(position) {
			var self = this;
			var icon = L.divIcon({
				className: 'polyline-measure-tooltip',
				iconAnchor: [-4, -4]
			});
			self._tooltip = L.marker(position, {
				icon: icon,
				interactive: false
			}).addTo(self._layerPaint);
		},

        /**
         * Update the tooltip position on the map
         * @param {LatLng} position
         * @private
         */
		_updateTooltipPosition: function(position) {
			var self = this;
			self._tooltip.setLatLng(position);
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
			if (differenceRound.value > 0 && totalRound.value != differenceRound.value) {
				text += '<div class="polyline-measure-tooltip-difference">(+' + differenceRound.value + '&nbsp;' +  differenceRound.unit + ')</div>';
			}
			self._tooltip._icon.innerHTML = text;
		},

        /**
         * Event to fire when a keyboard key is depressed.
         * Currently only watching for ESC key.
         * @param {Object} e Event
         * @private
         */
		_onKeyDown: function (e) {
			var self = this;
			if(e.keyCode == 27) {
				// "ESC"-Key. If not in path exit measuring mode, else just finish path
				if(!self._lastPoint) {
					self._toggleMeasure();
				} else {
					self._finishPath();
				}
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
})();
