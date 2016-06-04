module.exports = function(grunt) {
	grunt.initConfig({
		jshint: {
			files: ['Gruntfile.js', 'js/app.js', 'js/posts.js', 'js/utils.js'],
			options: {
				globals: {
					jQuery: true
				}
			}
		},
		uglify: {
			prod: {
				files: {
					'dist/js/app.min.js': ['js/core/angular.js', 'js/core/momemnt.js', 'js/core/angular-route.js', 'js/core/angular-sanitize.js',
											'js/core/ui-bootstrap-tpls.js',
											'js/textAngular/textAngular.js', 'js/textAngular/textAngularSetup.js',
											'js/textAngular/textAngular-sanitize.js', 'js/textAngular/rangy-core.js',
											'js/textAngular/rangy-selectionsaverestore.js',
											'js/addons/dirDisqus.js', 'js/addons/angular-facebook.js',
											'js/addons/angular-file-upload.js', 'js/addons/angular-modal-service.js',
											'js/addons/ngStorage.js', 'js/app.js', 'js/posts.js', 'js/utils.js']
				}
			}
		},
		less: {
			dist: {
				files: {
					'css/new-style.css': 'css/style.less'
				}
			}
		},
		cssmin: {
			options: {
				shorthandCompacting: false,
				roundingPrecision: -1
			},
				target: {
					files: {
						'dist/css/style.min.css': ['css/bootstrap.css', 'css/bootstrap-rtl.css', 'css/textAngular.css',
						'css/loader.css', 'css/style.css', 'css/new-style.css']
				}
			}
		},
		'ftp-deploy': {
			prod: {
				auth: {
					host: 'ftp.bbari.co.il',
					port: 21,
					authKey: 'key1'
			},
				src: 'dist',
				dest: '/public_html/',
				exclusions: ['server', 'fonts', 'img', 'node_modules', 'server.php']
			}
		},
		copy: {
			prod: {
				files: [{
					expand: true,
					src: ['**', '!**/dist/**', '!**/css/**', '!**/js/**',
						'!**/node_modules/**','!**/server/**', '!**/img/**',
						'!Gruntfile.js', '!README.md', '*.htacess'],
						dest: 'dist/'
				}]
			}
		},
		processhtml: {
			prod: {
				files: {
					'dist/index.html': ['index.html']
				}
			}
		},
		criticalcss: {
			prod: {
				options: {
					url: "http://localhost/",
					width: 1200,
					height: 900,
					outputfile: "dist/css/critical.min.css",
					filename: "dist/css/style.min.css",
					buffer: 800*1024,
					ignoreConsole: true
				}
			}
		},
		imagemin: {
			prod: {
				options: {
					optimizationLevel: 10
				},
				files: [{
					expand: true,
					src: ['img/**/*.{png,jpg,gif}'],
					dest: 'dist/'
				}]
			}
		},
		watch: {
			files: ['js/**/*', 'css/**/*.less'],
			tasks: ['jshint', 'less']
		}
	});

	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-ftp-deploy');
	grunt.loadNpmTasks('grunt-processhtml');
	grunt.loadNpmTasks('grunt-criticalcss');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.registerTask('deploy', ['jshint', 'copy', 'uglify', 'cssmin', 'criticalcss', 'processhtml', 'ftp-deploy']);
	grunt.registerTask('default', ['jshint']);
};