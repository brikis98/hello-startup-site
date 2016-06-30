module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      css: {
        src: [
          'stylesheets/bootstrap.min.css',
          'stylesheets/bootstrap-theme.min.css',
          'stylesheets/font-awesome.css',
          'stylesheets/google-fonts.css',
          'stylesheets/main.css'
        ],
        dest: 'dist/all.css'
      },
      js: {
        src: [
          'javascripts/jquery.min.js',
          'javascripts/underscore.js',
          'javascripts/backbone.js',
          'javascripts/bootstrap.min.js',
          'javascripts/jquery.easing.min.js',
          'javascripts/jquery.jtruncate.js',
          'javascripts/jquery.unveil.js',
          'javascripts/jquery.appear.js',
          'javascripts/jquery-ui-effects-only.js',
          'javascripts/numeral.js',
          'javascripts/main.js',
          'javascripts/equity.js'
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
        command : 'bundle exec jekyll build --incremental'
      },
      jekyllServe : {
        command : 'bundle exec jekyll serve --incremental --host 0.0.0.0'
      }
    },
    connect: {
      server: {
        options: {
          base: '_site/',
          port: 4000
        }
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
        files: [
          '*.html',
          'resources/*.html',
          'resources/**/*.html',
          '_data/**/*.yml',
          '_includes/*.html',
          '_layouts/*.html',
          '_config.yml',
          'mobile/index.html',
          'images/**/*.*'
        ],
        tasks: ['shell:jekyllBuild']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('serve', [
    'shell:jekyllBuild',
    'connect:server',
    'watch'
  ]);

  grunt.registerTask('default', ['serve']);
};