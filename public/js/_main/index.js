require('aframe');
var Tone = require('tone');
require('./_compass');
var poisson = require('./_poisson');
var maps = require('./_mapping');
var datGui = require('dat-gui');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');



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



var geolocator, soundplayer, poisson, poissonIndex, poissonResults;


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
		console.log('is first defined?', _.start);
		if ((_.start === null)&&(_.newcoords.x !== 0)&&(_.newcoords.y !==0)) _.start = _.newcoords; // define "start point"
		_.newcoords.x -= _.start.x; // minus start point to get offset x
		_.newcoords.y -= _.start.y; // minus start point to get offset y
		console.log('setNewCoords', _.newcoords, _.start);
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
	_.setup = function(url) {
		console.log("Setup new sampler!")
		var urlSanitised = url.replace('"', '').replace('"', '');
		urlSanitised = "../../audio/417-13_Platystolus_faberi_552r3_.wav";
		_.panner = new Tone.Panner(1);
		_.sampler = new Tone.Sampler(urlSanitised, function(event, something){
			console.log('Loaded!', _.sampler);
			_.sampler.triggerAttack(0);
		});
		_.sampler.chain(_.panner, Tone.Master);
	};
	_.update = function(volume, panning) {

	};

}


function Soundplayer() {
	var _ = this;
	_.ctrl = {
		distanceThreshold: 10,
	};


	_.gui = new datGui.GUI;
	// window.gui = _.gui;
	_.gui.add(_.ctrl, 'distanceThreshold', 0, 100);
	_.current = [];
	_.samplers = {};
	_.setup = function() {

	};
	_.update = function(geo, items) {
		// console.log(geo.current);

		var found = [];
		for(var i=0; i< items.length;i++) {
			var sound = items[i];

			///// USE ORIGINAL

			// var latlong = {x: parseFloat(sound.position.lat), y: parseFloat(sound.position.long)};

			///// USE POISSON

			latlong = {
				x: poissonResults[i].x-180,
				y: poissonResults[i].y-90,
			};
			// console.log(latlong);

			if ((latlong.x)&&(latlong.y)) {
				var distance = getDistance(geo.current, latlong);
				if (distance < _.ctrl.distanceThreshold) {
					// console.log(sounds[i]);
					// getAngle(geo.current, latlong);
					found.push({item: sounds[i], distance: distance});
				}
			}
		};

		///// CREATE AND UPDATE

		for (var i=0; i<found.length;i++) {
			// console.log(found[i]);
			var id = found[i].item.sound[0].replace('"', '').replace('"', '');
			var url = found[i].item.sound[2];
			var distance = found[i].distance;
			if (_.current.indexOf(id) === -1) {
				var sampler = new Sampler;
				sampler.setup(url);
				_.samplers[id] = sampler;
				_.current.push(id);
			} else {
				// console.log(id, _.samplers);


				_.samplers[id].update();
			}
		};

		// console.log("Soundplayer.update() ", found.length);

		///// CREATE AND UPDATE
	};
};


function draw() {

	geolocator.update(); /// Keeps on smoothing values
	soundplayer.update(geolocator, poissonResults); /// Looks for new soundz


	///// DEBUG CAMERA ROTATION

	// document.querySelector('.camera-angle').innerText = JSON.stringify(document.querySelector('a-camera').getAttribute('rotation').y);

	//// DEBUG CAMERA POSITION

	// var position = document.querySelector('a-camera').getAttribute('position');
	// document.querySelector('.camera-position').innerText = JSON.stringify(position);

	/// AUTO UPDATE POSITION FROM CAMERA

	// geolocator.current.x = position.x;
	// geolocator.current.y = position.z;


	//// DEBUG FOUND SOUNDS

	document.querySelector('.found-sounds').innerText = JSON.stringify(soundplayer.current.length);

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
