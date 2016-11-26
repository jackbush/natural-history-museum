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
		dest: './public/styles/output/'
	},
	js: {
		src: './public/js/',
		directoryPrefix: '_',
		directories: [
			'main'
		],
		dest: './public/js/output/',
		outputSuffix: '.js'
	},
	pug: {
		src: './views/prod.pug',
		newName: 'index',
		dest: './rel/'
	},
	copy: {
		files: [
			'./public/styles/output/*.css',
			'./public/js/output/*.js'
		],
		dest: './rel/'
	}
};
