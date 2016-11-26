var THREE = require('three');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');
var ogg = require('../../../audio.json');
var datGui = require('dat-gui');

window.ogg = ogg;

module.exports = function Objects () {
	var _ = this;
	_.scene;
	_.poissonResults;
	_.objects = [];
	_.counter = 0;

	_.ctrl = {
		distanceThreshold: 10,
	};


	_.gui = new datGui.GUI;
	_.gui.add(_.ctrl, 'distanceThreshold', 0, 100);
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
		sphere.audiofile = ogg[_.counter];
		_.counter += 1;
		if (_.counter >= ogg.length) _.counter = 0;
		console.log(_.counter, ogg.length, sphere.audiofile);
		_.scene.add(sphere);
		sphere.position.set(x, 0, y);
		return sphere;
	};

	_.getClosest = function(cameraposition) {

		// var xy = {x: position.x, y: position.z};
		// console.log(xy);
		var found = [];
		for(var i=0; i< _.objects.length;i++) {
			var object = _.objects[i];
			var distance = cameraposition.distanceTo(object.position);
			if (distance < _.ctrl.distanceThreshold) {
				found.push(object);
			}
		};
		return found;
	};


}