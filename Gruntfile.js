/*jshint camelcase:false */
/*
 * Mantri • ember.js • TodoMVC
 * https://github.com/thanpolas/todoAppMantri
 *
 * Copyright (c) 2013 Thanasis Polychronakis,
 *     Tom Dale, Стас Сушков
 * Licensed under the MIT license.
 */

module.exports = function (grunt) {
  'use strict';
  var mdoc = require('mdoc');

  var DIST_NAME = 'gremlin';

  grunt.loadNpmTasks('mantri');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-mocha');


  //
  // Grunt configuration:
  //
  //
  grunt.initConfig({
    coffee: {
      gremlinjs: {
        options: {
          bare: true,
          sourceMap: true
        },
        expand: true,
        cwd: 'src/scripts',
        src: ['**/*.coffee'],
        dest: 'src/.tmp/scripts',
        ext: '.js'
      }
    },
    mantriDeps: {
      options: {
        root: './src'
      },
      gremlinjs: {
        src: './src/.tmp/scripts',
        dest: './src/.tmp/deps.js'
      }

    },

    mantriBuild: {
      options: {
        debug: true
      },
      gremlinjs: {
        // src can be omitted as this is also the default value.
        src: 'src/mantriConf.json',
        dest: 'dist/' + DIST_NAME + '.js'
      }
    },

    watch: {
      gremlinjs: {
        files: ['src/scripts/**/*.coffee', 'src/mantriConf.json'],
        tasks: ['cs', 'mantriDeps:gremlinjs']
      },
      test: {
        files: ['src/scripts/**/*.coffee', 'src/mantriConf.json'],
        tasks: ['prepareTest'],
        options: {
          livereload: true
        }
      }
    },
    connect: {
      gremlinjs: {
        options: {
          port: 4243,
          base: './src'
          //keepalive: true
        }
      },
      test: {
        options: {
          port: 4243,
          base: './test'
          //keepalive: true
        }
      }
    },
    clean: {
      deps: ['src/.tmp/deps.js'],
      coffee: ["src/.tmp/scripts"],
      dist: ["dist"],
      test: ['test/.tmp','test/mantriConf.json','test/vendor']
    },
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
          '<%= grunt.template.today("yyyy-mm-dd") %> */',
        compress: true,
        report: 'gzip',
        wrap: true
      },
      dist: {
        files: {
          'dist/gremlin.min.js': ['dist/' + DIST_NAME + '.js']
        }
      },
      test: {
        options: {
          wrap: "gremlin",
          exportAll: true
        },
        files: {
          'test/src/gremlin.js': ['dist/' + DIST_NAME + '.js']
        }
      }
    },
    copy: {
      test: {
        files: [
          {
            expand: true,
            cwd: 'src/.tmp/',
            src: '**',
            dest: 'test/.tmp/'
          },
          {
            src: ['src/mantriConf.json'],
            dest: 'test/mantriConf.json'
          },
          {
            expand: true,
            cwd: 'src/vendor/',
            src: '**',
            dest: 'test/vendor/'
          }
        ]
      }
    },
    mocha: {

      // Runs 'test/test2.html' with specified mocha options.
      // This variant auto-includes 'bridge.js' so you do not have
      // to include it in your HTML spec file. Instead, you must add an
      // environment check before you run `mocha.run` in your HTML.
      test: {
        // Test files
        src: [ 'test/test.html' ],
        options: {
          // mocha options
          mocha: {
            //    ignoreLeaks : false,
            //    grep : 'food'
          },

          // Select a Mocha reporter - http://visionmedia.github.com/mocha/#reporters
          reporter: 'Nyan',

          // Indicates whether 'mocha.run()' should be executed in
          // 'bridge.js'. If you include `mocha.run()` in your html spec, you
          // must wrap it in a conditional check to not run if it is opened
          // in PhantomJS, see example/test/test2.html
          run: true
        }
      }
    }
  });

  grunt.registerTask('cs', ['clean:coffee', 'coffee:gremlinjs']);

  // Create shortcuts to main operations.
  grunt.registerTask('deps', ['clean:deps', 'mantriDeps:gremlinjs']);

  grunt.registerTask('build', ['cs', 'clean:dist', 'mantriBuild:gremlinjs', 'uglify:dist']);


  grunt.registerTask('prepareTest', ['cs', 'clean:test', 'deps', 'copy:test']);
  grunt.registerTask('test', ['prepareTest', 'connect:test', 'watch:test'/*, 'mocha:test'*/]);
  grunt.registerTask('server', ['cs', 'deps', 'connect:gremlinjs', 'watch:gremlinjs']);

  // the default task, when 'grunt' is executed with no options.
  grunt.registerTask('default', ['test']);

};

