

# Leaflet.PolylineMeasure
* Leaflet Plugin to **measure distances** of simple lines as well as of complex polylines.
* Measuring in **metric system** (metres, kilometres), in **imperial system** (feet, landmiles), or in **nautical miles**.
* Lines are drawn as realistic arcs. **Bearings** and **distances** are calculated considering [**Great-circle distance**](https://en.wikipedia.org/wiki/Great-circle_distance) which is the shortest path between 2 points on Earth.
* **Arrows** indicating the **real midways** of the line's great-circle **distances**, not their optical middle which is different due to projection, especially in high latitudes.
* To **finish** drawing a line just *doubleclick*, or *singleclick* onto the last (=orange) point, or *press "ESC"-key*.
* **Moving** of line's points afterwards is possible by clicking and draging them. *(This feature can not be guaranteed to work on every **mobile** browser using touch input, e.g. with Chrome Mobile it isn't working right now)*
* To **continue** a line after it has been finished, hold the *Ctrl-Key* while clicking onto the first or last point of a line.
* To **add** points, hold the *Ctrl-Key* while clicking onto an arrow.
* To **delete** points, hold the *Shift-Key* while clicking onto a point.
* It is an evolution of jtreml's Plugin [leaflet.measure](https://github.com/jtreml/leaflet.measure) since the original plugin hasn't been bugfixed for years. I modified it to work again with **Leaflet v1.0 and newer** (still runs with Leaflet v0.7) and added functional and optical improvements.

## Demos
* Please take a look at these demos:
- [**Demo 1**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo1.html) (kilometre units, bearings, with Clear Control and Unit Control buttons)
- [**Demo 2**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo2.html)  (landmile units, without bearings, without Unit Control button)
- [**Demo 3**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo3.html) (nautical mile units, bearings, without Unit Control and Clear Control buttons)
- [**Demo 4**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo4.html) (two maps)
- [**Demo 5**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo5.html) (programatically providing polyline points - "Seeding Data")

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

## Package manager install

It's possible to install and update the Plugin using package managers like `npm`. This feature has been added by other users. I'm not familiar nor responsible to keep these package manager installs up-to-date. If you notice such installs being outdated, feel free to provide a Pull request or contact one of the persons who introduced package manager installs, thanks.

## Default options

```js
options = {
    position: 'topleft',            // Position to show the control. Values: 'topright', 'topleft', 'bottomright', 'bottomleft'
    unit: 'kilometres',             // Default unit the distances are displayed in. Values: 'kilometres', 'landmiles', 'nauticalmiles'
    useSubunits: true,              // Use subunits (metres/feet) in tooltips if distances are less than 1 kilometre/landmile
    clearMeasurementsOnStop: true,  // Clear all measurements when Measure Control is switched off
    showBearings: false,            // Whether bearings are displayed within the tooltips
    bearingTextIn: 'In',            // language dependend label for inbound bearings
    bearingTextOut: 'Out',          // language dependend label for outbound bearings
    tooltipTextFinish: 'Click to <b>finish line</b><br>',
    tooltipTextDelete: 'Press SHIFT-key and click to <b>delete point</b>',
    tooltipTextMove: 'Click and drag to <b>move point</b><br>',
    tooltipTextResume: '<br>Press CTRL-key and click to <b>resume line</b>',
    tooltipTextAdd: 'Press CTRL-key and click to <b>add point</b>',
                                    // language dependend labels for point's tooltips
    measureControlTitleOn: 'Turn on PolylineMeasure',   // Title for the Measure Control going to be switched on
    measureControlTitleOff: 'Turn off PolylineMeasure', // Title for the Measure Control going to be switched off
    measureControlLabel: '&#8614;', // Label of the Measure Control (Unicode symbols are possible)
    measureControlClasses: [],      // Classes to apply to the Measure Control
    showClearControl: false,        // Show a control to clear all the measurements
    clearControlTitle: 'Clear Measurements', // Title text to show on the Clear Control
    clearControlLabel: '&times',    // Label of the Clear Control (Unicode symbols are possible)
    clearControlClasses: [],        // Classes to apply to Clear Control
    showUnitControl: false,         // Show a control to change the units of measurements
    unitControlUnits: ["kilometres", "landmiles", "nauticalmiles"],
                                    // measurement units being cycled through by using the Unit Control
    unitControlTitle: {             // Title texts to show on the Unit Control
        text: 'Change Units',
        kilometres: 'kilometres',
        landmiles: 'land miles',
        nauticalmiles: 'nautical miles'
    },
    unitControlLabel: {             // Unit symbols to show in the Unit Control and measurement labels
        metres: 'm',
        kilometres: 'km',
        feet: 'ft',
        landmiles: 'mi',
        nauticalmiles: 'nm'
    },
    unitControlClasses: [],         // Classes to apply to the Unit Control
    tempLine: {                     // Styling settings for the temporary dashed line
        color: '#00f',              // Dashed line color
        weight: 2                   // Dashed line weight
    },          
    fixedLine: {                    // Styling for the solid line
        color: '#006',              // Solid line color
        weight: 2                   // Solid line weight
    },
    startCircle: {                  // Style settings for circle marker indicating the starting point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#0f0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    intermedCircle: {               // Style settings for all circle markers between startCircle and endCircle
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#ff0',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    currentCircle: {                // Style settings for circle marker indicating the latest point of the polyline during drawing a line
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f0f',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
    endCircle: {                    // Style settings for circle marker indicating the last point of the polyline
        color: '#000',              // Color of the border of the circle
        weight: 1,                  // Weight of the circle
        fillColor: '#f00',          // Fill color of the circle
        fillOpacity: 1,             // Fill opacity of the circle
        radius: 3                   // Radius of the circle
    },
};
```

## Events
Several Events are fired during the use of the Plugin in order to offer interactivity outside the Plugin.
Subscribe to events with:

```js
map.on('polylinemeasure:toogle', e => { /* e.sttus */ });
map.on('polylinemeasure:start', currentLine => {...});
map.on('polylinemeasure:resume', currentLine => {...});
map.on('polylinemeasure:finish', currentLine => {...});
map.on('polylinemeasure:change', currentLine => {...});
map.on('polylinemeasure:clear', e => {...});
map.on('polylinemeasure:add', e => { /* e.latlng */ });
map.on('polylinemeasure:insert', e => { /* e.latlng */ });
map.on('polylinemeasure:move', e => { /* e.latlng ; e.sourceTarget._latlng */ });
map.on('polylinemeasure:remove', e => { /* e.latlng ; e.sourceTarget._latlng */ });
```
* Please take a look at [**Demo 1**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo1.html), where those events get listed in the JS console of your browser

## Seeding Data
You can programatically draw measured polylines using the `.seed` method.  It takes an array of arrays of `L.LatLng`, which enables drawing multiple, discontinuous polylines:

```js
let polylineMeasure = L.control.polylineMeasure(options);
polylineMeasure.addTo (map);

const line1coords = [
    { lat: 22.156883186860703, lng: -158.95019531250003 },
    { lat: 22.01436065310322, lng: -157.33520507812503 },
    { lat: 21.391704731036587, lng: -156.17065429687503 },
    { lat: 20.64306554672647, lng: -155.56640625000003 }
];
const line2coords = [
    { lat: 19.880391767822505, lng: -159.67529296875003 },
    { lat: 17.90556881196468, lng: -156.39038085937503 }
];

polylineMeasure.seed([line1coords, line2coords])
```

* Please take a look at [**Demo 5**](https://ppete2.github.io/Leaflet.PolylineMeasure/demo5.html), where multiple polylines are drawn and measured programatically.
