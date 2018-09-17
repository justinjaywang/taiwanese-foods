module.exports = function(grunt) {

  // project configuration
  grunt.initConfig({
    concat: {
      options: {
        separator: ';',
      },
      dist: {
        src: [
          'assets/scripts/_source/plugins/blazy.js',
          'assets/scripts/_source/plugins/scrollMonitor.js',
          'assets/scripts/_source/*.js'
          ],
        dest: 'assets/scripts/all.js',
      },
    },
    uglify: {
      my_target: {
        files: {
          'assets/scripts/all.js': ['assets/scripts/all.js']
        }
      }
    },
    watch: {
      scripts: {
        files: ['assets/scripts/_source/*.js'],
        tasks: ['concat'],
        options: {
          livereload: true,
        },
      },
    },
  });

  // load plugins
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // register tasks
  grunt.registerTask('default', ['concat', 'uglify']);
  grunt.registerTask('dev', ['concat', 'watch']);

};
