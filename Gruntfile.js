module.exports = function(grunt) {
	require('jit-grunt')(grunt);

	grunt.initConfig({
		jshint: {
			options: {
				curly: true,
				eqeqeq: true,
				eqnull: true,
				esnext: true,
				browser: true,
				globals: {
					jQuery: true,
					$: true,
					angular: true
				}
			},
			files: ['webapp/src/**/*.js']
		},
		less: {
			development: {
				options: {
					compress: true,
					yuicompress: true,
					optimization: 2
				},
				files: {
					"webapp/assets/css/app.css": "webapp/assets/less/app.less" // destination file and source file
				}
			}
		},
		watch: {
			styles: {
				files: ['webapp/assets/less/*.less'], // which files to watch
				tasks: ['less'],
				options: {
					nospawn: true
				}
			},
			scripts: {
				files: ['webapp/src/**/*.js'],
				tasks: ['jshint', 'babel']
			},
			html: {
				files: ['./**/*.html']
			},
			options: {
				livereload: true
			}
		},
		babel: {
			options: {
				sourceMap: false
			},
			dist: {
				files: [{
					expand: true,
					cwd: './webapp/src',
					src: ['**/*.js'],
					dest: './webapp/dist'
				}]
			}
		}
	});

	grunt.registerTask('default', ['package', 'watch']);
	grunt.registerTask('package', ['jshint', 'babel', 'less']);

};