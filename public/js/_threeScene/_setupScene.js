var THREE = require('three');
require('./_deviceOrientationControls');
require('./_FirstPersonControls');

module.exports = function() {
	// Ingredients

	var _ = this;

	var container = document.getElementById('container');
	_.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100); //// FOV, RATIO, MIN, MAX
	_.scene = new THREE.Scene();
	_.controls = new THREE.FirstPersonControls(_.camera, container);
	_.controls.noFly = true;
	_.controls.movementSpeed = 4;
	_.controls.lookSpeed = 0.2;
	_.controls.lookVertical = false;


	// Renderer setup
	var renderer = new THREE.WebGLRenderer();
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.domElement.style.position = 'absolute';
	renderer.domElement.style.top = 0;
	container.appendChild(renderer.domElement);

	// Animation...
	var clock = new THREE.Clock();
	_.animate = function() {
		// First person _.controls
		_.controls.update(clock.getDelta())
		// Device orientation _.controls
		// _.controls.update();
		renderer.render(_.scene, _.camera);
		window.requestAnimationFrame(_.animate);
	};

	// Deal with resize event
	window.addEventListener('resize', function() {
		_.camera.aspect = window.innerWidth / window.innerHeight;
		_.camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);

};