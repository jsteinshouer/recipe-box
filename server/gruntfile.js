module.exports = function(grunt) {

  grunt.option('stack', true);

  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.initConfig({
    distdir: 'dist',
    src: {
      js: ['model/**/*.js', 'routes/**/*.js', 'app.js', 'config.js' ],
      specs: ['test/**/*.spec.js']
    },
    jasmine: {
      unit: ["./test/unit/"],
      integration: ["./test/integration/"]
    },
    jshint:{
      files:['gruntFile.js', '<%= src.js %>', '<%= src.specs %>'],
      options:{
        curly:true,
        eqeqeq:true,
        immed:true,
        latedef:true,
        newcap:true,
        noarg:true,
        sub:true,
        boss:true,
        eqnull:true,
        globals:{}
      }
    }
  });

  //grunt.loadNpmTasks('grunt-jasmine-node');
  grunt.registerTask('default', ['build']);
  grunt.registerTask('unit', ['jasmine:unit']);
  grunt.registerTask('e2e', ['jasmine:integration']);
  grunt.registerTask('build', ['jshint','jasmine:unit']);

  grunt.registerMultiTask('jasmine', 'Run Jasmine Tests', function() {
    var jasmine = require('jasmine-node');
    var util = require('util');

    var done = this.async();
    var onComplete = function(runner, log) {
        var exitCode;
        util.print('\n');
        if (runner.results().failedCount === 0) {
          exitCode = 0;
        } else {
          exitCode = 1;
          //process.exit(exitCode);
        }

        done();
    };

    var options = {
      specFolders: this.data,
      isVerbose: true,
      onComplete: onComplete,
      showColors: true,
      includeStackTrace: true
    };

    jasmine.executeSpecsInFolder(options);
  });

};