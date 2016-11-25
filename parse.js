var xml2js = require('xml2js');
var fs = require('fs');
var parser = new xml2js.Parser();
var xmlUrl, xmlLocation;
process.argv.forEach(function (val, index, array) {
  if (index === 2) xmlLocation = val;
  if (index === 3) xmlUrl = val;
});
fs.readFile('./' + xmlLocation + xmlUrl, function(err, data) {
    parser.parseString(data, function (err, result) {
    	var rows = result.archive.extension.concat(result.archive.core);
        var files = [];
        rows.forEach((row)=>{
        	row.files.forEach((file)=>{
        		files.push(file.location[0]);
        	});
        });
        var output = [];
		var specimen = [];
		var images = [];
	    var classification = [];
        files.forEach((file, i)=>{
        	if (file === "classification.txt"){ ////// CLASSIFICATION
	        	var unit = {};
	        	var url = './' + xmlLocation + file;
				fs.readFile(url,'utf8', function(err, data) {
					var lines = data.split('\n');
					lines.forEach((line)=>{
						var array = line.split(',');
						// console.log(array[0]);
						classification.push(array);
						// console.log(classification);
					});
				});
			}
        	if (file === "specimen.txt"){ ////// CLASSIFICATION
	        	var unit = {};
	        	var url = './' + xmlLocation + file;
				fs.readFile(url,'utf8', function(err, data) {
					var lines = data.split('\n');
					lines.forEach((line)=>{
						var array = line.split(',');
						specimen.push(array);
					});
				});
			}
        	if (file === "image.txt"){ ///// FILES!!!!
	        	var unit = {};
	        	var url = './' + xmlLocation + file;
				fs.readFile(url,'utf8', function(err, data) {
					var lines = data.split('\n');
					lines.forEach((line)=>{
						var array = line.split(',');
						images.push(array);
					});
				});
			}

        });

		setTimeout(function(e){
			console.log('No. of classifications', classification.length);
			console.log('No. of specimen', specimen.length);
			console.log('No. of images', images.length);
			var output = [];
			images.forEach((img)=>{
				//console.log(img[1]);
				if (img[2]) {
					var filetype = img[2].substring(img[2].length -4 , img[2].length - 1);
					if ((filetype === 'mp3')||(filetype==='wav')) {
						var object = {};
						object.sound = img;
						specimen.forEach((s)=>{
							if (img[1] === s[0]) object.specimen = s;
						});
						classification.forEach((c)=>{
							if (img[1] === c[0]) object.classification = c;
						});
						if (object.classification&&object.specimen) {
							var lat = object.specimen[5].replace('"', '').replace('"', '');
							var long = object.specimen[6].replace('"', '').replace('"', '');
							object.position = {
								lat: lat,
								long: long,
							};
							output.push(object);
							console.log(lat, long);
						}
					}
				}
			});
			console.log(output.length);
			fs.writeFile(xmlLocation+xmlUrl + '.json', JSON.stringify(output), 'utf8',function() {
				console.log("Success");
			});
		},1000);
        console.log('Done');
    });
});