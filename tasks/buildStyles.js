/*jshint node:true, laxbreak:true */
'use strict';

module.exports = function(grunt) {
    grunt.config.merge({
        sass: {
            buildStyles: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets/scss',
                    src: ['**/*.scss'],
                    dest: '<%= env.DIR_DEST %>/assets/styles',
                    ext: '.css'
                }],
                options: {
                    outputStyle: (grunt.option('prod') ? 'compressed' : 'nested')
                }
            }
        },
        postcss: {
            options: {
                map: false,
                processors: [
                    require('autoprefixer-core')({
                        browsers: ['last 10 versions', 'ie 9', '> 0.5%']
                    })
                ]
            },
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_DEST %>/assets/styles',
                    src: ['**/*.css'],
                    dest: '<%= env.DIR_DEST %>/assets/styles'
                }]
            }
        }

    });

    grunt.registerTask('buildStyles', [
        'sass:buildStyles',
        'postcss:dist'
    ]);
};