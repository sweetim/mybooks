'use strict';

module.exports = function(grunt){
	require('load-grunt-tasks')(grunt);

	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		concat: {
			options: {
				seperator: ';'
			},
			dist: {
				src: ['client/src/**/*.js'],
				dest: 'client/dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.js'
			}
		},
		uglify: {
			options: {
				banner: '/*<%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %>*/\n'
			},
			dist: {
				files: {
					'client/dist/<%= pkg.version %>/js/<%= pkg.name %>-<%= pkg.version %>.min.js': ['<%= concat.dist.dest %>']
				}			
			}
		},
		htmlmin: {
			dist: {
				options: {
					removeComments: true,
					collapseWhitespace: true
				},
				files: [{
					expand: true,
					cwd: 'client/dist/<%= pkg.version %>/',
					src: ['index.html', 'app/views/*.html'],
					dest: 'client/dist/<%= pkg.version %>/'
				}]
				/*src: ['client/dist/<%= pkg.version %>/index.html', 'client/src/app/views/**.html'],
				dest: ['client/dist/<%= pkg.version %>/index.html', 'client/dist/<%= pkg.version %>/app/views/']
				files: {
					'client/dist/<%= pkg.version %>/index.html': 'client/dist/<%= pkg.version %>/index.html'
				}*/
			}
		},
		cssmin: {
			minify: {
				expand: true,
				cwd: 'client/src/css/',
				src: '*.css',
				dest: 'client/dist/<%= pkg.version %>/css/',
				ext: '.min.css'
			}
		},
		sass: {
			dist: {
				files: [{
					expand: true,
					cwd: 'client/src/css/scss/',
					src: '*.scss',
					dest: 'client/src/css/',
					ext: '.css'
				}]
			}
		},
		jshint: {
			files: ['server/**/*.js', 'client/src/**/*.js', '*.js'],
			options: {
				jshintrc: true
			}
		},
		copy: {
			html: {
				files: [{
					expand: true,
					cwd: 'client/src/',
					src: ['index.html', 'app/views/*.html'],
					dest: 'client/dist/<%= pkg.version %>/'
				}]
			}
		},
		useminPrepare: {
			html: 'client/src/index.html',
			options: {
				dest: 'client/dist/<%= pkg.version %>/'
			}
		},
		usemin: {
			html: 'client/dist/<%= pkg.version %>/index.html'
		},
		watch: {
			files: ['<%= jshint.files %>', '.jshintrc'],
			tasks: ['jshint']
		}
	});

	grunt.registerTask('build', [
		'copy:html'　,'useminPrepare', 'concat', 'uglify', 'cssmin', 'usemin', 'htmlmin'
	]);
	
	grunt.registerTask('min', ['concat', 'uglify', 'htmlmin', 'cssmin']);
	grunt.registerTask('test', ['jshint']);
	grunt.registerTask('default', ['watch']);
};