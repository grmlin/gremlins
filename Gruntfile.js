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

    grunt.loadNpmTasks('mantri');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks('grunt-contrib-coffee');
    grunt.loadNpmTasks('grunt-contrib-clean');


    //
    // Grunt configuration:
    //
    //
    grunt.initConfig({
        coffee: {
            gremlinjs: {
                options: {
                    bare: true
                },
                expand: true,
                cwd: 'app/scripts',
                src: ['**/*.coffee'],
                dest: 'app/.tmp/scripts',
                ext: '.js'
            }
        },
        mantriDeps: {
            options: {
                root: './app'
            },
            gremlinjs: {
                src: './app/.tmp/scripts',
                dest: './app/.tmp/deps.js'
            }

        },

        mantriBuild: {
            options: {
                debug: true
            },
            gremlinjs: {
                // src can be omitted as this is also the default value.
                src: 'app/mantriConf.json',
                dest: 'dist/gremlinjs.min.js'
            }
        },

        watch: {
            gremlinjs: {
                files: ['app/scripts/**/*.coffee', 'app/mantriConf.json'],
                tasks: ['cs', 'mantriDeps:gremlinjs']
            }
        },
        connect: {
            gremlinjs: {
                options: {
                    port: 4242,
                    base: './app'
                    //keepalive: true
                }
            }
        },
        clean: {
            deps: ['app/.tmp/deps.js'],
            coffee: ["app/.tmp/scripts"],
            dist: ["dist"]
        }
    });

    grunt.registerTask('cs', ['clean:coffee', 'coffee:gremlinjs']);
    // Create shortcuts to main operations.
    grunt.registerTask('deps', ['clean:deps','mantriDeps:gremlinjs']);

    grunt.registerTask('build', ['clean:dist','mantriBuild:gremlinjs']);
    grunt.registerTask('server', ['cs', 'deps', 'connect:gremlinjs', 'watch:gremlinjs']);
    // the default task, when 'grunt' is executed with no options.
    grunt.registerTask('default', ['test']);

};

