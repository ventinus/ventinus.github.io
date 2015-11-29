/*jshint node:true */
'use strict';

module.exports = function (grunt) {
    var originalForce = grunt.option('force') || false;

    grunt.registerTask('force', function(set) {
        switch (set) {
            case 'on':
                grunt.option('force', true);
                break;

            case 'off':
                grunt.option('force', false);
                break;

            case 'reset':
                /* falls through */
            default:
                grunt.option('force', originalForce);
                break;
        }
    });
};
