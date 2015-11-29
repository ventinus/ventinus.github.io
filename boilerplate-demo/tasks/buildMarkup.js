/*jshint node:true */
'use strict';

module.exports = function(grunt) {
  var shouldMinify = grunt.option('dev');

  grunt.config.merge({
    assemble: {
      options: {
        prettify: {
          indent: 2
        },
        marked: {
          sanitize: false
        },
        notProduction: shouldMinify,
        assets: '<%= env.DIR_SRC %>/assets',
        partials: ['<%= env.DIR_SRC %>/templates/partials/**/*.hbs'],
        layoutdir: '<%= env.DIR_SRC %>/templates/layouts'
      },
      site: {
        // Target-level options
        options: {
          layout: 'default.hbs'
        },
        files: [{
          expand: true,
          cwd: '<%= env.DIR_SRC %>/templates/pages',
          src: ['*.hbs'],
          dest: '<%= env.DIR_DEST %>'
        }]
      }
    }
  });

  grunt.registerTask('buildMarkup', [
    'assemble:site',

  ]);
};
