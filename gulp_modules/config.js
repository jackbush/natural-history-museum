module.exports = {
	app: {
		main: 'bin/www',
		browserSyncPort: 4000
	},
	sass: {
		src: './public/styles/',
		files: [
			'main.scss'
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
		src: './views/'
	}
};
