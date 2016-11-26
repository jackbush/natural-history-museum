var THREE = require('three');
require('./_DeviceOrientationControls');
require('./_FirstPersonControls');

module.exports = function setupScene() {
	// Ingredients
	var container = document.getElementById('container');
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
	var scene = new THREE.Scene();

	// var controls = new THREE.DeviceOrientationControls(camera);
	var controls = new THREE.FirstPersonControls(camera, container);
	controls.noFly = true;
	controls.movementSpeed = 100000;
	controls.lookSpeed = 125;
	controls.lookVertical = true;


	// Renderer setup
	var renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	container.appendChild(renderer.domElement);

	// Animation...
	var animate = function tick() {
		// First person controls
		var clock = new THREE.Clock();
		controls.update(clock.getDelta())
		// Device orientation controls
		// controls.update();
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