'use strict';
module.exports = function (grunt) {
  grunt.initConfig({
    browserify: {
      dist: {
        files: {
          'dist/browser.js': 'lib/index.js'
        }
      },
      options: {
        alias: ['./lib/index.js:animate'],
        browserifyOptions: {
          debug: true,
          transform: '6to5-browserify'
        }
      }
    },
    '6to5': {
      dist: {
        files: {
          'dist/node.js': 'lib/index.js'
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          position: 'bottom',
          banner: 'window.animate = require("animate").default;'
        },
        files: {
          src: ['dist/browser.js']
        }
      }
    },
    watch: {
      dist: {
        files: ['lib/*.js'],
        tasks: ['browserify', '6to5', 'usebanner']
      },
      options: {
        atBegin: true
      }
    }
  });
  require('load-grunt-tasks')(grunt);

  grunt.registerTask('default', ['watch']);
};
