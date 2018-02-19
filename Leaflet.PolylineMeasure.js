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
             * Title for the bearing In
             * @type {String}
             * @default
             */
            bearingTextIn: 'In',
                /**
             * Title for the bearing Out
             * @type {String}
             * @default
             */
            bearingTextOut: 'Out',
             /**
             * Language dependend label for last point's tooltip
             * @type {String}
             * @default
             */
            bindTooltipText: "Click and drag to <b>move point</b><br>Press CTRL-key and click to <b>resume line</b>",
                /**
             * Title for the unit going to be changed
             * @type {String}
             * @default
             */
            changeUnitsText: 'Change Units',
            /**
             * Position to show the control. Possible values are: 'topright', 'topleft', 'bottomright', 'bottomleft'
             * @type {String}
             * @default
             */
            position: 'topleft',
            /**
             * Which units the distances are displayed in. Possible values are: 'metres', 'landmiles', 'nauticalmiles'
             * @type {String}
             * @default
             */
            unit: 'metres',
            /**
             * Whether bearings are displayed within the tooltips
             * @type {Boolean}
             * @default
             */
            showBearings: false,
            /**
             * Title for the control going to be switched on
             * @type {String}
             * @default
             */
            measureControlTitleOn: "Turn on PolylineMeasure",
            /**
             * Title for the control going to be switched off
             * @type {String}
             * @default
             */
            measureControlTitleOff: "Turn off PolylineMeasure",
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
            clearControlTitle: 'Clear Measurements',
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
             * Show a control to change the units of measurements
             * @type {Boolean}
             * @default
             */
            showUnitControl: false,
            /**
             * Styling settings for the temporary dashed rubberline
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
             * Styling for the fixed polyline
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
                radius: 6
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
         * Create a control button
         * @param {String}      label           Label to add
         * @param {String}      title           Title to show on hover
         * @param {Array}       classesToAdd    Collection of classes to add
         * @param {Element}     container       Parent element
         * @param {Function}    fn              Callback function to run
         * @param {Object}      context         Context
         * @returns {Element}                   Created element
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
         * Method to fire on add to map
         * @param {Object}      map     Map object
         * @returns {Element}           Containing element
         */
        onAdd: function(map) {
            this._container = document.createElement('div');
            this._container.classList.add('leaflet-bar');
            L.DomEvent.disableClickPropagation(this._container); // otherwise drawing process would instantly start at controls' container or double click would zoom-in map
            var title = this.options.measureControlTitleOn;
            var label = this.options.measureControlLabel;
            var classes = this.options.measureControlClasses;
            if (label.indexOf('&') != -1) {
                classes.push(_unicodeClass);
            }

            // initialize state
            this._arrPolylines = [];
            this._measureControl = this._createControl(label, title, classes, this._container, this._toggleMeasure, this);
            this._measureControl.setAttribute('id', _measureControlId);
            
            if (this.options.showMeasurementsClearControl) {
                var title = this.options.clearControlTitle;
                var label = this.options.clearControlLabel;
                var classes = this.options.clearControlClasses;
                if (label.indexOf('&') != -1) {
                    classes.push(_unicodeClass);
                }
                this._clearMeasureControl = this._createControl(label, title, classes, this._container, this._clearAllMeasurements, this);
                this._clearMeasureControl.classList.add('polyline-measure-clearControl')
            }
            if (this.options.showUnitControl) {
                 var title = this.options.changeUnitsText + " [" + this.options.unit  + "]";
                if (this.options.unit=="metres") {
                    var label = "m";
                }  else if  (this.options.unit=="landmiles") {
                    var label = "mi";
                } else {
                    var label = "nm";
                }
                var classes = [];
                this._unitControl = this._createControl(label, title, classes, this._container, this._changeUnit, this);
                this._unitControl.setAttribute('id', 'unitControlId');
            }
            return this._container;
        },

        /**
         * Method to fire on remove from map
         */
        onRemove: function () {
            if (this._measuring) {
                this._toggleMeasure();
            } 
        },

        /**
         * Toggle the measure functionality on or off
         * @private
         */
        _toggleMeasure: function () {
            this._measuring = !this._measuring;
            if (this._measuring) {   // if measuring is going to be switched on
                this._measureControl.style.backgroundColor = this.options.backgroundColor;
                this._measureControl.title = this.options.measureControlTitleOff;
                this._oldCursor = this._map._container.style.cursor;          // save former cursor type
                this._map._container.style.cursor = this.options.cursor;
                this._doubleClickZoom = this._map.doubleClickZoom.enabled();  // save former status of doubleClickZoom
                this._map.doubleClickZoom.disable();
                // create LayerGroup "layerPaint" (only) the first time Measure Control is switched on
                if (!this._layerPaint) {
                    this._layerPaint = L.layerGroup().addTo(this._map);
                }
                this._map.on ('mousemove', this._mouseMove, this);   //  enable listing to 'mousemove', 'click', 'keydown' events
                this._map.on ('click', this._mouseClick, this);
                L.DomEvent.on (document, 'keydown', this._onKeyDown, this);
                this._resetPathVariables();
            } else {   // if measuring is going to be switched off
                this._measureControl.removeAttribute('style');
                this._measureControl.title = this.options.measureControlTitleOn;
                this._map._container.style.cursor = this._oldCursor;
                this._map.off ('mousemove', this._mouseMove, this);
                this._map.off ('click', this._mouseClick, this);
                L.DomEvent.off (document, 'keydown', this._onKeyDown, this);
                if(this._doubleClickZoom) {
                    this._map.doubleClickZoom.enable();
                }
                if(this.options.clearMeasurementsOnStop && this._layerPaint) {
                    this._clearAllMeasurements();
                }
                // to remove temp. Line if line at the moment is being drawn and not finished while clicking the control
                if (this._cntCircle !== 0) {
                    this._finishPolylinePath();
                }
            }
        },

        /**
         * Clear all measurements from the map
         */
        _clearAllMeasurements: function() {
            if ((this._cntCircle !== undefined) && (this._cntCircle !== 0)) {
                    this._finishPolylinePath();
            }
            if (this._layerPaint) {
                this._layerPaint.clearLayers();
            }
            this._arrPolylines = [];
        },
        
        _changeUnit: function() {
            if (this.options.unit == "metres") {
                this.options.unit = "landmiles";
                document.getElementById("unitControlId").innerHTML = "mi";
            } else if (this.options.unit == "landmiles") {
                this.options.unit = "nauticalmiles";
                document.getElementById("unitControlId").innerHTML = "nm";
            } else {
                this.options.unit = "metres";
                document.getElementById("unitControlId").innerHTML = "m";
            }
            this._unitControl.title = this.options.changeUnitsText +" [" + this.options.unit  + "]";
            this._arrPolylines.map (function(line) {
                var totalDistance = 0;
                line.circleCoords.map (function(point, point_index) {
                    if (point_index >= 1) {
                        var distance = line.circleCoords [point_index - 1].distanceTo (line.circleCoords [point_index]);
                        totalDistance += distance;
                        this._updateTooltip (line.tooltips [point_index], line.tooltips [point_index - 1], totalDistance, distance, line.circleCoords [point_index - 1], line.circleCoords [point_index]);
                    }
                }.bind(this));
            }.bind(this));
        },

        /**
         * Event to fire when a keyboard key is depressed.
         * Currently only watching for ESC key (= keyCode 27). 1st press finishes line, 2nd press turns Measuring off.
         * @param {Object} e Event
         * @private
         */
        _onKeyDown: function (e) {
            if(e.keyCode === 27) {
                // if NOT drawing a line, ESC will directly switch of measuring 
                if(!this._currentLine) {
                    this._toggleMeasure();
                } else {
                    this._finishPolylinePath(e);
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
            var dist = distance;
            var symbol;
            if (this.options.unit === 'nauticalmiles') {
                unit = "nm";
                if (dist >= 1852000) {
                    dist = (dist/1852).toFixed(0);
                } else if (dist >= 185200) {
                    dist = (dist/1852).toFixed(1);
                    // don't use 3 decimal digits, cause especially in countries using the "." as thousands separator a number could optically be confused (e.g. "1.234 nm": is it 1234 nm or 1,234 nm ?)
                } else if (dist >= 1852) {
                    dist = (dist/1852).toFixed(2);
                } else  {
                    dist = (dist/0.3048).toFixed(0);
                    unit = "ft";
                }
            } else if (this.options.unit === 'landmiles') {
                unit = "mi";
                if (dist >= 1609344) {
                    dist = (dist/1609.344).toFixed(0);
                } else if (dist >= 160934.4) {
                    dist = (dist/1609.344).toFixed(1);
                    // don't use 3 decimal digits, cause especially in countries using the "." as thousands separator a number could optically be confused (e.g. "1.234mi": is it 1234mi or 1,234mi ?)
                } else if (dist >= 1609.344) {
                    dist = (dist/1609.344).toFixed(2);
                } else {
                    dist = (dist/0.3048).toFixed(0);
                    unit = "ft";
                }
            }
            else {
                unit = "km";
                if (dist >= 1000000) {
                    dist = (dist/1000).toFixed(0);
                } else if (dist >= 100000) {
                    dist = (dist/1000).toFixed(1);
                    // don't use 3 decimal digits, cause especially in countries using the "." as thousands separator a number could optically be confused (e.g. "1.234 km": is it 1234 km or 1,234 km ?)
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
         * Calculate Great-circle Arc (= shortest distance on a sphere like the Earth) between two coordinates
         * formulas: http://www.edwilliams.org/avform.htm
         * @private
         */     
        _polylineArc: function (_from, _to) {
            function _GCinterpolate (f) {
                A = Math.sin((1 - f) * d) / Math.sin(d);
                B = Math.sin(f * d) / Math.sin(d);
                x = A * Math.cos(fromLat) * Math.cos(fromLng) + B * Math.cos(toLat) * Math.cos(toLng);
                y = A * Math.cos(fromLat) * Math.sin(fromLng) + B * Math.cos(toLat) * Math.sin(toLng);
                z = A * Math.sin(fromLat) + B * Math.sin(toLat);
                // atan2 better than atan-function cause results are from -pi to +pi
                // => results of latInterpol, lngInterpol always within range -180° ... +180°  => conversion into values < -180° or > + 180° has to be done afterwards
                latInterpol = 180 / Math.PI * Math.atan2(z, Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2)));
                lngInterpol = 180 / Math.PI * Math.atan2(y, x);
                // don't split polyline if it crosses dateline ( -180° or +180°).  Without the polyline would look like: +179° ==> +180° ==> -180° ==> -179°...
                // algo: if difference lngInterpol-from.lng is > 180° there's been an unwanted split from +180 to -180 cause an arc can never span >180°
                diff = lngInterpol-fromLng*180/Math.PI;
                function trunc(n) { return Math[n > 0 ? "floor" : "ceil"](n); }   // alternatively we could use the new Math.trunc method, but Internet Explorer doesn't know it
                if (diff < 0) {
                    lngInterpol = lngInterpol  - trunc ((diff - 180)/ 360) * 360; 
                } else {
                    lngInterpol = lngInterpol  - trunc ((diff +180)/ 360) * 360;
                }
                return [latInterpol, lngInterpol];
            }
             
            function _GCarc (npoints) {
                arrArcCoords = [];
                var delta = 1.0 / (npoints-1 );
                // first point of Arc should NOT be returned
                for (var i = 0; i < npoints; i++) {
                    var step = delta * i;
                    var coordPair = _GCinterpolate (step);
                    arrArcCoords.push (coordPair);
                }
                return arrArcCoords;
            }
   
            var fromLat = _from.lat;  // work with with copies of object's elements _from.lat and _from.lng, otherwise they would get modiefied due to call-by-reference on Objects in Javascript
            var fromLng = _from.lng;
            var toLat = _to.lat;
            var toLng = _to.lng;
            fromLat=fromLat * Math.PI / 180;
            fromLng=fromLng * Math.PI / 180;
            toLat=toLat * Math.PI / 180;
            toLng=toLng * Math.PI / 180;
            d = 2.0 * Math.asin(Math.sqrt(Math.pow (Math.sin((fromLat - toLat) / 2.0), 2) + Math.cos(fromLat) *  Math.cos(toLat) *  Math.pow(Math.sin((fromLng - toLng) / 2.0), 2)));
            if (d === 0) {
                arrLatLngs = [[fromLat, fromLng]];
            } else {
                arcpoints = 100;   // 100 points = 99 line segments. lower value to make arc less accurate or increase value to make it more accurate.
                arrLatLngs = _GCarc(arcpoints);
            }
            return arrLatLngs;
        },
    
        /**
         * Update the tooltip distance
         * @param {Number} total        Total distance
         * @param {Number} difference   Difference in distance between 2 points
         * @private
         */
        _updateTooltip: function (currentTooltip, prevTooltip, total, difference, lastCircleCoords, mouseCoords) {
            // Explanation of formula: http://www.movable-type.co.uk/scripts/latlong.html
            calcAngle = function (p1, p2, direction) {
                var lat1 = p1.lat / 180 * Math.PI;
                var lat2 = p2.lat / 180 * Math.PI;
                var lng1 = p1.lng / 180 * Math.PI;
                var lng2 = p2.lng / 180 * Math.PI;
                var y = Math.sin(lng2-lng1) * Math.cos(lat2);
                var x = Math.cos(lat1)*Math.sin(lat2) - Math.sin(lat1)*Math.cos(lat2)*Math.cos(lng2-lng1);
                if (direction === "inbound") {
                    var brng = (Math.atan2(y, x) * 180 / Math.PI + 180).toFixed(0);
                } else {
                    var brng = (Math.atan2(y, x) * 180 / Math.PI + 360).toFixed(0);
                }
                return (brng % 360);
            }
            
            var angleIn = calcAngle (mouseCoords, lastCircleCoords, "inbound");
            var angleOut = calcAngle (lastCircleCoords, mouseCoords, "outbound");
            var totalRound = this._getDistance (total);
            var differenceRound = this._getDistance (difference);
            var textCurrent = '';
            if (differenceRound.value > 0 ) {
                if (this.options.showBearings === true) {
                     textCurrent = this.options.bearingTextIn + ': ' + angleIn + '°<br>'+this.options.bearingTextOut+':---°';
                }
                textCurrent += '<div class="polyline-measure-tooltip-difference">+' + differenceRound.value + '&nbsp;' +  differenceRound.unit + '</div>';
            }
            textCurrent += '<div class="polyline-measure-tooltip-total">' + totalRound.value + '&nbsp;' +  totalRound.unit + '</div>';
            currentTooltip._icon.innerHTML = textCurrent;
            if ((this.options.showBearings === true) && (prevTooltip)) {
                textPrev = prevTooltip._icon.innerHTML;

                var regExp = new RegExp(this.options.bearingTextOut + '.*\°');

                textReplace = textPrev.replace(regExp, this.options.bearingTextOut + ': ' + angleOut + "°");

                prevTooltip._icon.innerHTML = textReplace;
            }
        },

        _drawArrow: function (arcLine) {
            var P48 = arcLine[48];
            var P49 = arcLine[49];
            var diffLng4849 = P49[1] - P48[1];
            var diffLat4849 = P49[0] - P48[0];
            var center = [P48[0] + diffLat4849/2, P48[1] + diffLng4849/2];  // center of Great-circle distance, NOT of the arc on a Mercator map! reason: a) to complicated b) map not always Mercator c) good optical feature to see where real center of distance is not the "virtual" warped arc center due to Mercator projection
                // angle just an aprroximation, which could be somewhat off if Line runs near high latitudes. Use of *geographical coords* for line segment [48] to [49] is best method. Use of *Pixel coords* for just one arc segement [48] to [49] could create for short lines unexact rotation angles, and the use Use of Pixel coords between endpoints [0] to [98] results in even more rotation difference for high latitudes as with geogrpaphical coords-method 
            var cssAngle = -Math.atan2(diffLat4849, diffLng4849)*57.29578   // convert radiant to degree as needed for use as CSS value; cssAngle is opposite to mathematical angle.                 
            iconArrow = L.divIcon ({ 
                className: "",  // to avoid getting a default class with paddings and borders assigned by Leaflet
                iconSize: [16, 16],
                iconAnchor: [8, 8],
                    // html : "<img src='iconArrow.png' style='background:green; height:100%; vertical-align:top; transform:rotate("+ cssAngle +"deg)'>"  <<=== alternative method by the use of an image instead of a Unicode symbol.
                html : "<div style = 'font-size: 16px; line-height: 16px; vertical-align:top; transform: rotate("+ cssAngle +"deg)'>&#x27a4;</div>"   // best results if iconSize = font-size = line-height and iconAnchor font-size/2 .both values needed to position symbol in center of L.divIcon for all font-sizes. 
            });
            return L.marker (center, {icon: iconArrow}).addTo(this._layerPaint);
        },
        
        /**
         * Event to fire on mouse move
         * @param {Object} e Event
         * @private
         */
        _mouseMove: function (e) {
            var mouseCoords = e.latlng;
            this._map.on ('click', this._mouseClick, this);  // necassary for _dragCircle. If switched on already within _dragCircle an unwanted click is fired at the end of the drag.
            if(!mouseCoords || !this._currentLine) {
                return;
            }
            var lastCircleCoords = this._currentLine.circleCoords.last();
            this._rubberlinePath.setLatLngs (this._polylineArc (lastCircleCoords, mouseCoords));
            var currentTooltip = this._currentLine.tooltips.last();
            var prevTooltip = this._currentLine.tooltips.slice(-2,-1)[0];
            currentTooltip.setLatLng (mouseCoords);
            var distanceSegment = mouseCoords.distanceTo (lastCircleCoords);
            this._updateTooltip (currentTooltip, prevTooltip, this._currentLine.distance + distanceSegment, distanceSegment, lastCircleCoords, mouseCoords);
        },
        
        _startLine: function (clickCoords) {
            var icon = L.divIcon({
                className: 'polyline-measure-tooltip',
                iconAnchor: [-4, -4]
            });
            var last = function() {
                return this.slice(-1)[0];
            };
            this._rubberlinePath = L.polyline ([], {
                // Style of temporary, dashed line while moving the mouse
                color: this.options.tempLine.color,
                weight: this.options.tempLine.weight,
                interactive: false,
                dashArray: '8,8'
            }).addTo(this._layerPaint).bringToBack();

	    var polylineState = this;
            this._currentLine = {
                id: 0,
                circleCoords: [],
                circleMarkers: [],
                arrowMarkers: [],
                tooltips: [],
                distance: 0,
                
                polylinePath: L.polyline([], {
                    // Style of fixed, polyline after mouse is clicked
                    color: this.options.fixedLine.color,
                    weight: this.options.fixedLine.weight,
                    interactive: false
                }).addTo(this._layerPaint).bringToBack(),
                
                handleMarkers: function (latlng) {
                    // update style on previous marker
                    var lastCircleMarker = this.circleMarkers.last();
                    if (lastCircleMarker) {
                        lastCircleMarker.off ('click', polylineState._finishPolylinePath, polylineState);
                        if (this.circleMarkers.length === 1) {
                            lastCircleMarker.setStyle (polylineState.options.startCircle);
                        } else {
                            lastCircleMarker.setStyle (polylineState.options.intermedCircle);
                        }
                    }
                    var newCircleMarker = new L.CircleMarker (latlng, polylineState.options.currentCircle).addTo(polylineState._layerPaint);
                    newCircleMarker.cntLine = polylineState._currentLine.id;
                    newCircleMarker.cntCircle = polylineState._cntCircle;
                    polylineState._cntCircle++;
                    newCircleMarker.on ('mousedown', polylineState._dragCircle, polylineState);
                    newCircleMarker.on ('click', polylineState._finishPolylinePath, polylineState);
                    this.circleMarkers.push (newCircleMarker);
                },
                
                getNewToolTip: function(latlng) {
                    return L.marker (latlng, {
                        icon: icon,
                        interactive: false
                    });
                },
                
                addPoint: function (mouseCoords) {
                    var lastCircleCoords = this.circleCoords.last();
                    if (lastCircleCoords && lastCircleCoords.equals (mouseCoords)) {    // don't add a new circle if the click was onto the last circle
                        return;
                    }
                    this.circleCoords.push (mouseCoords);
                    // update polyline
                    if (this.circleCoords.length > 1) {
                        var arc = polylineState._polylineArc (lastCircleCoords, mouseCoords);
                        if (this.circleCoords.length > 2) {
                            arc.shift();
                        }
                        this.polylinePath.setLatLngs (this.polylinePath.getLatLngs().concat(arc));
                        // following lines needed especially for Mobile Browsers where we just use mouseclicks. No mousemoves, no tempLine.
                        var arrowMarker = polylineState._drawArrow (arc);
                        polylineState._currentLine.arrowMarkers.push (arrowMarker);
                        distanceSegment = lastCircleCoords.distanceTo (mouseCoords);
                        this.distance += distanceSegment;
                        var currentTooltip = polylineState._currentLine.tooltips.last();
                        var prevTooltip = polylineState._currentLine.tooltips.slice(-1,-2)[0];
                        polylineState._updateTooltip (currentTooltip, prevTooltip, this.distance, distanceSegment, lastCircleCoords, mouseCoords);
                    }
                    // update last tooltip with final value
                    if (currentTooltip) {
                        currentTooltip.setLatLng (mouseCoords);
                    }
                    // add new tooltip to update on mousemove
                    var tooltipNew = this.getNewToolTip(mouseCoords);
                    tooltipNew.addTo(polylineState._layerPaint);
                    this.tooltips.push (tooltipNew);
                    this.handleMarkers (mouseCoords);
                },
                
                finalize: function() {
                    // remove tooltip created by last click
                    polylineState._layerPaint.removeLayer (this.tooltips.last());
                    this.tooltips.pop();
                    // remove temporary rubberline
                    polylineState._layerPaint.removeLayer (polylineState._rubberlinePath);
                    if (this.circleCoords.length > 1) {
                        this.tooltips.last()._icon.classList.add('polyline-measure-tooltip-end'); // add Class e.g. another background-color to the Previous Tooltip (which is the last fixed tooltip, cause the moving tooltip is being deleted later)
                        var lastCircleMarker = this.circleMarkers.last()
                        lastCircleMarker.setStyle (polylineState.options.endCircle);
                        // use Leaflet's own tooltip method to shwo a popuo tooltip if user hovers the last circle of a polyline
                        lastCircleMarker.bindTooltip(polylineState.options.bindTooltipText, {direction:'top', opacity:0.7, className:'polyline-measure-popupTooltip'});
                        lastCircleMarker.off ('click', polylineState._finishPolylinePath, polylineState);
                        lastCircleMarker.on ('click', polylineState._resumePolylinePath, polylineState);
                        polylineState._arrPolylines.push(this);
                    } else {
                        // if there is only one point, just clean it up
                        polylineState._layerPaint.removeLayer (this.circleMarkers.last());
                    }
                    polylineState._resetPathVariables();
                }
            };
            
            firstTooltip = L.marker (clickCoords, {
                icon: icon,
                interactive: false
            })
            if (this.options.showBearings === true) {
                firstTooltip.addTo(this._layerPaint);  // otherwise if showBearings = false, the tiny circle of an empty tooltip is displayed
                text = this.options.bearingTextIn+':---°<br>'+this.options.bearingTextOut+':---°';
                firstTooltip._icon.innerHTML = text;
            }
            this._currentLine.tooltips.push (firstTooltip);
            this._currentLine.circleCoords.last = last;
            this._currentLine.tooltips.last = last;
            this._currentLine.circleMarkers.last = last;
            this._currentLine.id = this._arrPolylines.length;
        },

        /**
         * Event to fire on mouse click
         * @param {Object} e Event
         * @private
         */
        _mouseClick: function (e) {
            // skip if there are no coords provided by the event, or this event's screen coordinates match those of finishing CircleMarker for the line we just completed
            if (!e.latlng || (this._finishCircleScreencoords && this._finishCircleScreencoords.equals(e.containerPoint))) {
                return;
            }
            if (!this._currentLine) {
                this._startLine (e.latlng);
            }
            this._currentLine.addPoint (e.latlng);
        },

        /**
         * Finish the drawing of the path by clicking onto the last circle or pressing ESC-Key
         * @private
         */
        _finishPolylinePath: function (e) {
            this._currentLine.finalize();
            if (e) {
                this._finishCircleScreencoords = e.containerPoint;
            }
        },
        
        /**
         * Resume the drawing of a polyline by pressing CTRL-Key and clicking onto the last circle
         * @private
         */
        _resumePolylinePath: function (e) {
            if (e.originalEvent.ctrlKey === true) {    // just resume if user pressed the CTRL-Key while clicking onto the last circle
                this._currentLine = this._arrPolylines [e.target.cntLine];
                this._rubberlinePath = L.polyline ([], {
                    // Style of temporary, rubberline while moving the mouse
                    color: this.options.tempLine.color,
                    weight: this.options.tempLine.weight,
                    interactive: false,
                    dashArray: '8,8'
                }).addTo(this._layerPaint).bringToBack();
                this._currentLine.tooltips.last()._icon.classList.remove ('polyline-measure-tooltip-end');   // remove extra CSS-class of previous, last tooltip
                var tooltipNew = this._currentLine.getNewToolTip (e.latlng);
                tooltipNew.addTo (this._layerPaint);
                this._currentLine.tooltips.push(tooltipNew);
                this._currentLine.circleMarkers.last().unbindTooltip();   // remove popup-tooltip of previous, last circleMarker
                this._currentLine.circleMarkers.last().setStyle (this.options.currentCircle);
                this._cntCircle = this._currentLine.circleCoords.length;
            }
        },

        /**
         * After completing a path, reset all the values to prepare in creating the next polyline measurement
         * @private
         */
        _resetPathVariables: function() {
            this._cntCircle = 0;
            this._currentLine = null;
        },
      
        _dragCircleMouseup: function () {
            // bind new popup-tooltip to the last CircleMArker if dragging finished
            this._e1.target.bindTooltip (this.options.bindTooltipText, {direction:'top', opacity:0.7, className:'polyline-measure-popupTooltip'});
            this._resetPathVariables();
            this._map.off ('mousemove', this._dragCircleMousemove, this);
            this._map.dragging.enable();
            this._map.on ('mousemove', this._mouseMove, this);
            this._map.off ('mouseup', this._dragCircleMouseup, this);
        },
      
        _dragCircleMousemove: function (e2) {
            var mouseNewLat = e2.latlng.lat;
            var mouseNewLng = e2.latlng.lng;
            var latDifference = mouseNewLat - this._mouseStartingLat;
            var lngDifference = mouseNewLng - this._mouseStartingLng;
            var currentCircleCoords = L.latLng (this._circleStartingLat + latDifference, this._circleStartingLng + lngDifference);
            lineNr = this._e1.target.cntLine;
            circleNr = this._e1.target.cntCircle;
            this._e1.target.setLatLng (currentCircleCoords);
            this._e1.target.unbindTooltip();    // unbind popup-tooltip cause otherwise it would be annoying during dragging, or popup instantly again if it's just closed
            this._arrPolylines[lineNr].circleCoords[circleNr] = currentCircleCoords;
            lineCoords = this._arrPolylines[lineNr].polylinePath.getLatLngs(); // get Coords of each Point of the current Polyline
            if (circleNr >= 1)   {   // redraw previous arc just if circle is not starting circle of polyline
                newLineSegment1 = this._polylineArc(this._arrPolylines[lineNr].circleCoords[circleNr-1], currentCircleCoords);
                // the next line's syntax has to be used since Internet Explorer doesn't know new spread operator (...) for inserting the individual elements of an array as 3rd argument of the splice method; Otherwise we could write: lineCoords.splice (circleNr*(arcpoints-1), arcpoints, ...newLineSegment1);
                Array.prototype.splice.apply (lineCoords, [(circleNr-1)*(arcpoints-1), arcpoints].concat (newLineSegment1));
                arrowMarker = this._drawArrow (newLineSegment1);
                this._arrPolylines[lineNr].arrowMarkers [circleNr-1].removeFrom (this._layerPaint);
                this._arrPolylines[lineNr].arrowMarkers [circleNr-1] = arrowMarker;
            }
            if (circleNr < this._arrPolylines[lineNr].circleCoords.length-1) {   // redraw following arc just if circle is not end circle of polyline
                newLineSegment2 = this._polylineArc (currentCircleCoords, this._arrPolylines[lineNr].circleCoords[circleNr+1]);
                Array.prototype.splice.apply (lineCoords, [circleNr*(arcpoints-1), arcpoints].concat (newLineSegment2));
                arrowMarker = this._drawArrow (newLineSegment2);
                this._arrPolylines[lineNr].arrowMarkers [circleNr].removeFrom (this._layerPaint);
                this._arrPolylines[lineNr].arrowMarkers [circleNr] = arrowMarker;
            }
            this._arrPolylines[lineNr].polylinePath.setLatLngs (lineCoords);
            if (circleNr >= 0) {     // just update tooltip position if moved circle is 2nd, 3rd, 4th etc. circle of a polyline
                    this._arrPolylines[lineNr].tooltips[circleNr].setLatLng (currentCircleCoords);
            }    
            var totalDistance = 0;
            // update tooltip texts of each tooltip
            this._arrPolylines[lineNr].tooltips.map (function (item, index) {
                if (index >= 1) {
                    var distance = this._arrPolylines[lineNr].circleCoords[index-1].distanceTo (this._arrPolylines[lineNr].circleCoords[index]);
                    var lastCircleCoords = this._arrPolylines[lineNr].circleCoords[index - 1];
                    var mouseCoords = this._arrPolylines[lineNr].circleCoords[index];
                    totalDistance += distance;
                    if (index >= 1) {
                        var prevTooltip = this._arrPolylines[lineNr].tooltips[index-1]
                    }
                    this._updateTooltip (item, prevTooltip, totalDistance, distance, lastCircleCoords, mouseCoords);
                }
            }.bind(this));
            this._map.on ('mouseup', this._dragCircleMouseup, this);
        },
      
        _dragCircle: function (e1) {
            if (e1.originalEvent.ctrlKey) {
                return;
            }
            this._e1 = e1;
            if ((this._measuring) && (this._cntCircle === 0)) {    // just execute drag-function if Measuring tool is active but no line is being drawn at the moment.
                this._map.dragging.disable();  // turn of moving of the map during drag of a circle
                this._map.off ('mousemove', this._mouseMove, this);
                this._map.off ('click', this._mouseClick, this);
                this._mouseStartingLat = e1.latlng.lat;
                this._mouseStartingLng = e1.latlng.lng;
                this._circleStartingLat = e1.target._latlng.lat;
                this._circleStartingLng = e1.target._latlng.lng;
                this._map.on ('mousemove', this._dragCircleMousemove, this);
            }
        }
    });

//======================================================================================

    L.Map.mergeOptions({
        PolylineMeasureControl: false
    });

    L.Map.addInitHook(function () {
        if (this.options.polylineMeasureControl) {
            this.PMControl = new L.Control.PolylineMeasure();
            this.addControl(this.PMControl);
        }
    });

    L.control.polylineMeasure = function (options) {
        return new L.Control.PolylineMeasure (options);
    };
}));
