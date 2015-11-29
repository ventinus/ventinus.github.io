/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    var shouldMinify = !grunt.option('dev');

    // Help Grunt find the right plugins at runtime
    require('jit-grunt')(grunt, {
        useminPrepare: 'grunt-usemin'
    });

    grunt.config.merge({
        // Copies static files for non-optimized builds
        copy: {
            buildScripts: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets',
                    dest: '<%= env.DIR_DEST %>/assets',
                    src: shouldMinify ? ['vendor/requirejs/require.js'] : ['{scripts,vendor}/**/*.js']
                }]
            },

            prodScripts: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets',
                    dest: '<%= env.DIR_TMP %>/assets',
                    src: ['scripts/config.js', 'vendor/requirejs/require.js']
                }]
            }
        },

        // RequireJS plugin that will use uglify2 to build and minify our
        // JavaScript, templates and any other data we include in the require
        // files.
        requirejs: {
            options: {
                // Path of source scripts, relative to this build file
                baseUrl: '<%= env.DIR_TMP %>/assets/scripts',

                // Path of shared configuration file
                mainConfigFile: '<%= env.DIR_TMP %>/assets/scripts/config.js',

                // Whether to generate source maps for easier debugging of
                // concatenated and minified code in the browser.
                generateSourceMaps: true,

                // Whether to preserve comments with a license. Not needed when,
                // and oddly incompatible with, generating a source map.
                preserveLicenseComments: false,

                // Allow `'use strict';` be included in the RequireJS files
                useStrict: true,

                // Comments that start with //>> are build pragmas. Exmaple:
                //
                //     //>>includeStart("isDev", pragmas.isDev);
                //     ... debugging code here ...
                //     //>>includeEnd("isDev");
                //
                pragmas: {
                    isProd: grunt.option('prod'),
                    isDev: grunt.option('dev')
                },

                // Whether and how to optimize
                optimize: 'uglify2',

                // Minification options
                uglify2: {
                    output: {
                        beautify: false,
                        comments: false
                    },
                    compress: {
                        sequences: false,
                        global_defs: { // jshint ignore:line
                            DEBUG: false
                        }
                    },
                    warnings: false,
                    mangle: true
                }
            },
            buildScripts: {
                options: {
                    // Name of input script (.js extension inferred)
                    name: 'main',

                    // Destination path of final output
                    out: '<%= env.DIR_DEST %>/assets/scripts/main.js',

                    // Override paths to exclude certain files from build
                    paths: {
                        modernizr: 'empty:'
                    }
                }
            }
        },


        // Babel ES6 Transpiling
        babel: {
            options: {
                sourceMap: true,
                modules: 'amd'
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets/scripts',
                    dest: shouldMinify ? '<%= env.DIR_TMP %>/assets/scripts' : '<%= env.DIR_DEST %>/assets/scripts',
                    src: ['**/*.js', '!config.js'] 
                }]
            }
        }
    });

    grunt.registerTask('buildScripts',
        shouldMinify ? [
            'copy:prodScripts',
            'copy:buildScripts',
            'babel',
            'requirejs:buildScripts'
        ] : [
            'copy:buildScripts',
            'babel:dist'
        ]
    );
};