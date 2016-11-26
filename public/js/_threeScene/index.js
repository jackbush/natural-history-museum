var THREE = require('three');
var setupScene = require('./_setupScene.js');
var addObjectsToScene = require('./_addObjectsToScene.js');

window.addEventListener('load', function() {
	var config = setupScene();

	// Adding sounds to the scene as meshes
	addObjectsToScene(config.scene);

	// Then render
	config.animate();
}, false);
