var start = null;
var current = {x: 0, y: 0};
var smoothing = 0.9;
var newcoords = null;
var canvas, ctx;
var dot;

////// GPS

function setNewCoords(position) {
	newcoords = {x: position.coords.latitude, y: position.coords.longitude}; // set newcoords
	console.log('setNewCoords', newcoords);
	if (start === null) start = newcoords; // define "start point"
	newcoords.x -= start.x; // minus start point to get offset x
	newcoords.y -= start.y; // minus start point to get offset y
	tweenPosition(); // start the tweening loop (if it's not happening already)
};

function smooth(existingValue, newValue, smoothing) {
	return (existingValue * smoothing) + (newValue * (1 - smoothing));
}


function tweenPosition() {
	current.x = smooth(current.x, newcoords.x, 0.99);
	current.y = smooth(current.y, newcoords.y, 0.99);
	var spherecoords = current.x + ' -1 ' + current.y;
	dot.setAttribute('position', spherecoords);
	window.requestAnimationFrame(tweenPosition); /// RUN ALL THE TIME
};


////// A FRAME

function setupAframe() {
	dot = document.querySelector('a-sphere');
}

////// SETUP

window.onload = function() {
	navigator.geolocation.watchPosition(setNewCoords);
	setupAframe();
	
};