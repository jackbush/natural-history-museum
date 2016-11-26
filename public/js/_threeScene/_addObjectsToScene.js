var THREE = require('three');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');

module.exports = function addObjectsToScene (scene) {
	var soundShapes = [];
	var soundKeys = Object.keys(sounds);
	soundKeys.forEach(function (key) {
		var sound = sounds[key];
		var lat = sound.position.lat;
		var long = sound.position.long;

		// Check for NaN/null values as strings
		if (lat.length > 0 && long.length > 0) {
			// Parse strings to floats
			var lat = parseFloat(lat);
			var long = parseFloat(long);

			// TODO: Make this a butterfly instead
			var geometry = new THREE.SphereGeometry(1, 3, 3); // <- this is so performace sucks less
			var material = new THREE.MeshBasicMaterial({
				color: 0xff0000,
				wireframeLinewidth: 0.1,
				wireframe: true
			});
			var sphere = new THREE.Mesh(geometry, material);

			scene.add(sphere);
			sphere.position.set(long, (100*Math.random() - 50), lat);
			soundShapes.push(sphere);
		}
	});

	return soundShapes;
}