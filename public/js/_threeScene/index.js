var THREE = require('three');
var setupScene = require('./_setupScene.js');
var addObjectsToScene = require('./_addObjectsToScene.js');

window.addEventListener('load', function() {
	var config = setupScene();

	poisson = new PoissonDiskSampler(360, 180, 10, 30);
  	poissonResults = poisson.sampleUntilSolution();
	// Adding sounds to the scene as meshes
	addObjectsToScene(config.scene, poissonResults);

	// Then render
	config.animate();
}, false);
