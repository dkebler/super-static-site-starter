// 4S - Super Static Site Starter Entry Point
'use strict';

let Promise = require('promise');
let getlibs = require('require-all') ;

const repoPath = __dirname + '/';
const configJSPath = require(repoPath + 'package').configjspath || repoPath + 'config/config.js'; // 'configjspath' is key in package.json.  If not set default is used
const configPath = require(repoPath + 'package').configpath || repoPath + 'config/default.cson'; // 'configdir' is key in package.json.  If not set /config is the default

let config = require(configJSPath);
console.log(config.load);

init().then(config => {
    // configs loaded ok load the debugger here
    console.log('the configs from init', config)
  })
  .catch(e => console.log('error', e));

//*************************************
// Intialize 4S Environment
// loads in main and cli configs and builds cli
//*******************************************

function init() {

  let getMainConfig = config.load(configPath);
  let getCliConfig = getMainConfig.then(mainConfig => {
    config.load(repoPath + mainConfig.cliConfigPath);
    return config.load(mainConfig.cliConfigPath);
  });

  return Promise.all([getMainConfig, getCliConfig])
    .then(configs => {
      configs[0].cliData = configs[1]; // Add cli configuration data as a key in main config object
        let libs = getlibs({  // load all the repo js modules at once
        dirname: repoPath + configs[0].dir.lib,
        filter :/(.*)\.js$/,
        recursive: false
      });
      console.log('libs', libs);
      configs[0].lib = libs; //Add js libraries to config for easy access
      return configs[0]; // now return merged config file
    });
}
