var THREE = require('three');
require('./_deviceOrientationControls');

module.exports = function setupScene () {
	// Ingredients
	var container = document.getElementById('container');
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	var controls = new THREE.DeviceOrientationControls(camera);
	var scene = new THREE.Scene();
	var renderer = new THREE.WebGLRenderer();

	// Renderer setup
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	container.appendChild(renderer.domElement);

	// Animation...
	var animate = function tick () {
		controls.update();
		renderer.render(scene, camera);
		window.requestAnimationFrame(tick);
	};

	// Deal with resize event
	window.addEventListener('resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);

	// Return a config object
	return {
		container: container,
		camera: camera,
		controls: controls,
		scene: scene,
		renderer: renderer,
		animate: animate,
	}
};
