var THREE = require('three');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');

module.exports = function addObjectsToScene (scene, poissonResults) {
	var _ = this;
	_.soundShapes = [];
	var soundKeys = Object.keys(sounds);

	_.addObject = function(x, y) {


		////// X and Y become X and Z <<< !

		var geometry = new THREE.SphereBufferGeometry(1, 3, 3); // <- this is so performace sucks less
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframeLinewidth: 0.1,
			wireframe: false
		});
		var sphere = new THREE.Mesh(geometry, material);

		scene.add(sphere);
		sphere.position.set(x, 0, y);
		return sphere;
	};

	if (poissonResults) {

		poissonResults.forEach(function (result) {

				var sphere = _.addObject(result.x, result.y);
				// TODO: Make this a butterfly instead
				soundShapes.push(sphere);
		});

	} else {

	// For approximation of final number
		soundKeys = soundKeys.slice(0,50);

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
				var geometry = new THREE.SphereBufferGeometry(1, 3, 3); // <- this is so performace sucks less
				var material = new THREE.MeshBasicMaterial({
					color: 0xffffff,
					wireframeLinewidth: 0.1,
					wireframe: false
				});
				var sphere = new THREE.Mesh(geometry, material);

				scene.add(sphere);
				sphere.position.set(long, 0, lat);
				soundShapes.push(sphere);
			}
		});
	}

	return soundShapes;
}