# Leaflet.PolylineMeasure
* Leaflet Plugin to :triangular_ruler: **measure distances** of simple lines as well as of complex polylines.
* Measuring in **metric system** (meters, kilometers) or in **imperial system** (yards, miles)
* To finish drawing a line just *doubleclick*, or *singleclick* onto the last (=orange) point, or *press "ESC"-key*.
* It is an evolution of jtreml's Plugin [leaflet.measure](https://github.com/jtreml/leaflet.measure) since the original plugin hasn't been bugfixed for years. I modified it to work again with **Leaflet v1.0 and newer** (still runs with Leaflet v0.7) and added some optical improvements.

## Demo
* Please take a look at the following [**Demo (metric values)**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo_metric.html) or [**Demo (imperial values)**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo_imperial.html)

![Screenshot](https://ppete2.github.io/Leaflet.PolylineMeasure/screenshot.jpg)

## Usage

Add 2 lines within your **HTML-code** to load the .css and .js files of the plugin:
```html
<link rel="stylesheet" href="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.css" />
<script src="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.js"></script>
```

Add 1 line within your **Javascript-code** to add the plugin's control into your Leaflet map.  
```js
L.control.polylineMeasure(options).addTo(map);
```

## Default options

```js
options = {
    position: 'topleft',                    // Position to show the control. Possible values are: 'topright', 'topleft', 'bottomright', 'bottomleft'
    imperial: false,                        // Show imperial or metric distances
    title: '',                              // Title for the control
    innerHtml: '&#8614;',                   // HTML to place inside the control
    classesToApply: [],                     // Classes to apply to the control
    backgroundColor: '#8f8',                // Background color for control when selected
    cursor: 'crosshair',                    // Cursor type to show when creating measurements
    clearMeasurementsOnStop: true,          // Clear all the measurements when the control is unselected
    showMeasurementsClearControl: false,    // Show a control to clear all the measurements
    clearControlTitle: 'Clear',             // Title text to show on the clear measurements control button
    clearControlInnerHtml: '&times',        // Clear control inner html
    clearControlClasses: [],                // Collection of classes to add to clear control button
    tempLine: {                             // Styling settings for the temporary dashed line
        color: '#00f',                      // Dashed line color
        weight: 2                           // Dashed line weight
    },          
    line: {                                 // Styling for the solid line
        color: '#006',                      // Solid line color
        weight: 2                           // Solid line weight
    },
    startingPoint: {                        // Style settings for circle marker indicating the starting point of the polyline
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#0f0',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
    lastPoint: {                            // Style settings for circle marker indicating the last point of the polyline
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#fa8d00',               // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
    endPoint: {                             // Style settings for circle marker indicating the last point of the polyline
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#f00',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
};
```
