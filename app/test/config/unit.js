// base path, that will be used to resolve files and exclude
basePath = '../..';

// list of files / patterns to load in the browser
files = [
  JASMINE,
  JASMINE_ADAPTER,
  'http://code.jquery.com/jquery.js',
  'http://netdna.bootstrapcdn.com/bootstrap/3.0.2/js/bootstrap.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular.min.js',
  'http://ajax.googleapis.com/ajax/libs/angularjs/1.2.3/angular-mocks.js',
  'src/**/*.js',
  'test/mocks/**/*.js',
  'test/unit/**/*.spec.js',
  'dist/assets/js/templates.js'
];

// use dots reporter, as travis terminal does not support escaping sequences
// possible values: 'dots' || 'progress'
reporters = 'progress';

// these are default values, just to show available options

// web server port
port = 8089;

// cli runner port
runnerPort = 9109;

urlRoot = '/__test/';

// enable / disable colors in the output (reporters and logs)
colors = true;

// level of logging
// possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
logLevel = LOG_INFO;

// enable / disable watching file and executing tests whenever any file changes
autoWatch = false;

// polling interval in ms (ignored on OS that support inotify)
autoWatchInterval = 0;

// Start these browsers, currently available:
// - Chrome
// - ChromeCanary
// - Firefox
// - Opera
// - Safari
// - PhantomJS
//browsers = ['Chrome'];
browsers = ['PhantomJS'];

// Continuous Integration mode
// if true, it capture browsers, run tests and exit
singleRun = true;
