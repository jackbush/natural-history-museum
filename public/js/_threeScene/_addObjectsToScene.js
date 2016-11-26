var THREE = require('three');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');

module.exports = function Objects () {
	var _ = this;
	_.scene;
	_.poissonResults;
	_.objects = [];

	_.setup = function(scene, poissonResults) {
		_.scene = scene;
		_.poissonResults = poissonResults;

		poissonResults.forEach(function (result) {
				var sphere = _.addObject(result.x, result.y);
				_.objects.push(sphere);
		});
	};

	_.addObject = function(x, y) {


		////// X and Y become X and Z <<< !

		var geometry = new THREE.SphereBufferGeometry(1, 3, 3); // <- this is so performace sucks less
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframeLinewidth: 0.1,
			wireframe: false
		});
		var sphere = new THREE.Mesh(geometry, material);

		_.scene.add(sphere);
		sphere.position.set(x, 0, y);
		return sphere;
	};


}