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
        coffee : {
            gremlinjs : {
                options : {
                    bare : true
                },
                expand : true,
                cwd : 'app/scripts',
                src : ['**/*.coffee'],
                dest : 'app/.tmp/scripts',
                ext : '.js'
            }
        },
        mantriDeps : {
            options : {
                root : './app'
            },
            gremlinjs : {
                src : './app/.tmp/scripts',
                dest : './app/.tmp/deps.js'
            }

        },

        mantriBuild : {
            options : {
                debug : true
            },
            gremlinjs : {
                // src can be omitted as this is also the default value.
                src : 'app/mantriConf.json',
                dest : 'dist/' + DIST_NAME + '.js'
            }
        },

        watch : {
            gremlinjs : {
                files : ['app/scripts/**/*.coffee', 'app/mantriConf.json'],
                tasks : ['cs', 'mantriDeps:gremlinjs']
            }
        },
        connect : {
            gremlinjs : {
                options : {
                    port : 4242,
                    base : './app'
                    //keepalive: true
                }
            },
            test : {
                options : {
                    port : 4242,
                    base : './test',
                    keepalive : true
                }
            }
        },
        clean : {
            deps : ['app/.tmp/deps.js'],
            coffee : ["app/.tmp/scripts"],
            dist : ["dist"],
            docs: ["dist_docs"]
        },
        pkg : grunt.file.readJSON('package.json'),
        uglify : {
            options : {
                banner : '/*! <%= pkg.name %> - v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %> */',
                compress : true,
                report : 'gzip',
                wrap : true
            },
            dist : {
                files : {
                    'dist/gremlin.min.js' : ['dist/' + DIST_NAME + '.js']
                }
            },
            test : {
                options : {
                    wrap : "gremlin",
                    exportAll : true
                },
                files : {
                    'test/gremlinjs/gremlin.js' : ['dist/' + DIST_NAME + '.js']
                }
            }
        },
        copy : {
            test : {
                files : [
                    {src : ['dist/' + DIST_NAME + '.js'], dest : 'test/vendor/' + DIST_NAME + '.js'}
                ]
            }
        },
        mocha : {

            // Runs 'test/test2.html' with specified mocha options.
            // This variant auto-includes 'bridge.js' so you do not have
            // to include it in your HTML spec file. Instead, you must add an
            // environment check before you run `mocha.run` in your HTML.
            test : {
                // Test files
                src : [ 'test/test.html' ],
                options : {
                    // mocha options
                    mocha : {
                        //    ignoreLeaks : false,
                        //    grep : 'food'
                    },

                    // Select a Mocha reporter - http://visionmedia.github.com/mocha/#reporters
                    reporter : 'Nyan',

                    // Indicates whether 'mocha.run()' should be executed in 
                    // 'bridge.js'. If you include `mocha.run()` in your html spec, you
                    // must wrap it in a conditional check to not run if it is opened
                    // in PhantomJS, see example/test/test2.html
                    run : true
                }
            }
        }
    });

    grunt.registerTask('cs', ['clean:coffee', 'coffee:gremlinjs']);

    // Create shortcuts to main operations.
    grunt.registerTask('deps', ['clean:deps', 'mantriDeps:gremlinjs']);

    grunt.registerTask('build', ['docs', 'cs', 'clean:dist', 'mantriBuild:gremlinjs', 'uglify:dist']);
    grunt.registerTask('test', ['cs', 'clean:dist', 'mantriBuild:gremlinjs', 'uglify:test', 'mocha:test']);
    grunt.registerTask('server', ['cs', 'deps', 'connect:gremlinjs', 'watch:gremlinjs']);
    grunt.registerTask('docs', ['clean:docs', 'mdoc']);

    grunt.registerTask('mdoc', 'Generates documentation with mdoc', function() {

        mdoc.run({

            // === required settings === //

            inputDir : 'docs',
            outputDir : 'dist_docs',

            // === optional settings === //
            include : '*.mdown,*.md,*.markdown',
            baseTitle : 'GremlinJS API Documentation',
            indexContentPath : 'docs/GremlinJS.md',

            templatePath : 'docs/_tpl',

            mapTocName: function (fileName, tocObject) {
             /*   console.log("\n\n")
                //change the name displayed on the sidebar and on the index TOC
                console.log(fileName)
                console.log("\n\n")*/
                return fileName.replace('.html','').replace(/\\/g,'.');
            }

        });

        grunt.log.writeln('Generated docs.');
    });

    // the default task, when 'grunt' is executed with no options.
    grunt.registerTask('default', ['test']);

};

