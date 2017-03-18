# Leaflet.PolylineMeasure
* Leaflet Plugin to **measure distances** :triangular_ruler: of simple lines as well as of complex polylines.
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
**Options:**
* position: *"topleft"* (= default), *"topright", "bottomleft", "bottomright"*
* imperial: *false* (= default. metric values), *true* (imperial values)
```javascript
L.control.polylineMeasure({position:'topleft', imperial:false}).addTo(map);
```
