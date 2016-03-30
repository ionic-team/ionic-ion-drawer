module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    connect: {
      demo: {
        options: {
          open: true,
          port: 8888,
          keepalive: true,
          base: '.'
        }  
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.registerTask('default', 'connect');

};