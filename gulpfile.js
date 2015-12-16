// Gulp Task File, see /lib for details of various tasks

// set global master config file path in package.json or use default  config/index.js
Configfilepath = require('./package').configfilepath || 'config/';
// Have the main config file be global
var ds = require('dot-slash').enforce;
Config = require(ds(Configfilepath));

// Promise = require('any-promise');
// Promise = require('q');
Promise = require('bluebird');

var gulp = require('gulp');
require(Config.libDirectory + 'debug');  // see debug.js in library to turn on/off/customize debugging
var argv = require('yargs').argv;  // for gulp tasks accepting arguments (deploy)

function error(){console.log('something bad happened');}

// *********************
// Task - DEFAULT
// just allows you to point to the default (just "gulp") task (currently set to task 'dev')
// *********************
gulp.task('default', ['dev']);


// *******************
// Task - DEV
// Builds development version of assets and html and then starts browser with sync and a file watcher
// *******************
gulp.task('dev', function() {

var sequence = new require('promise-sequence');

var build = require(Config.libDirectory + 'build');
var watch = require(Config.libDirectory +'watch');

Config.buildType='dev';
Config.url = 'localhost:' + Config.localport;

//  return sequence([build,watch]);

return  build()
   .then(res => console.log('build complete'))
   .then(watch)
   .catch(function(e){console.log('error: ', e)})
   ;

});


// *******************
// Task - DEPLOY
// Builds distribution version of assets and html and then deploys based on default (s3) or argument passed (e.g. --gh)
// *******************


gulp.task('deploy',function() {

var sequence = new require('promise-sequence');

var deployto = 's3';  // default
if (Object.keys(argv)[1]!=='$0') {deployto = Object.keys(argv)[1]}
debug('arguments to deploy, all, 1, 2 :', argv, Object.keys(argv)[1],Object.keys(argv)[2]);

// used to open a browser to view deployed site

var view = function(){require('open')('http://' + Config.url)};
var build = require(Config.libDirectory + 'build');
var sync = require(Config.libDirectory +'deploy-'+ deployto);

info('Starting deployment to', deployto);

var cdeploy = require(Config.configDirectory + 'deploy-' + deployto );

// see if location is other than default based on CLI arguments
if (Object.keys(argv)[2]!== undefined) {cdeploy.location = Object.keys(argv)[2]}

debug('bucket location: ',cdeploy.location);
debug2('deployment config: ',cdeploy);

Config.buildType='dist';
Config.url = cdeploy[cdeploy.location].url;

debug('deployurl', Config.url);

return build()
      .then(res => info('build complete'))
      .then(sync)
      .then(res => info('opening browser'))
      .then(view)
      .catch(function(e){console.log('error: ', e)});

// return sequence([build,sync,view]);

});


// ************************
// Task - sass:paths
// Generate the bower sass paths file sass-bower.json in the config directory
// This task is only needed after a bower uninstall
// *************************
gulp.task('sass:paths', function () {

require('../lib/sass-bower')();

});


// ************************
// Task - TODO
// generate a todo.md in root of repo.  uses leasot  https://github.com/pgilad/leasot
// *************************
gulp.task('todo', function() {

require(Config.libDirectory + '/todo')();

});

// ************************
// Task - TEST
// want to test come code?  Just put it in testing.js in the library directory
// *************************
gulp.task('test', function() {

var foo = require(Config.libDirectory + 'testing').vfs;

function bar() {
    console.log('Now doing Bar stuff');
}

function oopsBar() {
    console.log('Something went wrong up before');
}

var p = foo('./builds/**/*.*' );

return p.then( bar, oopsBar );

// console.log(p);


});

// ************************
// Task - HELP
// Lists all the tasks in this gulpfile.js to the console.
// *************************
var taskListing = require('gulp-task-listing');
gulp.task('help', taskListing);
