# Leaflet.PolylineMeasure
* Leaflet Plugin to :triangular_ruler: **measure distances** of simple lines as well as of complex polylines.
* Measuring in **metric system** (metre, kilometre), in **imperial system** (foot, landmile), or in **nautical miles**.
* Lines are drawn as realistic arcs. Bearings and distances are calculated considering [Great.circle distance](https://en.wikipedia.org/wiki/Great-circle_distance) which is the shortest path between 2 points on Earth.
* To **finish** drawing a line just *doubleclick*, or *singleclick* onto the last (=orange) point, or *press "ESC"-key*.
* To **continue** a line after it has been finished, just hold the *Ctrl-Key* while clicking onto the last point of a line.
* **Moving** of line's points afterwards is possible by clicking and draging them. *(This feature can not be guaranteed to work on every **mobile** browser using touch input, e.g. with Chrome Mobile it isn't working right now)*
* **Arrows** indicating the **real midways** of the line's great-circle **distances**, not their optical middle which is different due to projection, especially in high latitudes. 
* It is an evolution of jtreml's Plugin [leaflet.measure](https://github.com/jtreml/leaflet.measure) since the original plugin hasn't been bugfixed for years. I modified it to work again with **Leaflet v1.0 and newer** (still runs with Leaflet v0.7) and added some optical improvements.

## Demos
* Please take a look at [**Demo 1**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo1.html) (metre units, bearings, with Clear-button and Units-button) or [**Demo 2**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo2.html)  (landmile units, without bearings, without Unit-button) or [**Demo 3**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo3.html) (nauticalmile units, bearings, without Unit-button and Clear-button) [**Demo 4**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo4.html) (two maps)

![Screenshot](https://ppete2.github.io/Leaflet.PolylineMeasure/screenshot.jpg)

## Usage

Add 2 code lines within your **HTML-file** to load the .css and .js files of the plugin:
```html
<link rel="stylesheet" href="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.css" />
<script src="https://ppete2.github.io/Leaflet.PolylineMeasure/Leaflet.PolylineMeasure.js"></script>
```

Add 1 code line within your **Javascript-file** to add the plugin's control into your Leaflet map.  
```js
L.control.polylineMeasure(options).addTo(map);
```

## Default options

```js
options = {
    bearingTextIn: 'In'                     // language dependend label for inbound bearings
    bearingTextOut: 'Out',                  // language dependend label for outbound bearings
    bearingTextOut: 'Out',                  // language dependend label for outbound bearings
    bindTooltipText: "Click and drag to <b>move point</b><br>Press CTRL-key and click to <b>resume line</b>",
                                            // language dependend label for last point's tooltip
    changeUnitsText: 'Change Units',        // language dependend label for "Change units"-button
    position: 'topleft',                    // Position to show the control. Possible values are: 'topright', 'topleft', 'bottomright', 'bottomleft'
    unit: 'metres',                         // Show imperial or metric distances. Values: 'metres', 'landmiles', 'nauticalmiles'
    showBearings: false,                    // Whether bearings are displayed within the tooltips
    measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the control going to be switched on
    measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the control going to be switched off
    measureControlLabel: '&#8614;',         // HTML to place inside the control
    measureControlClasses: [],              // Classes to apply to the control
    backgroundColor: '#8f8',                // Background color for control when selected
    cursor: 'crosshair',                    // Cursor type to show when creating measurements
    clearMeasurementsOnStop: true,          // Clear all the measurements when the control is unselected
    showMeasurementsClearControl: false,    // Show a control to clear all the measurements
    clearControlTitle: 'Clear Measurements',// Title text to show on the clear measurements control button
    clearControlLabel: '&times',            // Clear control inner html
    clearControlClasses: [],                // Collection of classes to add to clear control button
    showUnitControl: false,                 // Show a control to change the units of measurements
    tempLine: {                             // Styling settings for the temporary dashed line
        color: '#00f',                      // Dashed line color
        weight: 2                           // Dashed line weight
    },          
    fixedLine: {                            // Styling for the solid line
        color: '#006',                      // Solid line color
        weight: 2                           // Solid line weight
    },
    startCircle: {                          // Style settings for circle marker indicating the starting point of the polyline
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#0f0',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
    intermedCircle: {                       // Style settings for all circle markers between startCircle and endCircle
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#ff0',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
    currentCircle: {                        // Style settings for circle marker indicating the latest point of the polyline during drawing a line
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#f0f',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
    endCircle: {                            // Style settings for circle marker indicating the last point of the polyline
        color: '#000',                      // Color of the border of the circle
        weight: 1,                          // Weight of the circle
        fillColor: '#f00',                  // Fill color of the circle
        fillOpacity: 1,                     // Fill opacity of the circle
        radius: 3                           // Radius of the circle
    },
};
```
