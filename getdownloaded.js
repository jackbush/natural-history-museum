var xml2js = require('xml2js');
var fs = require('fs');
var parser = new xml2js.Parser();
var dir, outputname;
process.argv.forEach(function (val, index, array) {
  if (index === 2) dir = val;
  if (index === 3) outputname = val;
  console.log(dir, outputname);
});
var output = [];
fs.readdir(dir, (err, files) => {
  files.forEach(file => {
    console.log(file);
    output.push(file);
  });
	console.log(output);
	fs.writeFile(outputname, JSON.stringify(output), 'utf8',function() {
		console.log("Success JSON");
	});
});