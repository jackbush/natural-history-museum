require('aframe');

(function(e){"use strict";var t=function(t){return t!=null||t!=e},n=function(e,t){var n=i._callbacks[e];for(var r=0;r<n.length;r++)n[r].apply(window,t)},r=function(e){var t=0;for(var n=e.length-1;n>e.length-6;n--)t+=e[n];return t/5},i=window.Compass={method:e,watch:function(e){var t=++i._lastId;return i.init(function(n){if(n=="phonegap")i._watchers[t]=i._nav.compass.watchHeading(e);else if(n=="webkitOrientation"){var r=function(t){e(t.webkitCompassHeading)};i._win.addEventListener("deviceorientation",r),i._watchers[t]=r}else if(n=="orientationAndGPS"){var s,r=function(t){s=-t.alpha+i._gpsDiff,s<0?s+=360:s>360&&(s-=360),e(s)};i._win.addEventListener("deviceorientation",r),i._watchers[t]=r}}),t},unwatch:function(e){return i.init(function(t){t=="phonegap"?i._nav.compass.clearWatch(i._watchers[e]):(t=="webkitOrientation"||t=="orientationAndGPS")&&i._win.removeEventListener("deviceorientation",i._watchers[e]),delete i._watchers[e]}),i},needGPS:function(e){return i._callbacks.needGPS.push(e),i},needMove:function(e){return i._callbacks.needMove.push(e),i},noSupport:function(e){return i.method===!1?e():t(i.method)||i._callbacks.noSupport.push(e),i},init:function(e){if(t(i.method)){e(i.method);return}i._callbacks.init.push(e);if(i._initing)return;return i._initing=!0,i._nav.compass?i._start("phonegap"):i._win.DeviceOrientationEvent?(i._checking=0,i._win.addEventListener("deviceorientation",i._checkEvent),setTimeout(function(){i._checking!==!1&&i._start(!1)},500)):i._start(!1),i},_lastId:0,_watchers:{},_win:window,_nav:navigator,_callbacks:{init:[],noSupport:[],needGPS:[],needMove:[]},_initing:!1,_gpsDiff:e,_start:function(e){i.method=e,i._initing=!1,n("init",[e]),i._callbacks.init=[],e===!1&&n("noSupport",[]),i._callbacks.noSupport=[]},_checking:!1,_checkEvent:function(e){i._checking+=1;var n=!1;t(e.webkitCompassHeading)?i._start("webkitOrientation"):t(e.alpha)&&i._nav.geolocation?i._gpsHack():i._checking>1?i._start(!1):n=!0,n||(i._checking=!1,i._win.removeEventListener("deviceorientation",i._checkEvent))},_gpsHack:function(){var e=!0,s=[],o=[];n("needGPS");var u=function(e){s.push(e.alpha)};i._win.addEventListener("deviceorientation",u);var a=function(a){var f=a.coords;if(!t(f.heading))return;e&&(e=!1,n("needMove")),f.speed>1?(o.push(f.heading),o.length>=5&&s.length>=5&&(i._win.removeEventListener("deviceorientation",u),i._nav.geolocation.clearWatch(l),i._gpsDiff=r(o)+r(s),i._start("orientationAndGPS"))):o=[]},f=function(){i._win.removeEventListener("deviceorientation",u),i._start(!1)},l=i._nav.geolocation.watchPosition(a,f,{enableHighAccuracy:!0})}}})();

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
	


	// navigator.getUserMedia({video: true, audio: true}, function(localMediaStream) {
	// 	var video = document.querySelector('video');
	// 	video.src = window.URL.createObjectURL(localMediaStream);
	// 	video.width = window.innerWidth;
	// 	video.height = window.innerHeight;
	// 	video.onloadedmetadata = function(e) {
	// 		console.log('whooooo');
	// 		var result = video.play();
	// 		if (result.code == 35) console.log(result.message); 
	// 		video.volume = 0;
	// 	};
	// }, onFailSoHard);

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

};


