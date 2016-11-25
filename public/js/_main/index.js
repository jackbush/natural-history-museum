require('aframe');
require('./_compass');
var maps = require('./_mapping');

var start = null;
var current = {x: 0, y: 0};
var smoothing = 0.9;
var newcoords = null;
var canvas, ctx;
var dot, camera;

////// GPS

function setNewCoords(position) {
	newcoords = {x: position.coords.latitude, y: position.coords.longitude}; // set newcoords
	console.log('is first defined?', start);
	if ((start === null)&&(newcoords.x !== 0)&&(newcoords.y !==0)) start = newcoords; // define "start point"
	newcoords.x -= start.x; // minus start point to get offset x
	newcoords.y -= start.y; // minus start point to get offset y
	console.log('setNewCoords', newcoords, start);
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
	camera = document.querySelector('a-camera');
}


////// SETUP

window.onload = function() {
	navigator.geolocation.watchPosition(setNewCoords);
	setupAframe();
	


};

function setupCompass() {


	Compass.noSupport(function () {
	 console.log('no support');
	});

	Compass.needGPS(function () {
	 console.log('needs signal');
	}).needMove(function () {
	 console.log('move around');
	}).init(function () {
	 console.log('init');
	});

	Compass.watch(function (heading) {
	 console.log('watching: ', heading);
	});

}


function setupCamera() {

	navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
		var video = document.querySelector('video');
		video.src = window.URL.createObjectURL(localMediaStream);
		video.width = window.innerWidth;
		video.height = window.innerHeight;
		video.onloadedmetadata = function(e) {
			console.log('whooooo');
			var result = video.play();
			if (result.code == 35) console.log(result.message); 
			video.volume = 0;
		};
	}, onFailSoHard);
}
