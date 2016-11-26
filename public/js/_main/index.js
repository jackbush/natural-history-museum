
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
require('./_threetone');
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
	_.basic;
	_.setup = function() {
		console.log("Setup GEO");
		navigator.geolocation.watchPosition(_.setCoords);
	};

	_.setCoords = function(position) {
		console.log("setCoords GEO", position);
		_.basic = position.coords.latitude;
		_.newcoords = {x: position.coords.latitude, y: position.coords.longitude}; // set newcoords
		if ((_.start === null)&&(_.newcoords.x !== 0)&&(_.newcoords.y !==0)) {
			_.start = _.newcoords; // define "start point"
			console.log("CREATE START");
		}
		_.newcoords.x -= _.start.x; // minus start point to get offset x
		_.newcoords.y -= _.start.y; // minus start point to get offset y
		// console.log('setNewCoords', _.newcoords, _.start);
	};
	_.update = function() {
		document.querySelector('.geolocator').innerText = JSON.stringify(_.basic);
		_.current.x = smoothValue(_.current.x, _.newcoords.x, 0.99);
		_.current.y = smoothValue(_.current.y, _.newcoords.y, 0.99);
	};

}

////// GPS

function Sampler() {
	var _ = this;
	_.sampler = null;
	_.panner = null;
	_.volume = null;
	_.setup = function(url, position, controls) {
		_.panner =  new Tone.Panner3D();
		_.volume = new Tone.Volume(-12);
		_.reverb = new Tone.Freeverb(1, 3000);
		_.JCreverb = new Tone.JCReverb(0.4);
		_.sampler = new Tone.Sampler('../../audio/'+url, function(event, something){
			console.log('Loaded!', _.sampler);




			_.sampler.triggerAttack(0);
		});
		_.sampler.chain(_.panner, Tone.Master);

	};
	_.update = function(volume, camera, object) {
		var distance = camera.position.distanceTo(object.position);
		var scaled = map(distance, 0, soundobjects.ctrl.distanceThreshold, 0, 12);
		Tone.Listener.updatePosition(camera);
		_.panner.updatePosition(object);
		_.volume.volume = (12 - ((scaled - 12) * -1)) * -1;
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

				sampler.setup(closest[i].audiofile, closest[i].position); /// SETUP - file, panning position

				_.samplers[closest[i].audiofile] = sampler; //// OBJECT ARRAY
				_.current.push(closest[i].audiofile); //// LIST ARRAY

			} else {
				_.samplers[closest[i].audiofile].update(0, scene.camera, closest[i]); // volume, panning position
			}
		}

		// console.log('Current active', _.current.length, closest.length);

	};
};


var touchForward = false;

function draw() {

	geolocator.update(); /// Keeps on smoothing values
	soundplayer.update(); /// Looks for new soundz
	// scene.camera.position.x = geolocator.current.x;
	// scene.camera.position.z = geolocator.current.y;

	// scene.camera.position.x += 1;
	//// DEBUG FOUND SOUNDS

	// if (touchForward) {
	// 	scene.camera.position.x += 0.8;
	// 	scene.camera.position.z += 0.8;
	// }

	// var point =  getPointFromAngle({x: scene.camera.position.x, y: scene.camera.position.y}, scene.camera.rotation.y, 0.4);
	// console.log(point);
	// scene.camera.position.x = point.x;
	// scene.camera.position.z = point.y;
	// var speed = 1;
	// var forward = scene.camera.lookAt() - scene.camera.Position;
	// console.log(forward);
	// scene.camera.position.x += forward.X * speed;
	// scene.camera.position.y += forward.Y * speed;
	// scene.camera.position.z += forward.Z * speed;
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
	window.soundplayer = soundplayer;
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

	// setupCamera();
	document.addEventListener( 'mousedown', startAudio, false );
	document.addEventListener( 'touchstart', function() { touchForward = true; }, false );
	document.addEventListener( 'touchend',  function() { touchForward = false; }, false );
	document.addEventListener( 'touchmove', startAudio, false );

};

function startAudio( event ) {

	// if ( event.touches.length === 1 ) {

		// event.preventDefault();
		// //create a synth and connect it to the master output (your speakers)
		// var synth = new Tone.Synth().toMaster();

		// //play a middle 'C' for the duration of an 8th note
		// synth.triggerAttackRelease("C4", "8n");

		// Object.keys(soundplayer.samplers).forEach((key)=>{
		// 	soundplayer.samplers[key].sampler.triggerAttack(0);
		// });

	// }

}



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
	}, function() {});
}
