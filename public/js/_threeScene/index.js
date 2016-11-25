var THREE = require('three');
require('./_deviceOrientationControls');

var addSoundsToScene = require('./_addSoundsToScene.js');

window.addEventListener('load', function() {
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

	// Adding sounds to the scene as meshes
	addSoundsToScene(scene);

	// Then render
	animate();

	// Deal with resize event
	window.addEventListener('resize', function() {
		camera.aspect = window.innerWidth / window.innerHeight;
		camera.updateProjectionMatrix();
		renderer.setSize(window.innerWidth, window.innerHeight);
	}, false);
}, false);
