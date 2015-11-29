/*jshint node:true */
'use strict';

module.exports = function(grunt) {
    grunt.config.merge({
        copy: {
            buildStatic: {
                files: [{
                    expand: true,
                    cwd: '<%= env.DIR_SRC %>/assets',
                    src: [
                        '**/.htaccess',
                        '**/*.{asp,aspx,cshtml,jsp,php,py,rb,txt}',
                        'media/images/**',
                        'media/fonts/**',
                        '!vendor/**'
                    ],
                    dest: '<%= env.DIR_DEST %>/assets'
                }]
            }
        }
    });

    grunt.registerTask('buildStatic', [
        'copy:buildStatic',
    ]);
};