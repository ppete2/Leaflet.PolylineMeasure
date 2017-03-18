L.Control.PolylineMeasure = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-bar';  // class of control-container
        var container = L.DomUtil.create('div', className);
        L.DomEvent.disableClickPropagation(container);
		this._createButton('&#8614;', 'Polyline Measure', 'polylinemeasure-ctrcontainerlink', container, this._toggleMeasure, this);  // class of <a>-linkbutton *within* control-container
		return container;
	},

	_createButton: function (html, title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
        link.title = title;
		L.DomEvent.on(link, 'click', fn, context);
		return link;
	},

	_toggleMeasure: function () {
		this._measuring = !this._measuring;
		if(this._measuring) {
			L.DomUtil.addClass(this._container, 'polylinemeasure-ctrcontainer-on');  // class of *control-container* ist changed, not the one of the <a>-linkbutton within
			this._startMeasuring();
		} else {
			L.DomUtil.removeClass(this._container, 'polylinemeasure-ctrcontainer-on');
			this._stopMeasuring();
		}
	},

	_startMeasuring: function() {
        this._oldCursor = this._map._container.style.cursor;
		this._map._container.style.cursor = 'crosshair';
		this._doubleClickZoom = this._map.doubleClickZoom.enabled();
		this._map.doubleClickZoom.disable();
		L.DomEvent
			.on(this._map, 'mousemove', this._mouseMove, this)
			.on(this._map, 'click', this._mouseClick, this)
			.on(document, 'keydown', this._onKeyDown, this);
            //.on(this._map, 'dblclick', this._finishPath, this)   // don't use it anymore from Leaflet v1.0 on, cause after each "dblclick" another "click" is fired too.
    	if(!this._layerPaint) {
			this._layerPaint = L.layerGroup().addTo(this._map);	
		}
		if(!this._points) {
			this._points = [];
		}
	},

	_stopMeasuring: function() {
        this._map._container.style.cursor = this._oldCursor;
		L.DomEvent
			.off(document, 'keydown', this._onKeyDown, this)
			.off(this._map, 'mousemove', this._mouseMove, this)
			.off(this._map, 'click', this._mouseClick, this);
    	if(this._doubleClickZoom) {
			this._map.doubleClickZoom.enable();
		}
		if(this._layerPaint) {
			this._layerPaint.clearLayers();
		}
		this._restartPath();
	},

	_mouseMove: function(e) {
      // the following line was added, cause from Leaflet v1.0 on after each "dblclick" another "click" is fired too. Which would cause the addon to immediately start a new polyline at the position where the former line ended. "click"-event will be activated again if mouse is being moved. 
        L.DomEvent.on(this._map, 'click', this._mouseClick, this);  
        if(!e.latlng || !this._lastPoint) {
			return;
		}
		if(!this._layerPaintPathTemp) {
            this._layerPaintPathTemp = L.polyline([this._lastPoint, e.latlng], { 
		// Style of temporary, dashed line while moving the mouse	
                color: '#00f',
				weight: 2,
				interactive: false,
				dashArray: '8,8'
			}).addTo(this._layerPaint);
        // the following 5 lines replaced 1 line in the original addon (source: Github Pull Request), which was causing an error starting from Leaflet v1.0 on		
        } else {
			if (this._layerPaintPathTemp.spliceLatLngs) {
				this._layerPaintPathTemp.spliceLatLngs(0, 2, this._lastPoint, e.latlng);
			} else {
				this._layerPaintPathTemp.setLatLngs([this._lastPoint, e.latlng]);
			}
		}
		if(this._tooltip) {
			if(!this._distance) {
				this._distance = 0;
			}
			this._updateTooltipPosition(e.latlng);
			var distance = e.latlng.distanceTo(this._lastPoint);
			this._updateTooltipDistance(this._distance + distance, distance);
		}
	},

	_mouseClick: function(e) {
        // Skip if no coordinates
        if(!e.latlng) {
			return;
		}
		// If we have a tooltip, update the distance and create a new tooltip, leaving the old one exactly where it is (i.e. where the user has clicked)
		if(this._lastPoint && this._tooltip) {
			if(!this._distance) {
				this._distance = 0;
			}
			this._updateTooltipPosition(e.latlng);
			var distance = e.latlng.distanceTo(this._lastPoint);
			this._updateTooltipDistance(this._distance + distance, distance);
			this._distance += distance;
		}
		this._createTooltip(e.latlng);
		
		// If this is already the second click, add the location to the fix path (create one first if we don't have one)
		if(this._lastPoint && !this._layerPaintPath) {
			this._layerPaintPath = L.polyline([this._lastPoint], { 
			// Style of fixed, solid line after mouse is clicked
                color: '#006',
				weight: 2,
				interactive: false
			}).addTo(this._layerPaint);
            this._startCircle = new L.CircleMarker(this._lastPoint, { 
            // Style of the Circle marking the start of the Polyline
                color: '#000', 
                weight: 1, 
                fillColor: '#0f0',
                fillOpacity: 1,
                radius:3,
                interactive: false,
            }).addTo(this._layerPaint);
		}

		if(this._layerPaintPath) {
			this._layerPaintPath.addLatLng(e.latlng);
		}

		// Upate the end marker to the current location
		if(this._lastCircle) {
			this._layerPaint.removeLayer(this._lastCircle);
		}

		this._lastCircle = new L.CircleMarker(e.latlng, { 
		// Style of the circle marking the latest point of the Polyline while still drawing
            color: '#000', 
			weight: 1, 
			fillColor: '#000',
			fillOpacity: 1,
			radius:3,
			interactive: true  // to handle a click within this circle which is the command to finish drawing the polyline 
		}).addTo(this._layerPaint);
		this._lastCircle.on('click', function() { this._finishPath(); }, this);  // to handle a click within this circle which is the command to finish drawing the polyline
		// Save current location as last location
		this._lastPoint = e.latlng;
	},

	_finishPath: function() {
        // Remove the last end marker as well as the last (moving tooltip)
        // the following line was added, cause from Leaflet v1.0 on after each "dblclick" another "click" is fired too. Which would cause the addon to immediately start a new polyline at the position where the former line ended. And/or the last tooltip-window got drawed two times on top of each other. "click"-event will be activated again if mouse is being moved. 
        L.DomEvent.off(this._map, 'click', this._mouseClick, this);
	
        this._finishCircle = new L.CircleMarker(this._lastPoint, { 
		// Style of the circle marking the end of the whole Polyline	
            color: '#000', 
			weight: 1, 
            fillColor: '#f00',
			fillOpacity: 1,
			radius:3,
			interactive: false,
		}).addTo(this._layerPaint);
    
        if(this._lastCircle) {
			this._layerPaint.removeLayer(this._lastCircle);
		}
		if(this._tooltip) {
			this._layerPaint.removeLayer(this._tooltip);
		}
		if(this._layerPaint && this._layerPaintPathTemp) {
			this._layerPaint.removeLayer(this._layerPaintPathTemp);
		}
		// Reset everything
		this._restartPath();
	},

	_restartPath: function() {
        this._distance = 0;
		this._tooltip = undefined;
		this._lastCircle = undefined;
		this._lastPoint = undefined;
		this._layerPaintPath = undefined;
		this._layerPaintPathTemp = undefined;
	},
	
	_createTooltip: function(position) {
		var icon = L.divIcon({
			className: 'polylinemeasure-tooltip',
			iconAnchor: [-4, -4]
		});
		this._tooltip = L.marker(position, { 
			icon: icon,
			interactive: false
		}).addTo(this._layerPaint);
	},

	_updateTooltipPosition: function(position) {
		this._tooltip.setLatLng(position);
	},

    _convertDistance: function (distance) {
        dist = distance;
        unit = "km";
        if (dist >= 1000000) {
            dist = (dist/1000).toFixed(0);
        } else if (dist >= 100000) {
            dist = (dist/1000).toFixed(1);
        // don't use 3 decimal digits, cause especially in countries using the "." as thousands seperator a number could optically be confused (e.g. "1.234km": is it 1234 km or 1,234km ?)           
        } else if (dist >= 1000) {
            dist = (dist/1000).toFixed(2);
        } else {
           dist = (dist).toFixed(1);
           unit = "m";
        }
        return {value:dist, unit:unit};
    },

	_updateTooltipDistance: function(total, difference) {
		var totalRound = this._convertDistance(total);
		var differenceRound = this._convertDistance(difference);
		var text = '<div class="polylinemeasure-tooltip-total">' + totalRound.value + ' ' +  totalRound.unit + '</div>';
		if (differenceRound.value > 0 && totalRound.value != differenceRound.value) {
			text += '<div class="polylinemeasure-tooltip-difference">(+' + differenceRound.value + ' ' +  differenceRound.unit + ')</div>';
		}
		this._tooltip._icon.innerHTML = text;
	},

	_onKeyDown: function (e) {
		if(e.keyCode == 27) {
			// "ESC"-Key. If not in path exit measuring mode, else just finish path
			if(!this._lastPoint) {
				this._toggleMeasure();
			} else {
				this._finishPath();
			}
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