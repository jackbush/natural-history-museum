var THREE = require('three');
var sounds = require('../../../bin/bioacoustica2015/meta.xml.json');
var ogg = require('../../../audio.json');
var datGui = require('dat-gui');

window.ogg = ogg;
window.sounds = sounds;



module.exports = function Objects () {
	var _ = this;
	_.scene;
	_.poissonResults;
	_.objects = [];
	_.counter = 0;

	_.ctrl = {
		distanceThreshold: 10,
	};


	_.gui = new datGui.GUI;
	_.gui.add(_.ctrl, 'distanceThreshold', 0, 100);
	_.setup = function(scene, poissonResults) {
		_.scene = scene;
		_.poissonResults = poissonResults;

		poissonResults.forEach(function (result) {
			var sphere = _.addObject(result.x, result.y);
			_.objects.push(sphere);
		});
	};


	_.makeTextSprite = function( message, parameters )
	{
		if ( parameters === undefined ) parameters = {};
		
		var fontface = parameters.hasOwnProperty("fontface") ? 
			parameters["fontface"] : "Arial";
		
		var fontsize = parameters.hasOwnProperty("fontsize") ? 
			parameters["fontsize"] : 18;
		
		var borderThickness = parameters.hasOwnProperty("borderThickness") ? 
			parameters["borderThickness"] : 4;
		
		var borderColor = parameters.hasOwnProperty("borderColor") ?
			parameters["borderColor"] : { r:0, g:0, b:0, a:1.0 };
		
		var backgroundColor = parameters.hasOwnProperty("backgroundColor") ?
			parameters["backgroundColor"] : { r:255, g:255, b:255, a:1.0 };

		// var spriteAlignment = THREE.SpriteAlignment.topLeft;
			
		var canvas = document.createElement('canvas');
		var context = canvas.getContext('2d');
		context.font = "Bold " + fontsize + "px " + fontface;
	    
		// get size data (height depends only on font size)
		var metrics = context.measureText( message );
		var textWidth = metrics.width;
		
		// background color
		context.fillStyle   = "rgba(" + backgroundColor.r + "," + backgroundColor.g + ","
									  + backgroundColor.b + "," + backgroundColor.a + ")";
		// border color
		context.strokeStyle = "rgba(" + borderColor.r + "," + borderColor.g + ","
									  + borderColor.b + "," + borderColor.a + ")";

		context.lineWidth = borderThickness;
		// _.roundRect(context, borderThickness/2, borderThickness/2, textWidth + borderThickness, fontsize * 1.4 + borderThickness, 6);
		// 1.4 is extra height factor for text below baseline: g,j,p,q.
		
		// text color
		context.fillStyle = "rgba(255, 255, 255, 1.0)";

		context.fillText( message, borderThickness, fontsize + borderThickness);
		
		// canvas contents will be used for a texture
		var texture = new THREE.Texture(canvas);
		texture.minFilter = THREE.LinearFilter;
		texture.needsUpdate = true;

		var spriteMaterial = new THREE.SpriteMaterial( 
			{ map: texture } );
		var sprite = new THREE.Sprite( spriteMaterial );
		sprite.scale.set(3,2,0);
		return sprite;	
	}

	// function for drawing rounded rectangles
	_.roundRect = function(ctx, x, y, w, h, r) 
	{
	    ctx.beginPath();
	    ctx.moveTo(x+r, y);
	    ctx.lineTo(x+w-r, y);
	    ctx.quadraticCurveTo(x+w, y, x+w, y+r);
	    ctx.lineTo(x+w, y+h-r);
	    ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h);
	    ctx.lineTo(x+r, y+h);
	    ctx.quadraticCurveTo(x, y+h, x, y+h-r);
	    ctx.lineTo(x, y+r);
	    ctx.quadraticCurveTo(x, y, x+r, y);
	    ctx.closePath();
	    ctx.fill();
		ctx.stroke();   
	}
	var index = 0;
	_.addObject = function(x, y) {


		////// X and Y become X and Z <<< !

		var geometry = new THREE.SphereBufferGeometry(1, 3, 3); // <- this is so performace sucks less
		var material = new THREE.MeshBasicMaterial({
			color: 0xffffff,
			wireframeLinewidth: 0.1,
			wireframe: false
		});




		var classify = sounds[index].classification[1];
		var recordist = sounds[index].classification[4];
		var date = sounds[index].classification[5];
		// console.log(1, classify, 2, recordist, 3, date);

		var spritey = _.makeTextSprite(classify,{fontsize: 24, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:.0} });
		spritey.position.set(x - 180, 0.8, y - 90);
		_.scene.add(spritey);

		var spritey = _.makeTextSprite(recordist+date,{fontsize: 16, fontface: "Georgia", borderColor: {r:0, g:0, b:255, a:.0} });
		spritey.position.set(x - 180, 0, y - 90);
		_.scene.add(spritey);

		var sphere = new THREE.Mesh(geometry, material);
		sphere.audiofile = ogg[_.counter];
		_.counter += 1;
		if (_.counter >= ogg.length) _.counter = 0;
		// console.log(_.counter, ogg.length, sphere.audiofile);
		// _.scene.add(sphere);
		sphere.position.set(x - 180, 0, y - 90);
		index += 1;
		return sphere;
	};

	_.getClosest = function(cameraposition) {

		// var xy = {x: position.x, y: position.z};
		// console.log(xy);
		var found = [];
		for(var i=0; i< _.objects.length;i++) {
			var object = _.objects[i];
			var distance = cameraposition.distanceTo(object.position);
			if (distance < _.ctrl.distanceThreshold) {
				found.push(object);
			}
		};
		return found;
	};


}