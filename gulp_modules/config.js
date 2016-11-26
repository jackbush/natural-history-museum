module.exports = {
	app: {
		main: 'bin/www',
		browserSyncPort: 4000
	},
	sass: {
		src: './public/styles/',
		files: [
			'main.scss', 'main.sass'
		],
		dest: './public/styles/output/',
		destProd: './rel/styles/'
	},
	js: {
		src: './public/js/',
		directoryPrefix: '_',
		directories: [
			'main',
			'threeScene'
		],
		dest: './public/js/output/',
		destProd: './rel/js/',
		outputSuffix: '.js'
	},
	pug: {
		src: './views/',
		destProd: './rel/'
	}
};
