/* jshint esnext: true */

var $ = require('jquery');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');
var exports = module.exports = {};
exports.setupMapping = function(selector) {
	L.mapbox.accessToken = 'pk.eyJ1IjoiZ3Npbm5vdHQiLCJhIjoiTVNtODNITSJ9.0QUmfh4we94cWP9p5FZSjw';

	var geojson = [];
	sounds.forEach(function(sound){
		var lat = parseFloat(sound.position.lat);
		var long = parseFloat(sound.position.long);
		if ((lat)&&(long)) {
			geojson.push({
				type: 'Feature',
				geometry: {
					type: 'Point',
					coordinates: [lat, long],
				}
			});
		}
	});
	var mapGeo = L.mapbox.map('map_geo', 'mapbox.light')
	  .setView([37.8, -96], 1);

	var myLayer = L.mapbox.featureLayer().setGeoJSON(geojson).addTo(mapGeo);
	mapGeo.scrollWheelZoom.disable();

};
