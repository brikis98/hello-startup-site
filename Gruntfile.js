module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        src: [
          'stylesheets/bootstrap.min.css',
          'stylesheets/bootstrap-theme.min.css',
          'stylesheets/main.css'
        ],
        dest: 'dist/all.css'
      },
      js: {
        src: [
          'javascripts/jquery.min.js',
          'javascripts/bootstrap.min.js',
          'javascripts/jquery.easing.min.js',
          'javascripts/jquery.jtruncate.js',
          'javascripts/main.js'
        ],
        dest: 'dist/all.js'
      }
    },
    cssmin: {
      target: {
        files: {'dist/all.min.css': ['dist/all.css']}
      }
    },
    uglify: {
      build: {
        files: {
          'dist/all.min.js': ['dist/all.js']
        }
      }
    },
    shell: {
      jekyllBuild : {
        command : 'jekyll build'
      },
      jekyllServe : {
        command : 'jekyll serve'
      }
    },
    watch: {
      js: {
        files: ['javascripts/*.js'],
        tasks: ['concat', 'uglify', 'shell:jekyllBuild']
      },
      css: {
        files: ['stylesheets/*.css'],
        tasks: ['concat', 'cssmin', 'shell:jekyllBuild']
      },
      jekyll: {
        files: ['*.html', '_includes/*.html', '_layouts/*.html', '_config.yml', 'images/*.*'],
        tasks: ['shell:jekyllBuild']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');

  grunt.registerTask('default', ['watch']);
};