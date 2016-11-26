
function smoothValue(existingValue, newValue, smoothing) {
	return (existingValue * smoothing) + (newValue * (1 - smoothing));
}

getRadian = (x1, y1, x2, y2) => { return Math.atan2(y2 - y1, x2 - x1); };
getAngle = (p1, p2) => { return Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180 / Math.PI; };
getDistance = (p1, p2) => {
  return Math.sqrt((p2.x-p1.x)*(p2.x-p1.x)+(p2.y-p1.y)*(p2.y-p1.y)); 
};
getPointFromAngle = (p, angle, distance)=> {
    var result = {};
    result.x = Math.round(Math.cos(angle * Math.PI / 180) * distance + p.x);
    result.y = Math.round(Math.sin(angle * Math.PI / 180) * distance + p.y);

    return result;
};
getDimensions = (elem) => {
  var dimensions = {
    x: elem.offsetLeft,
    y: elem.offsetTop,
    w: elem.offsetWidth,
    h: elem.offsetHeight,
  };
  dimensions.cx = dimensions.x + (dimensions.w/2);
  dimensions.cy = dimensions.y + (dimensions.h/2);
  return dimensions; 
};
getPointBetween = (p1, p2, distance)=> {
	return getPointFromAngle(p1, getAngle(p1,p2), getDistance(p1, p2)*distance);
};
map = (input, min1, max1, min2, max2)=> {
  var mapped = (((input - min1) * (max2 - min1)) / (max1 - min1)) + min1;
  if (min2 > max2) mapped = min2 - mapped;
  return mapped;
};
$ = (name, parent) => {
  if (!parent) var parent = document;
  var elements = parent.querySelectorAll(name);
  return elements;
};


require('aframe');
var Tone = require('tone');
require('./_compass');

//// JACK

var THREE = require('three');
var Scene = require('../_threeScene/_setupScene.js');
var Objects = require('../_threeScene/_addObjectsToScene.js');

//// GILBOT

var poisson = require('./_poisson');
var maps = require('./_mapping');
var datGui = require('dat-gui');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');



var geolocator, soundplayer, poisson, poissonIndex, poissonResults, soundobjects;


function Geolocator() {
	var _ = this;
	_.start = null;
	_.current = {x: 0, y: 0};
	_.smoothing = 0.9;
	_.newcoords = {x: 0, y: 0};

	_.setup = function() {
		navigator.geolocation.watchPosition(_.setCoords);
	};

	_.setCoords = function(position) {
		_.newcoords = {x: position.coords.latitude, y: position.coords.longitude}; // set newcoords
		if ((_.start === null)&&(_.newcoords.x !== 0)&&(_.newcoords.y !==0)) _.start = _.newcoords; // define "start point"
		_.newcoords.x -= _.start.x; // minus start point to get offset x
		_.newcoords.y -= _.start.y; // minus start point to get offset y
		// console.log('setNewCoords', _.newcoords, _.start);
	};
	_.update = function() {

		_.current.x = smoothValue(_.current.x, _.newcoords.x, 0.99);
		_.current.y = smoothValue(_.current.y, _.newcoords.y, 0.99);
	};

}

////// GPS

function Sampler() {
	var _ = this;
	_.sampler = null;
	_.panVol = null;
	_.setup = function(url, position) {
		// _.panner =  new Tone.Panner3D(position.x, position.y, position.z);
		_.sampler = new Tone.Sampler('../../audio/'+url, function(event, something){
			console.log('Loaded!', _.sampler);
			_.sampler.triggerAttack(0);
		});
		_.sampler.chain(Tone.Master);
	};
	_.update = function(volume, position) {
		_.panner.position.x = position.x;
		_.panner.position.y = position.y;
		_.panner.position.z = position.z;
	};

}


function Soundplayer() {
	var _ = this;
	_.current = [];
	_.samplers = {};
	_.setup = function() {

	};
	_.update = function() { ///// SEARCH FOR DISTANCE
		// console.log(geo.current);


		var closest = soundobjects.getClosest(scene.camera.position);
		//console.log(closest);

		///// CREATE AND UPDATE

		for (var i=0; i<closest.length;i++) {



			if (_.current.indexOf(closest[i].audiofile) === -1) {
				var sampler = new Sampler;

				sampler.setup(closest[i].audiofile); /// SETUP - file, panning position

				_.samplers[closest[i].audiofile] = sampler; //// OBJECT ARRAY
				_.current.push(closest[i].audiofile); //// LIST ARRAY

			} else {
				_.samplers[closest[i].audiofile].update(); // volume, panning position
			}
		}

		console.log('Current active', _.current.length, closest.length);

	};
};


function draw() {

	geolocator.update(); /// Keeps on smoothing values
	soundplayer.update(); /// Looks for new soundz



	//// DEBUG FOUND SOUNDS

	// document.querySelector('.found-sounds').innerText = JSON.stringify(soundplayer.current.length);

	window.requestAnimationFrame(draw); /// LOOP
};


////// SETUP

window.onload = function() {



	poisson = new PoissonDiskSampler(360, 180, 10, 30);
  	poissonResults = poisson.sampleUntilSolution();

	geolocator = new Geolocator;
	geolocator.setup();

	soundplayer = new Soundplayer;
	soundplayer.setup();

	// debugger;

	scene = new Scene;
	window.scene = scene;

	poisson = new PoissonDiskSampler(360, 180, 10, 30);
  	poissonResults = poisson.sampleUntilSolution();
	// Adding sounds to the scene as meshes
	soundobjects = new Objects;
	soundobjects.setup(scene.scene, poissonResults);

	// Then render
	scene.animate();

	draw(); ///// BEGIN INFINITE DRAW LOOP

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
